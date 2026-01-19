import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import { getMessages, sendMessage, getUserById } from "../api/mockApi";
import { supabase } from "../lib/supabase";

const Messages: React.FC = () => {
  const { user } = useAuth();
  const router = useRouter();
  const { contact } = router.query;
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState("");
  const [selectedConversation, setSelectedConversation] = useState<
    string | null
  >(null);
  const [conversationUsers, setConversationUsers] = useState<any>({});

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
            const newMessage = payload.new;
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
    if (!newMessage.trim() || !user || !selectedConversation) return;

    try {
      const message = {
        id: Date.now().toString(),
        senderId: user.id,
        receiverId: selectedConversation,
        content: newMessage,
        timestamp: new Date().toISOString(),
      };

      await sendMessage(message);
      setMessages([...messages, message]);
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const conversations = Array.from(
    new Set(
      messages.map((msg) =>
        msg.senderId === user?.id ? msg.receiverId : msg.senderId,
      ),
    ),
  );

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
            </div>
            <div className="divide-y divide-gray-200">
              {conversations.map((conversationId) => {
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
                      <img
                        src={otherUser?.avatar || "/default-avatar.jpg"}
                        alt={otherUser?.name || "User"}
                        className="w-10 h-10 rounded-full mr-3"
                      />
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">
                          {otherUser?.name || `User ${conversationId}`}
                        </p>
                        <p className="text-sm text-gray-500 truncate">
                          {lastMessage?.content}
                        </p>
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
                messages
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
                        <p className="text-sm">{message.content}</p>
                        <p
                          className={`text-xs mt-1 ${
                            message.senderId === user.id
                              ? "text-green-100"
                              : "text-gray-500"
                          }`}
                        >
                          {new Date(message.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-gray-500">
                    Select a conversation to view messages
                  </p>
                </div>
              )}
            </div>

            {selectedConversation && (
              <div className="p-4 border-t">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  />
                  <button
                    onClick={handleSendMessage}
                    className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700"
                  >
                    Send
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;
