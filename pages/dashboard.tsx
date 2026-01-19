import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import { getGigs } from "../api/mockApi";

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [gigs, setGigs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    const fetchGigs = async () => {
      try {
        const data = (await getGigs()) as any[];
        setGigs(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching gigs:", error);
        setLoading(false);
      }
    };

    fetchGigs();
  }, []);

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
            Please login to view dashboard
          </h1>
        </div>
      </div>
    );
  }

  const userGigs = gigs.filter((gig) => gig.userId === user.id);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-1/4">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center mb-6">
                <img
                  src={user.avatar || "/default-avatar.jpg"}
                  alt={user.name}
                  className="w-16 h-16 rounded-full mr-4"
                />
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    {user.name}
                  </h2>
                  <p className="text-gray-600">{user.email}</p>
                </div>
              </div>

              <nav className="space-y-2">
                <button
                  onClick={() => setActiveTab("overview")}
                  className={`w-full text-left p-2 rounded-md ${
                    activeTab === "overview"
                      ? "bg-green-600 text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  Overview
                </button>
                <button
                  onClick={() => setActiveTab("gigs")}
                  className={`w-full text-left p-2 rounded-md ${
                    activeTab === "gigs"
                      ? "bg-green-600 text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  My Gigs
                </button>
                <button
                  onClick={() => setActiveTab("orders")}
                  className={`w-full text-left p-2 rounded-md ${
                    activeTab === "orders"
                      ? "bg-green-600 text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  Orders
                </button>
                <button
                  onClick={() => setActiveTab("messages")}
                  className={`w-full text-left p-2 rounded-md ${
                    activeTab === "messages"
                      ? "bg-green-600 text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  Messages
                </button>
                <button
                  onClick={() => setActiveTab("settings")}
                  className={`w-full text-left p-2 rounded-md ${
                    activeTab === "settings"
                      ? "bg-green-600 text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  Settings
                </button>
              </nav>
            </div>
          </div>

          <div className="lg:w-3/4">
            {activeTab === "overview" && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Overview
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-green-600 text-white rounded-lg p-6">
                    <h3 className="text-lg font-semibold mb-2">Total Gigs</h3>
                    <p className="text-3xl font-bold">{userGigs.length}</p>
                  </div>
                  <div className="bg-blue-600 text-white rounded-lg p-6">
                    <h3 className="text-lg font-semibold mb-2">Total Orders</h3>
                    <p className="text-3xl font-bold">12</p>
                  </div>
                  <div className="bg-yellow-600 text-white rounded-lg p-6">
                    <h3 className="text-lg font-semibold mb-2">Earnings</h3>
                    <p className="text-3xl font-bold">$1,250</p>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    Recent Activity
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                      <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center mr-4">
                        <span className="text-white font-bold">G</span>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">
                          New gig created
                        </p>
                        <p className="text-sm text-gray-500">2 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                      <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center mr-4">
                        <span className="text-white font-bold">O</span>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">
                          New order received
                        </p>
                        <p className="text-sm text-gray-500">1 day ago</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "gigs" && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">My Gigs</h2>
                  <button className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700">
                    Create New Gig
                  </button>
                </div>

                {userGigs.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {userGigs.map((gig) => (
                      <div
                        key={gig.id}
                        className="border border-gray-200 rounded-lg p-4"
                      >
                        <div className="flex items-center mb-4">
                          <img
                            src={gig.userAvatar}
                            alt={gig.userName}
                            className="w-12 h-12 rounded-full mr-4"
                          />
                          <div>
                            <h3 className="font-semibold text-gray-900">
                              {gig.title}
                            </h3>
                            <p className="text-sm text-gray-600">
                              ${gig.price}
                            </p>
                          </div>
                        </div>
                        <p className="text-gray-600 text-sm mb-4">
                          {gig.description}
                        </p>
                        <div className="flex space-x-2">
                          <button className="text-green-600 hover:text-green-700 text-sm">
                            Edit
                          </button>
                          <button className="text-red-600 hover:text-red-700 text-sm">
                            Delete
                          </button>
                          <button className="text-blue-600 hover:text-blue-700 text-sm">
                            View
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-500 mb-4">
                      You haven't created any gigs yet.
                    </p>
                    <button className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700">
                      Create Your First Gig
                    </button>
                  </div>
                )}
              </div>
            )}

            {activeTab === "orders" && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Orders
                </h2>
                <div className="space-y-4">
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-semibold text-gray-900">
                        Logo Design
                      </h3>
                      <span className="bg-green-100 text-green-800 text-sm px-2 py-1 rounded-full">
                        Completed
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mb-2">$50.00</p>
                    <p className="text-gray-500 text-sm">Order #12345</p>
                  </div>
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-semibold text-gray-900">
                        Website Development
                      </h3>
                      <span className="bg-yellow-100 text-yellow-800 text-sm px-2 py-1 rounded-full">
                        In Progress
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mb-2">$500.00</p>
                    <p className="text-gray-500 text-sm">Order #12346</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "messages" && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Messages
                </h2>
                <p className="text-gray-500">
                  View your messages in the dedicated messages section.
                </p>
              </div>
            )}

            {activeTab === "settings" && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Settings
                </h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Profile Information
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Name
                        </label>
                        <input
                          type="text"
                          value={user.name}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Email
                        </label>
                        <input
                          type="email"
                          value={user.email}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        />
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Account Settings
                    </h3>
                    <button className="text-red-600 hover:text-red-700 text-sm">
                      Delete Account
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
