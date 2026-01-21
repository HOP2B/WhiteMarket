import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import { useNotifications } from "../context/NotificationContext";
import {
  getMessages,
  sendMessage,
  getUserById,
  searchUsers,
  markMessagesAsRead,
} from "../api/mockApi";
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
  const { addNotification } = useNotifications();
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
  const [userSearchQuery, setUserSearchQuery] = useState("");
  const [userSearchResults, setUserSearchResults] = useState<any[]>([]);
  const [showUserSearch, setShowUserSearch] = useState(false);
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
            const dbMessage = payload.new;
            const newMessage: Message = {
              id: dbMessage.id,
              senderId: dbMessage.sender_id,
              receiverId: dbMessage.receiver_id,
              content: dbMessage.content,
              timestamp: dbMessage.timestamp,
              status: dbMessage.status || "sent",
              file: dbMessage.file,
            };
            if (
              newMessage.senderId === user.id ||
              newMessage.receiverId === user.id
            ) {
              setMessages((prev) => [...prev, newMessage]);

              // Add notification if not currently viewing this conversation
              if (
                newMessage.senderId !== user.id &&
                selectedConversation !== newMessage.senderId
              ) {
                const sender = conversationUsers[newMessage.senderId];
                addNotification({
                  type: "message",
                  title: `New message from ${sender?.name || "Unknown"}`,
                  message: newMessage.content || "Sent a file",
                  actionUrl: `/messages?contact=${newMessage.senderId}`,
                });
              }
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

  useEffect(() => {
    if (selectedConversation && user) {
      const unreadMessages = messages.filter(
        (msg) =>
          msg.receiverId === user.id &&
          msg.senderId === selectedConversation &&
          msg.status !== "read",
      );
      if (unreadMessages.length > 0) {
        const messageIds = unreadMessages.map((msg) => msg.id);
        markMessagesAsRead(messageIds).catch(console.error);
        // Update local state
        setMessages((prev) =>
          prev.map((msg) =>
            messageIds.includes(msg.id) ? { ...msg, status: "read" } : msg,
          ),
        );
      }
    }
  }, [selectedConversation, messages, user]);

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

      const sentMessage = await sendMessage(message);
      setMessages([...messages, sentMessage]);
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

  const handleUserSearch = async (query: string) => {
    if (query.trim().length < 2) {
      setUserSearchResults([]);
      return;
    }
    try {
      const results = await searchUsers(query);
      setUserSearchResults(results.filter((u) => u.id !== user?.id));
    } catch (error) {
      console.error("Error searching users:", error);
      setUserSearchResults([]);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-green-50 to-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-white">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-2xl font-bold text-green-800 animate-fade-in">
            Please login to view messages
          </h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-blue-800 mb-8 animate-fade-in">
          Messages
        </h1>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-1/4 bg-white rounded-xl shadow-lg border border-blue-100 overflow-hidden animate-slide-in-left">
            <div className="p-4 border-b border-blue-200 bg-blue-50">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-xl font-bold text-blue-800">
                  {showUserSearch ? "Search Users" : "Conversations"}
                </h2>
                <button
                  onClick={() => {
                    setShowUserSearch(!showUserSearch);
                    setUserSearchQuery("");
                    setUserSearchResults([]);
                  }}
                  className="text-green-600 hover:text-green-700 text-sm font-medium transition-colors duration-200 hover:scale-105"
                >
                  {showUserSearch ? "Back to Conversations" : "Search Users"}
                </button>
              </div>
              {showUserSearch ? (
                <input
                  type="text"
                  placeholder="Search users by name..."
                  value={userSearchQuery}
                  onChange={(e) => {
                    setUserSearchQuery(e.target.value);
                    handleUserSearch(e.target.value);
                  }}
                  className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                />
              ) : (
                <input
                  type="text"
                  placeholder="Хайх..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-3 py-2 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                />
              )}
            </div>
            <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
              {showUserSearch
                ? userSearchResults.map((userResult) => (
                    <div
                      key={userResult.id}
                      className="p-4 cursor-pointer hover:bg-blue-50 transition-all duration-200 hover:shadow-sm animate-fade-in"
                      onClick={() => {
                        setSelectedConversation(userResult.id);
                        setShowUserSearch(false);
                        setUserSearchQuery("");
                        setUserSearchResults([]);
                        // Add user to conversationUsers if not already there
                        setConversationUsers((prev) => ({
                          ...prev,
                          [userResult.id]: userResult,
                        }));
                      }}
                    >
                      <div className="flex items-center">
                        <img
                          src={userResult.avatar || "/default-avatar.jpg"}
                          alt={userResult.name}
                          className="w-10 h-10 rounded-full mr-3"
                        />
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900">
                            {userResult.name}
                          </p>
                          <p className="text-sm text-gray-500">
                            {userResult.bio || "No bio available"}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                : filteredConversations.map((conversationId) => {
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
                        className={`p-4 cursor-pointer hover:bg-green-50 transition-all duration-200 hover:shadow-md ${
                          selectedConversation === conversationId
                            ? "bg-green-100 border-l-4 border-green-500"
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
                                <span className="bg-green-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center ml-2 animate-pulse shadow-lg">
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

          <div className="lg:w-3/4 bg-white rounded-xl shadow-lg border border-blue-100 animate-slide-in-right">
            <div className="p-4 border-b border-blue-200 bg-blue-50">
              <h2 className="text-xl font-bold text-blue-800">Conversation</h2>
            </div>

            <div className="p-4 h-96 overflow-y-auto">
              {selectedConversation ? (
                <>
                  {(() => {
                    const conversationMessages = messages.filter(
                      (msg) =>
                        (msg.senderId === user.id &&
                          msg.receiverId === selectedConversation) ||
                        (msg.senderId === selectedConversation &&
                          msg.receiverId === user.id),
                    );
                    const lastReadMessage = conversationMessages
                      .filter(
                        (msg) =>
                          msg.senderId === user.id && msg.status === "read",
                      )
                      .sort(
                        (a, b) =>
                          new Date(b.timestamp).getTime() -
                          new Date(a.timestamp).getTime(),
                      )[0];
                    const otherUser = conversationUsers[selectedConversation];

                    return conversationMessages.map((message) => (
                      <div
                        key={message.id}
                        className={`mb-4 flex ${
                          message.senderId === user.id
                            ? "justify-end"
                            : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-xs lg:max-w-md rounded-2xl p-4 shadow-sm transition-all duration-300 animate-fade-in ${
                            message.senderId === user.id
                              ? "bg-blue-500 text-white ml-auto"
                              : "bg-white text-gray-900 border border-blue-200"
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
                                  ? "text-blue-100"
                                  : "text-gray-500"
                              }`}
                            >
                              {new Date(message.timestamp).toLocaleTimeString()}
                            </p>
                            <div className="flex items-center">
                              {message.senderId === user.id &&
                                lastReadMessage?.id === message.id && (
                                  <img
                                    src={
                                      otherUser?.avatar || "/default-avatar.jpg"
                                    }
                                    alt="Read by"
                                    className="w-4 h-4 rounded-full mr-1"
                                  />
                                )}
                              {message.senderId === user.id && (
                                <span className="text-xs text-blue-100">
                                  {message.status === "sent" && "✓"}
                                  {message.status === "delivered" && "✓✓"}
                                  {message.status === "read" && "✓✓"}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ));
                  })()}
                  {/* Typing Indicator */}
                  {userStatuses[selectedConversation]?.isTyping && (
                    <div className="mb-4 flex justify-start animate-fade-in">
                      <div className="bg-white text-gray-900 rounded-2xl p-4 border border-green-200 shadow-sm">
                        <div className="flex items-center space-x-2">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce"></div>
                            <div
                              className="w-2 h-2 bg-green-500 rounded-full animate-bounce"
                              style={{ animationDelay: "0.1s" }}
                            ></div>
                            <div
                              className="w-2 h-2 bg-green-500 rounded-full animate-bounce"
                              style={{ animationDelay: "0.2s" }}
                            ></div>
                          </div>
                          <span className="text-xs text-green-600 ml-2">
                            Бичиж байна...
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </>
              ) : (
                <div className="flex items-center justify-center h-full animate-fade-in">
                  <p className="text-green-600 text-lg">
                    Харилцагчийг сонгоод зурвас бичих боломжтой
                  </p>
                </div>
              )}
            </div>

            {selectedConversation && (
              <div className="p-4 border-t border-blue-200 bg-blue-50">
                {selectedFile && (
                  <div className="mb-2 p-3 bg-white rounded-lg border border-blue-200 flex items-center justify-between shadow-sm animate-slide-in-up">
                    <div className="flex items-center">
                      <span className="text-blue-600 mr-2">📎</span>
                      <span className="text-sm text-gray-700">
                        {selectedFile.name}
                      </span>
                    </div>
                    <button
                      onClick={() => setSelectedFile(null)}
                      className="text-red-500 hover:text-red-700 text-sm transition-colors duration-200 hover:scale-110"
                    >
                      ✕
                    </button>
                  </div>
                )}
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    className="bg-white text-blue-600 px-4 py-3 rounded-xl hover:bg-blue-50 transition-all duration-200 hover:scale-105 shadow-sm border border-blue-200"
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
                    className="flex-1 px-4 py-3 border border-blue-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white shadow-sm"
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  />
                  <label className="cursor-pointer bg-white text-green-600 px-4 py-3 rounded-xl hover:bg-green-50 transition-all duration-200 hover:scale-105 shadow-sm border border-green-200 flex items-center">
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
                    className="bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105 shadow-lg disabled:shadow-none"
                  >
                    Илгээх
                  </button>
                </div>

                {/* Emoji Picker */}
                {showEmojiPicker && (
                  <div className="absolute bottom-20 left-4 bg-white border border-green-300 rounded-xl p-4 shadow-xl animate-slide-in-up">
                    <div className="grid grid-cols-8 gap-3">
                      {["😀", "😂", "❤️", "👍", "👎", "🔥", "💯", "🙏"].map(
                        (emoji) => (
                          <button
                            key={emoji}
                            onClick={() => {
                              setNewMessage((prev) => prev + emoji);
                              setShowEmojiPicker(false);
                            }}
                            className="text-2xl hover:bg-green-50 rounded-lg p-2 transition-all duration-200 hover:scale-110"
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
