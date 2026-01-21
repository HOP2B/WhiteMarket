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
  const [activeTab, setActiveTab] = useState("basic");
  const [formData, setFormData] = useState({
    name: user?.name || "",
    bio: user?.bio || "",
    skills: user?.skills?.join(", ") || "",
    location: user?.location || "Улаанбаатар, Монгол",
    avatar: user?.avatar || "",
    phone: user?.phone || "",
    website: user?.website || "",
    linkedin: user?.linkedin || "",
    github: user?.github || "",
    portfolio: user?.portfolio || [],
    experience: user?.experience || "",
    education: user?.education || "",
    certifications: user?.certifications || "",
  });
  const [selectedAvatar, setSelectedAvatar] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedAvatar(file);
      // Simulate upload
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData({ ...formData, avatar: e.target?.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedUser = {
      ...user,
      name: formData.name,
      bio: formData.bio,
      skills: formData.skills.split(",").map((s: string) => s.trim()),
      location: formData.location,
      avatar: formData.avatar,
      phone: formData.phone,
      website: formData.website,
      linkedin: formData.linkedin,
      github: formData.github,
      portfolio: formData.portfolio,
      experience: formData.experience,
      education: formData.education,
      certifications: formData.certifications,
    };
    onSave(updatedUser);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Профайл засах</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ✕
            </button>
          </div>

          {/* Tab Navigation */}
          <div className="border-b border-gray-200 mb-6">
            <nav className="flex space-x-8">
              <button
                onClick={() => setActiveTab("basic")}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "basic"
                    ? "border-green-500 text-green-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                Үндсэн мэдээлэл
              </button>
              <button
                onClick={() => setActiveTab("professional")}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "professional"
                    ? "border-green-500 text-green-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                Мэргэжлийн мэдээлэл
              </button>
              <button
                onClick={() => setActiveTab("social")}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "social"
                    ? "border-green-500 text-green-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                Сошиал холбоос
              </button>
            </nav>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information Tab */}
            {activeTab === "basic" && (
              <div className="space-y-6">
                <div className="flex items-center space-x-6">
                  <div className="relative">
                    <img
                      src={
                        formData.avatar ||
                        "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiNFNUU3RUIiLz4KPHBhdGggZD0iTTIwIDIwQzIyLjc2MTQgMjAgMjUgMTcuNzYxNCAyNSAxNUMyNSAxMi4yMzg2IDIyLjc2MTQgMTAgMjAgMTBDMTcuMjM4NiAxMCAxNSAxMi4yMzg2IDE1IDE1QzE1IDE3Ljc2MTQgMTcuNzYxNCAyMCAyMFoiIGZpbGw9IiM5Q0E0QUYiLz4KPHBhdGggZD0iTTMwIDI4QzMwIDI0LjY4NjMgMjYuNDI3MSAyMiAyMiAyMkgxOEMxMy41NzI5IDIyIDEwIDI0LjY4NjMgMTAgMjhWMzBIMzBWMjhaIiBmaWxsPSIjOUNBNEFGIi8+Cjwvc3ZnPgo="
                      }
                      alt="Avatar"
                      className="w-24 h-24 rounded-full object-cover border-4 border-gray-200"
                    />
                    <label className="absolute bottom-0 right-0 bg-blue-600 text-white rounded-full p-2 cursor-pointer hover:bg-blue-700">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarChange}
                        className="hidden"
                      />
                      📷
                    </label>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Профайл зураг
                    </h3>
                    <p className="text-sm text-gray-600">
                      Зургийг өөрчлөхийн тулд дээрх камерын дүрс дээр дарна уу.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Нэр *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Утасны дугаар
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="+976 99112233"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Байршил
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Танилцуулга
                  </label>
                  <textarea
                    value={formData.bio}
                    onChange={(e) =>
                      setFormData({ ...formData, bio: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    rows={4}
                    placeholder="Өөрийгөө танилцуулна уу..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ур чадвар (таслалаар тусгаарлах)
                  </label>
                  <input
                    type="text"
                    value={formData.skills}
                    onChange={(e) =>
                      setFormData({ ...formData, skills: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Web Development, React, Node.js"
                  />
                </div>
              </div>
            )}

            {/* Professional Information Tab */}
            {activeTab === "professional" && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ажлын туршлага
                  </label>
                  <textarea
                    value={formData.experience}
                    onChange={(e) =>
                      setFormData({ ...formData, experience: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    rows={4}
                    placeholder="Таны ажлын туршлага, өмнөх ажил байдал зэргийг бичнэ үү..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Боловсрол
                  </label>
                  <textarea
                    value={formData.education}
                    onChange={(e) =>
                      setFormData({ ...formData, education: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    rows={3}
                    placeholder="Таны боловсролын зэрэг, сургууль..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Гэрчилгээ, сертификат
                  </label>
                  <textarea
                    value={formData.certifications}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        certifications: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    rows={3}
                    placeholder="Таны авсан гэрчилгээ, сертификатууд..."
                  />
                </div>
              </div>
            )}

            {/* Social Links Tab */}
            {activeTab === "social" && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Вэб сайт
                  </label>
                  <input
                    type="url"
                    value={formData.website}
                    onChange={(e) =>
                      setFormData({ ...formData, website: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="https://yourwebsite.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    LinkedIn
                  </label>
                  <input
                    type="url"
                    value={formData.linkedin}
                    onChange={(e) =>
                      setFormData({ ...formData, linkedin: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="https://linkedin.com/in/yourprofile"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    GitHub
                  </label>
                  <input
                    type="url"
                    value={formData.github}
                    onChange={(e) =>
                      setFormData({ ...formData, github: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="https://github.com/yourusername"
                  />
                </div>
              </div>
            )}

            {/* Form Actions */}
            <div className="flex justify-end space-x-3 pt-6 border-t">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Цуцлах
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Хадгалах
              </button>
            </div>
          </form>
        </div>
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
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-white">
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
                  src={
                    user.avatar ||
                    "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiNFNUU3RUIiLz4KPHBhdGggZD0iTTIwIDIwQzIyLjc2MTQgMjAgMjUgMTcuNzYxNCAyNSAxNUMyNSAxMi4yMzg2IDIyLjc2MTQgMTAgMjAgMTBDMTcuMjM4NiAxMCAxNSAxMi4yMzg2IDE1IDE1QzE1IDE3Ljc2MTQgMTcuNzYxNCAyMCAyMFoiIGZpbGw9IiM5Q0E0QUYiLz4KPHBhdGggZD0iTTMwIDI4QzMwIDI0LjY4NjMgMjYuNDI3MSAyMiAyMiAyMkgxOEMxMy41NzI5IDIyIDEwIDI0LjY4NjMgMTAgMjhWMzBIMzBWMjhaIiBmaWxsPSIjOUNBNEFGIi8+Cjwvc3ZnPgo="
                  }
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
                  <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                  Улаанбаатар, Монгол
                </p>
              </div>

              <div className="space-y-3 mb-6">
                <button
                  onClick={() => router.push(`/messages?contact=${id}`)}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition-colors"
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
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    Үйлчилгээ ({userGigs.length})
                  </button>
                  <button
                    onClick={() => setActiveTab("reviews")}
                    className={`py-2 px-1 border-b-2 font-medium text-sm ${
                      activeTab === "reviews"
                        ? "border-blue-500 text-blue-600"
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
