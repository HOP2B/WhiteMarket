import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import { getMessages, sendMessage, getUserById } from "../api/mockApi";
import { supabase } from "../lib/supabase";

interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
  status: "sent" | "delivered" | "read";
  file?: {
    name: string;
    size: number;
    type: string;
    url: string;
  };
}

interface UserStatus {
  [userId: string]: {
    isOnline: boolean;
    lastSeen: string;
    isTyping: boolean;
  };
}

const Messages: React.FC = () => {
  const { user } = useAuth();
  const router = useRouter();
  const { contact } = router.query;
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState("");
  const [selectedConversation, setSelectedConversation] = useState<
    string | null
  >(null);
  const [conversationUsers, setConversationUsers] = useState<any>({});
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [userStatuses, setUserStatuses] = useState<UserStatus>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (user) {
      const fetchMessages = async () => {
        try {
          const data = (await getMessages(user.id)) as any[];
          setMessages(data);

          // Fetch user data for conversations
          const userIds = Array.from(
            new Set(
              data.map((msg) =>
                msg.senderId === user.id ? msg.receiverId : msg.senderId,
              ),
            ),
          );

          const userPromises = userIds.map((id) => getUserById(id));
          const users = await Promise.all(userPromises);
          const userMap: any = {};
          users.forEach((u, index) => {
            userMap[userIds[index]] = u;
          });
          setConversationUsers(userMap);

          setLoading(false);
        } catch (error) {
          console.error("Error fetching messages:", error);
          setLoading(false);
        }
      };

      fetchMessages();

      // Subscribe to new messages
      const subscription = supabase
        .channel("messages")
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "messages",
          },
          (payload) => {
            const newMessage = payload.new as Message;
            if (
              newMessage.senderId === user.id ||
              newMessage.receiverId === user.id
            ) {
              setMessages((prev) => [...prev, newMessage]);
            }
          },
        )
        .subscribe();

      return () => {
        subscription.unsubscribe();
      };
    }
  }, [user]);

  useEffect(() => {
    if (contact && typeof contact === "string") {
      setSelectedConversation(contact);
    }
  }, [contact]);

  const handleSendMessage = async () => {
    if ((!newMessage.trim() && !selectedFile) || !user || !selectedConversation)
      return;

    try {
      const message: Message = {
        id: Date.now().toString(),
        senderId: user.id,
        receiverId: selectedConversation,
        content: newMessage,
        timestamp: new Date().toISOString(),
        status: "sent",
      };

      if (selectedFile) {
        // Simulate file upload
        message.file = {
          name: selectedFile.name,
          size: selectedFile.size,
          type: selectedFile.type,
          url: URL.createObjectURL(selectedFile), // In production, this would be uploaded to cloud storage
        };
      }

      await sendMessage(message);
      setMessages([...messages, message]);
      setNewMessage("");
      setSelectedFile(null);

      // Stop typing indicator
      setIsTyping(false);
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleTyping = () => {
    if (!isTyping && selectedConversation) {
      setIsTyping(true);
      // In a real app, you'd emit a typing event to the other user
      console.log("User is typing...");
    }

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set new timeout to stop typing indicator
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      console.log("User stopped typing");
    }, 2000);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, selectedConversation]);

  const conversations = Array.from(
    new Set(
      messages.map((msg) =>
        msg.senderId === user?.id ? msg.receiverId : msg.senderId,
      ),
    ),
  );

  const filteredConversations = conversations.filter((conversationId) => {
    const otherUser = conversationUsers[conversationId];
    return (
      !searchQuery ||
      otherUser?.name?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const getUnreadCount = (conversationId: string) => {
    return messages.filter(
      (msg) =>
        msg.receiverId === user?.id &&
        msg.senderId === conversationId &&
        msg.status !== "read",
    ).length;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-2xl font-bold text-gray-900">
            Please login to view messages
          </h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Messages</h1>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-1/4 bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-4 border-b">
              <h2 className="text-xl font-bold text-gray-900">Conversations</h2>
              <input
                type="text"
                placeholder="Хайх..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
              {filteredConversations.map((conversationId) => {
                const conversationMessages = messages.filter(
                  (msg) =>
                    (msg.senderId === user?.id &&
                      msg.receiverId === conversationId) ||
                    (msg.senderId === conversationId &&
                      msg.receiverId === user?.id),
                );
                const lastMessage =
                  conversationMessages[conversationMessages.length - 1];
                const otherUser = conversationUsers[conversationId];
                const unreadCount = getUnreadCount(conversationId);
                const userStatus = userStatuses[conversationId];

                return (
                  <div
                    key={conversationId}
                    className={`p-4 cursor-pointer hover:bg-gray-50 ${
                      selectedConversation === conversationId
                        ? "bg-gray-100"
                        : ""
                    }`}
                    onClick={() => setSelectedConversation(conversationId)}
                  >
                    <div className="flex items-center">
                      <div className="relative">
                        <img
                          src={otherUser?.avatar || "/default-avatar.jpg"}
                          alt={otherUser?.name || "User"}
                          className="w-10 h-10 rounded-full mr-3"
                        />
                        {userStatus?.isOnline && (
                          <div className="absolute bottom-0 right-3 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-center">
                          <p className="font-semibold text-gray-900">
                            {otherUser?.name || `User ${conversationId}`}
                          </p>
                          {lastMessage && (
                            <p className="text-xs text-gray-500">
                              {new Date(
                                lastMessage.timestamp,
                              ).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                        <div className="flex justify-between items-center">
                          <p className="text-sm text-gray-500 truncate flex-1">
                            {lastMessage?.content || "No messages yet"}
                          </p>
                          {unreadCount > 0 && (
                            <span className="bg-green-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center ml-2">
                              {unreadCount}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="lg:w-3/4 bg-white rounded-lg shadow-md">
            <div className="p-4 border-b">
              <h2 className="text-xl font-bold text-gray-900">Conversation</h2>
            </div>

            <div className="p-4 h-96 overflow-y-auto">
              {selectedConversation ? (
                <>
                  {messages
                    .filter(
                      (msg) =>
                        (msg.senderId === user.id &&
                          msg.receiverId === selectedConversation) ||
                        (msg.senderId === selectedConversation &&
                          msg.receiverId === user.id),
                    )
                    .map((message) => (
                      <div
                        key={message.id}
                        className={`mb-4 flex ${
                          message.senderId === user.id
                            ? "justify-end"
                            : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-xs lg:max-w-md rounded-lg p-3 ${
                            message.senderId === user.id
                              ? "bg-green-600 text-white"
                              : "bg-gray-200 text-gray-900"
                          }`}
                        >
                          {message.file && (
                            <div className="mb-2">
                              <div className="bg-black bg-opacity-20 rounded p-2">
                                <div className="flex items-center">
                                  <span className="text-xs mr-2">📎</span>
                                  <div>
                                    <p className="text-xs font-medium">
                                      {message.file.name}
                                    </p>
                                    <p className="text-xs opacity-75">
                                      {(message.file.size / 1024).toFixed(1)} KB
                                    </p>
                                  </div>
                                </div>
                                {message.file.type.startsWith("image/") && (
                                  <img
                                    src={message.file.url}
                                    alt={message.file.name}
                                    className="mt-2 max-w-full h-auto rounded"
                                    style={{ maxHeight: "200px" }}
                                  />
                                )}
                              </div>
                            </div>
                          )}
                          {message.content && (
                            <p className="text-sm">{message.content}</p>
                          )}
                          <div className="flex items-center justify-between mt-1">
                            <p
                              className={`text-xs ${
                                message.senderId === user.id
                                  ? "text-green-100"
                                  : "text-gray-500"
                              }`}
                            >
                              {new Date(message.timestamp).toLocaleTimeString()}
                            </p>
                            {message.senderId === user.id && (
                              <span className="text-xs text-green-100">
                                {message.status === "sent" && "✓"}
                                {message.status === "delivered" && "✓✓"}
                                {message.status === "read" && "✓✓"}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  {/* Typing Indicator */}
                  {userStatuses[selectedConversation]?.isTyping && (
                    <div className="mb-4 flex justify-start">
                      <div className="bg-gray-200 text-gray-900 rounded-lg p-3">
                        <div className="flex items-center space-x-1">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                            <div
                              className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
                              style={{ animationDelay: "0.1s" }}
                            ></div>
                            <div
                              className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
                              style={{ animationDelay: "0.2s" }}
                            ></div>
                          </div>
                          <span className="text-xs text-gray-500 ml-2">
                            Бичиж байна...
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-gray-500">
                    Харилцагчийг сонгоод зурвас бичих боломжтой
                  </p>
                </div>
              )}
            </div>

            {selectedConversation && (
              <div className="p-4 border-t">
                {selectedFile && (
                  <div className="mb-2 p-2 bg-gray-100 rounded flex items-center justify-between">
                    <div className="flex items-center">
                      <span className="text-sm mr-2">📎</span>
                      <span className="text-sm">{selectedFile.name}</span>
                    </div>
                    <button
                      onClick={() => setSelectedFile(null)}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      ✕
                    </button>
                  </div>
                )}
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    className="bg-gray-200 text-gray-700 px-3 py-2 rounded-md hover:bg-gray-300"
                  >
                    😀
                  </button>
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => {
                      setNewMessage(e.target.value);
                      handleTyping();
                    }}
                    placeholder="Зурвас бичнэ үү..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  />
                  <label className="cursor-pointer bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 flex items-center">
                    <span className="mr-1">📎</span>
                    <input
                      type="file"
                      onChange={handleFileSelect}
                      className="hidden"
                      accept="image/*,.pdf,.doc,.docx,.txt"
                    />
                  </label>
                  <button
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim() && !selectedFile}
                    className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Илгээх
                  </button>
                </div>

                {/* Emoji Picker */}
                {showEmojiPicker && (
                  <div className="absolute bottom-16 left-4 bg-white border border-gray-300 rounded-lg p-3 shadow-lg">
                    <div className="grid grid-cols-8 gap-2">
                      {["😀", "😂", "❤️", "👍", "👎", "🔥", "💯", "🙏"].map(
                        (emoji) => (
                          <button
                            key={emoji}
                            onClick={() => {
                              setNewMessage((prev) => prev + emoji);
                              setShowEmojiPicker(false);
                            }}
                            className="text-2xl hover:bg-gray-100 rounded p-1"
                          >
                            {emoji}
                          </button>
                        ),
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;
