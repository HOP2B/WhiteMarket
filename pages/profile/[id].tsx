import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Navbar from "../../components/Navbar";
import { getUserById, getGigs } from "../../api/mockApi";
import { useAuth } from "../../context/AuthContext";

const EditProfileModal: React.FC<{
  user: any;
  onClose: () => void;
  onSave: (updatedUser: any) => void;
}> = ({ user, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: user?.name || "",
    bio: user?.bio || "",
    skills: user?.skills?.join(", ") || "",
    location: "Улаанбаатар, Монгол",
    avatar: user?.avatar || "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedUser = {
      ...user,
      name: formData.name,
      bio: formData.bio,
      skills: formData.skills.split(",").map((s: string) => s.trim()),
      location: formData.location,
      avatar: formData.avatar,
    };
    onSave(updatedUser);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <h2 className="text-xl font-bold mb-4">Профайл засах</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Нэр</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Танилцуулга
            </label>
            <textarea
              value={formData.bio}
              onChange={(e) =>
                setFormData({ ...formData, bio: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded"
              rows={3}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Ур чадвар (таслалаар тусгаарлах)
            </label>
            <input
              type="text"
              value={formData.skills}
              onChange={(e) =>
                setFormData({ ...formData, skills: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded"
              placeholder="Web Development, React, Node.js"
            />
          </div>
          <div className="flex space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-200 text-gray-800 py-2 rounded"
            >
              Цуцлах
            </button>
            <button
              type="submit"
              className="flex-1 bg-green-600 text-white py-2 rounded"
            >
              Хадгалах
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const UserProfile: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const { user: currentUser } = useAuth();
  const [user, setUser] = useState<any>(null);
  const [userGigs, setUserGigs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("services");
  const [showEditModal, setShowEditModal] = useState(false);

  const handleSaveProfile = (updatedUser: any) => {
    // In a real app, this would update the database
    console.log("Saving profile:", updatedUser);
    setUser(updatedUser);
    alert("Профайл амжилттай шинэчлэгдлээ!");
  };

  useEffect(() => {
    if (id) {
      const fetchUserData = async () => {
        try {
          const userData = await getUserById(id as string);
          const allGigs = (await getGigs()) as any[];
          const gigsByUser = allGigs.filter((gig: any) => gig.userId === id);
          setUser(userData);
          setUserGigs(gigsByUser);
          setLoading(false);
        } catch (error) {
          console.error("Error fetching user data:", error);
          setLoading(false);
        }
      };

      fetchUserData();
    }
  }, [id]);

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
          <h1 className="text-2xl font-bold text-gray-900">User not found</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="w-full md:w-1/3">
              <div className="text-center mb-6">
                <img
                  src={user.avatar || "/default-avatar.jpg"}
                  alt={user.name}
                  className="w-32 h-32 rounded-full mx-auto mb-4 object-cover border-4 border-white shadow-lg"
                />
                <h1 className="text-2xl font-bold text-gray-900 mb-1">
                  {user.name}
                </h1>
                <div className="flex items-center justify-center mb-2">
                  <span className="text-yellow-500 text-lg">★</span>
                  <span className="ml-1 text-gray-700 font-semibold">4.8</span>
                  <span className="ml-1 text-gray-500">(24 reviews)</span>
                </div>
                <p className="text-gray-600 text-sm mb-4">
                  <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  Улаанбаатар, Монгол
                </p>
              </div>

              <div className="space-y-3 mb-6">
                <button
                  onClick={() => router.push(`/messages?contact=${id}`)}
                  className="w-full bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 transition-colors"
                >
                  Зурвас илгээх
                </button>
                {currentUser && currentUser.id !== id && (
                  <button className="w-full border border-gray-300 py-3 px-4 rounded-md hover:bg-gray-50 transition-colors">
                    Ажилд авлах
                  </button>
                )}
                {currentUser && currentUser.id === id && (
                  <button
                    onClick={() => setShowEditModal(true)}
                    className="w-full border border-gray-300 py-3 px-4 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    Профайл засах
                  </button>
                )}
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Статистик</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Үйлчилгээ:</span>
                    <span className="font-semibold">{userGigs.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Дууссан ажил:</span>
                    <span className="font-semibold">12</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Гишүүн болсон:</span>
                    <span className="font-semibold">2023 оноос</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full md:w-2/3">
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-3">
                  Миний тухай
                </h2>
                <p className="text-gray-700 mb-4">{user.bio}</p>

                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Ур чадвар
                </h3>
                <div className="flex flex-wrap gap-2 mb-6">
                  {user.skills &&
                    user.skills.map((skill: string, index: number) => (
                      <span
                        key={index}
                        className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm"
                      >
                        {skill}
                      </span>
                    ))}
                </div>
              </div>

              <div className="border-b border-gray-200 mb-6">
                <nav className="flex space-x-8">
                  <button
                    onClick={() => setActiveTab("services")}
                    className={`py-2 px-1 border-b-2 font-medium text-sm ${
                      activeTab === "services"
                        ? "border-green-500 text-green-600"
                        : "border-transparent text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    Үйлчилгээ ({userGigs.length})
                  </button>
                  <button
                    onClick={() => setActiveTab("reviews")}
                    className={`py-2 px-1 border-b-2 font-medium text-sm ${
                      activeTab === "reviews"
                        ? "border-green-500 text-green-600"
                        : "border-transparent text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    Сэтгэгдэл (24)
                  </button>
                </nav>
              </div>

              {activeTab === "services" && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Миний үйлчилгээ
                  </h3>
                  {userGigs.length > 0 ? (
                    <div className="grid grid-cols-1 gap-4">
                      {userGigs.map((gig) => (
                        <div
                          key={gig.id}
                          className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                        >
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-semibold text-gray-900">
                              {gig.title}
                            </h4>
                            <span className="text-green-600 font-bold text-lg">
                              ₮{gig.price.toLocaleString()}
                            </span>
                          </div>
                          <p className="text-gray-600 text-sm mb-3">
                            {gig.description}
                          </p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <span className="text-yellow-500">★</span>
                              <span className="ml-1 text-sm text-gray-600">
                                {gig.rating} ({gig.reviews} reviews)
                              </span>
                            </div>
                            <button
                              onClick={() => router.push(`/gigs/${gig.id}`)}
                              className="text-green-600 hover:text-green-700 text-sm font-medium"
                            >
                              Дэлгэрэнгүй
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">
                      Одоогоор үйлчилгээ байхгүй байна.
                    </p>
                  )}
                </div>
              )}

              {activeTab === "reviews" && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Хэрэглэгчдийн сэтгэгдэл
                  </h3>
                  <div className="space-y-4">
                    {[1, 2, 3].map((review) => (
                      <div
                        key={review}
                        className="border border-gray-200 rounded-lg p-4"
                      >
                        <div className="flex items-center mb-2">
                          <div className="flex text-yellow-500">★★★★★</div>
                          <span className="ml-2 text-sm text-gray-600">
                            2 weeks ago
                          </span>
                        </div>
                        <p className="text-gray-700 text-sm mb-2">
                          "Excellent work! Delivered exactly what I asked for
                          and on time."
                        </p>
                        <div className="flex items-center">
                          <img
                            src="/avatars/user1.jpg"
                            alt="Reviewer"
                            className="w-6 h-6 rounded-full mr-2"
                          />
                          <span className="text-sm font-medium">John D.</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {showEditModal && (
        <EditProfileModal
          user={user}
          onClose={() => setShowEditModal(false)}
          onSave={handleSaveProfile}
        />
      )}
    </div>
  );
};

export default UserProfile;
