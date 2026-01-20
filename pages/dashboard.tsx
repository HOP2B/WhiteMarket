import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import { getGigs, getOrders, createGig } from "../api/mockApi";

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [gigs, setGigs] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [showQuickCreate, setShowQuickCreate] = useState(false);
  const [quickCreateData, setQuickCreateData] = useState({
    title: "",
    description: "",
    price: "",
  });
  const [creating, setCreating] = useState(false);

  const fetchData = async () => {
    if (!user) return;

    try {
      const [gigsData, ordersData] = await Promise.all([
        getGigs(),
        getOrders(user.id),
      ]);
      setGigs(gigsData);
      setOrders(ordersData);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  // Refresh data when returning to dashboard (e.g., after creating a service)
  useEffect(() => {
    const handleRouteChange = () => {
      if (user) {
        fetchData();
      }
    };

    router.events.on("routeChangeComplete", handleRouteChange);

    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [user, router.events]);

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
  const recentGigs = gigs.slice(0, 6); // Show 6 most recent gigs

  const handleQuickCreate = async () => {
    if (
      !user ||
      !quickCreateData.title ||
      !quickCreateData.description ||
      !quickCreateData.price
    ) {
      alert("Бүх талбарыг бөглөнө үү");
      return;
    }

    setCreating(true);
    try {
      // Create the gig using the mock API
      const gigData = {
        title: quickCreateData.title,
        description: quickCreateData.description,
        price: parseFloat(quickCreateData.price),
        category: "General",
        userId: user.id,
        userName: user.name || "Unknown User",
        userAvatar: user.imageUrl || "/default-avatar.jpg",
        rating: 0,
        reviews: 0,
      };

      const newGig = await createGig(gigData);
      console.log("Service created successfully:", newGig);

      // Refresh the gigs data
      const updatedGigs = await getGigs();
      setGigs(updatedGigs);

      // Reset form and close modal
      setQuickCreateData({ title: "", description: "", price: "" });
      setShowQuickCreate(false);

      alert("Үйлчилгээ амжилттай үүсгэгдлээ!");
    } catch (error) {
      console.error("Error creating gig:", error);
      alert("Үйлчилгээ үүсгэхэд алдаа гарлаа. Дахин оролдоно уу.");
    } finally {
      setCreating(false);
    }
  };
  const userOrders = orders.filter(
    (order) => order.buyer_id === user.id || order.seller_id === user.id,
  );
  const totalEarnings = orders
    .filter(
      (order) => order.seller_id === user.id && order.status === "completed",
    )
    .reduce((sum, order) => sum + order.amount, 0);

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
                  Recent Jobs
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
                    <p className="text-3xl font-bold">{userOrders.length}</p>
                  </div>
                  <div className="bg-yellow-600 text-white rounded-lg p-6">
                    <h3 className="text-lg font-semibold mb-2">Earnings</h3>
                    <p className="text-3xl font-bold">
                      ${totalEarnings.toFixed(2)}
                    </p>
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

                <div className="flex justify-center">
                  <button
                    onClick={() => setShowQuickCreate(true)}
                    className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2 shadow-lg"
                  >
                    <span>+</span>
                    <span>Quick Create Service</span>
                  </button>
                </div>
              </div>
            )}

            {activeTab === "gigs" && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Recent Jobs
                  </h2>
                  <button
                    onClick={() => router.push("/offer-service")}
                    className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                  >
                    Create New Service
                  </button>
                </div>

                {recentGigs.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {recentGigs.map((gig) => (
                      <div
                        key={gig.id}
                        className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-center mb-4">
                          <img
                            src={gig.userAvatar}
                            alt={gig.userName}
                            className="w-12 h-12 rounded-full mr-4"
                          />
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900">
                              {gig.title}
                            </h3>
                            <p className="text-sm text-gray-600">
                              by {gig.userName}
                            </p>
                          </div>
                          <span className="text-green-600 font-bold text-lg">
                            ₮{gig.price.toLocaleString()}
                          </span>
                        </div>
                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                          {gig.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <span className="text-yellow-500 text-sm">★</span>
                            <span className="ml-1 text-sm text-gray-600">
                              {gig.rating} ({gig.reviews} reviews)
                            </span>
                          </div>
                          <button
                            onClick={() => router.push(`/gigs/${gig.id}`)}
                            className="text-green-600 hover:text-green-700 text-sm font-medium"
                          >
                            View Details
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-500 mb-4">
                      No services available yet.
                    </p>
                    <button
                      onClick={() => router.push("/offer-service")}
                      className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700"
                    >
                      Create First Service
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
                {userOrders.length > 0 ? (
                  <div className="space-y-4">
                    {userOrders.map((order) => (
                      <div
                        key={order.id}
                        className="border border-gray-200 rounded-lg p-4"
                      >
                        <div className="flex justify-between items-center mb-2">
                          <h3 className="font-semibold text-gray-900">
                            {order.gigs.title}
                          </h3>
                          <span
                            className={`text-sm px-2 py-1 rounded-full ${
                              order.status === "completed"
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {order.status}
                          </span>
                        </div>
                        <p className="text-gray-600 text-sm mb-2">
                          ${order.amount}
                        </p>
                        <p className="text-gray-500 text-sm">
                          Order #{order.id}
                        </p>
                        <p className="text-gray-500 text-sm">
                          {new Date(order.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No orders yet.</p>
                )}
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

        {/* Quick Create Modal */}
        {showQuickCreate && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">
                  Quick Create Service
                </h3>
                <button
                  onClick={() => setShowQuickCreate(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Service Title
                  </label>
                  <input
                    type="text"
                    value={quickCreateData.title}
                    onChange={(e) =>
                      setQuickCreateData({
                        ...quickCreateData,
                        title: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="e.g., Web Development"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={quickCreateData.description}
                    onChange={(e) =>
                      setQuickCreateData({
                        ...quickCreateData,
                        description: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    rows={3}
                    placeholder="Brief description of your service"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price (₮)
                  </label>
                  <input
                    type="number"
                    value={quickCreateData.price}
                    onChange={(e) =>
                      setQuickCreateData({
                        ...quickCreateData,
                        price: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="50000"
                    min="0"
                    step="1000"
                  />
                </div>
              </div>

              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => setShowQuickCreate(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleQuickCreate}
                  disabled={creating}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {creating ? "Creating..." : "Create Service"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
