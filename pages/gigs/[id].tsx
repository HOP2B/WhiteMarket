import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Navbar from "../../components/Navbar";
import { getGigById, getUserById, getGigs } from "../../api/mockApi";
import { useAuth } from "../../context/AuthContext";

interface Package {
  name: string;
  price: number;
  description: string;
  features: string[];
  deliveryTime: string;
  revisions: string;
}

interface Review {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  rating: number;
  comment: string;
  date: string;
}

const GigDetail: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const { user } = useAuth();
  const [gig, setGig] = useState<any>(null);
  const [seller, setSeller] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("description");
  const [selectedPackage, setSelectedPackage] = useState<string>("basic");
  const [relatedGigs, setRelatedGigs] = useState<any[]>([]);
  const [isFavorited, setIsFavorited] = useState(false);
  const [shared, setShared] = useState(false);

  // Mock packages data
  const packages: Package[] = [
    {
      name: "basic",
      price: gig?.price || 50000,
      description: "Үндсэн үйлчилгээ",
      features: ["1 зураг", "3 өөрчлөлт", "3 өдрийн хүргэлт"],
      deliveryTime: "3 өдөр",
      revisions: "3",
    },
    {
      name: "standard",
      price: (gig?.price || 50000) * 1.5,
      description: "Стандарт үйлчилгээ",
      features: ["3 зураг", "5 өөрчлөлт", "5 өдрийн хүргэлт", "Эх файл"],
      deliveryTime: "5 өдөр",
      revisions: "5",
    },
    {
      name: "premium",
      price: (gig?.price || 50000) * 2,
      description: "Премиум үйлчилгээ",
      features: [
        "5 зураг",
        "Хязгааргүй өөрчлөлт",
        "7 өдрийн хүргэлт",
        "Эх файл",
        "Шуурхай дэмжлэг",
      ],
      deliveryTime: "7 өдөр",
      revisions: "Хязгааргүй",
    },
  ];

  // Mock reviews data
  const reviews: Review[] = [
    {
      id: "1",
      userId: "user1",
      userName: "Бат-Эрдэнэ",
      userAvatar: "/avatars/user1.jpg",
      rating: 5,
      comment:
        "Маш сайхан ажил хийлээ. Цаг хугацаандаа хүргэж өглөө. Дахин захиалах болно.",
      date: "2024-01-15",
    },
    {
      id: "2",
      userId: "user2",
      userName: "Сараа",
      userAvatar: "/avatars/user2.jpg",
      rating: 4,
      comment:
        "Сайхан ажил болсон. Зарим зүйлийг өөрчлөхөд түргэн хариу өгсөн.",
      date: "2024-01-10",
    },
  ];

  const handleContactSeller = () => {
    console.log("handleContactSeller called");
    console.log("user:", user);
    console.log("gig:", gig);
    console.log("gig?.userId:", gig?.userId);
    console.log("loading:", loading);

    if (!user) {
      router.push("/login");
      return;
    }

    if (loading) {
      alert("Please wait for the page to load completely");
      return;
    }

    if (!gig) {
      alert("Service information not available");
      return;
    }

    if (!gig.userId) {
      console.error("No userId found for gig:", gig);
      alert("Unable to contact seller - missing seller information");
      return;
    }

    // Ensure userId is not the same as current user
    if (gig.userId === user.id) {
      alert("You cannot contact yourself");
      return;
    }

    console.log("Navigating to messages with contact:", gig.userId);
    router.push(`/messages?contact=${gig.userId}`);
  };

  const handleToggleFavorite = () => {
    setIsFavorited(!isFavorited);
    alert(
      isFavorited ? "Дуртай жагсаалтаас хаслаа" : "Дуртай жагсаалтад нэмлээ",
    );
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: gig.title,
        text: gig.description,
        url: window.location.href,
      });
      setShared(true);
      setTimeout(() => setShared(false), 2000);
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Линк хуулагдлаа!");
      setShared(true);
      setTimeout(() => setShared(false), 2000);
    }
  };

  const handleOrderPackage = (packageName: string) => {
    setSelectedPackage(packageName);
    router.push(`/checkout?gigId=${gig.id}&package=${packageName}`);
  };

  useEffect(() => {
    if (id) {
      const fetchGigData = async () => {
        try {
          const gigData = (await getGigById(id as string)) as any;
          if (gigData) {
            const sellerData = await getUserById(gigData.userId);
            setGig(gigData);
            setSeller(sellerData);

            // Fetch related gigs
            const allGigs = await getGigs();
            const related = allGigs
              .filter(
                (g: any) =>
                  g.category === gigData.category && g.id !== gigData.id,
              )
              .slice(0, 4);
            setRelatedGigs(related);
          }
          setLoading(false);
        } catch (error) {
          console.error("Error fetching gig data:", error);
          setLoading(false);
        }
      };

      fetchGigData();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!gig) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-2xl font-bold text-gray-900">Gig not found</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header with share and favorite buttons */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.back()}
              className="text-gray-600 hover:text-gray-800"
            >
              ← Буцах
            </button>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleShare}
              className={`p-2 text-gray-600 hover:text-gray-800 transition-transform duration-200 ${shared ? "scale-110" : ""}`}
              title="Хуваалцах"
            >
              {shared ? "✅" : "📤"}
            </button>
            <button
              onClick={handleToggleFavorite}
              className={`p-2 ${isFavorited ? "text-red-600" : "text-gray-600"} hover:text-red-600`}
              title="Дуртай"
            >
              {isFavorited ? "❤️" : "🤍"}
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-8">
            <div className="flex flex-col lg:flex-row gap-8">
              <div className="lg:w-2/3">
                {/* Gig Header */}
                <div className="mb-6">
                  <h1 className="text-3xl font-bold text-gray-900 mb-4">
                    {gig.title}
                  </h1>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <img
                        src={seller?.avatar || "/default-avatar.jpg"}
                        alt={seller?.name || "Seller"}
                        className="w-12 h-12 rounded-full mr-4"
                      />
                      <div>
                        <p className="font-semibold text-gray-900">
                          {seller?.name}
                        </p>
                        <div className="flex items-center">
                          <span className="text-yellow-500">★</span>
                          <span className="ml-1 text-gray-700">
                            {gig.rating}
                          </span>
                          <span className="ml-1 text-gray-500">
                            ({gig.reviews} сэтгэгдэл)
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-green-600">
                        ₮{gig.price.toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-500">эхлэх үнэ</p>
                    </div>
                  </div>
                </div>

                {/* Image Gallery */}
                <div className="mb-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <img
                      src="/placeholder-gig.jpg"
                      alt={gig.title}
                      className="w-full h-64 object-cover rounded-lg"
                    />
                    <img
                      src="/placeholder-gig-2.jpg"
                      alt={`${gig.title} 2`}
                      className="w-full h-64 object-cover rounded-lg"
                    />
                  </div>
                </div>

                {/* Tabs */}
                <div className="mb-8">
                  <div className="border-b border-gray-200 mb-6">
                    <nav className="flex space-x-8">
                      <button
                        onClick={() => setActiveTab("description")}
                        className={`py-2 px-1 border-b-2 font-medium text-sm ${
                          activeTab === "description"
                            ? "border-green-500 text-green-600"
                            : "border-transparent text-gray-500 hover:text-gray-700"
                        }`}
                      >
                        Тайлбар
                      </button>
                      <button
                        onClick={() => setActiveTab("reviews")}
                        className={`py-2 px-1 border-b-2 font-medium text-sm ${
                          activeTab === "reviews"
                            ? "border-green-500 text-green-600"
                            : "border-transparent text-gray-500 hover:text-gray-700"
                        }`}
                      >
                        Сэтгэгдэл ({reviews.length})
                      </button>
                      <button
                        onClick={() => setActiveTab("faq")}
                        className={`py-2 px-1 border-b-2 font-medium text-sm ${
                          activeTab === "faq"
                            ? "border-green-500 text-green-600"
                            : "border-transparent text-gray-500 hover:text-gray-700"
                        }`}
                      >
                        Түгээмэл асуулт
                      </button>
                    </nav>
                  </div>

                  {/* Tab Content */}
                  {activeTab === "description" && (
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-4">
                        Үйлчилгээний дэлгэрэнгүй
                      </h3>
                      <p className="text-gray-700 text-lg mb-6">
                        {gig.description}
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-3">
                            Юу багтсан бэ?
                          </h4>
                          <ul className="space-y-2">
                            <li className="flex items-center text-gray-700">
                              <span className="text-green-600 mr-2">✓</span>
                              Чанартай ажил
                            </li>
                            <li className="flex items-center text-gray-700">
                              <span className="text-green-600 mr-2">✓</span>
                              Хугацаанд хүргэлт
                            </li>
                            <li className="flex items-center text-gray-700">
                              <span className="text-green-600 mr-2">✓</span>
                              Өөрчлөлт оруулах боломж
                            </li>
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-3">
                            Техникийн дэлгэрэнгүй
                          </h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Ангилал:</span>
                              <span className="font-medium">
                                {gig.category}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">
                                Хүргэх хугацаа:
                              </span>
                              <span className="font-medium">3-7 өдөр</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Өөрчлөлт:</span>
                              <span className="font-medium">Хязгааргүй</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === "reviews" && (
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-6">
                        Хэрэглэгчдийн сэтгэгдэл
                      </h3>
                      <div className="space-y-6">
                        {reviews.map((review) => (
                          <div
                            key={review.id}
                            className="border-b border-gray-200 pb-6"
                          >
                            <div className="flex items-start space-x-4">
                              <img
                                src={review.userAvatar}
                                alt={review.userName}
                                className="w-10 h-10 rounded-full"
                              />
                              <div className="flex-1">
                                <div className="flex items-center justify-between mb-2">
                                  <div>
                                    <p className="font-semibold text-gray-900">
                                      {review.userName}
                                    </p>
                                    <div className="flex items-center">
                                      {[...Array(5)].map((_, i) => (
                                        <span
                                          key={i}
                                          className={`text-sm ${
                                            i < review.rating
                                              ? "text-yellow-500"
                                              : "text-gray-300"
                                          }`}
                                        >
                                          ★
                                        </span>
                                      ))}
                                      <span className="ml-2 text-sm text-gray-500">
                                        {new Date(
                                          review.date,
                                        ).toLocaleDateString("mn-MN")}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                <p className="text-gray-700">
                                  {review.comment}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeTab === "faq" && (
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-6">
                        Түгээмэл асуултууд
                      </h3>
                      <div className="space-y-4">
                        <div className="border border-gray-200 rounded-lg">
                          <div className="p-4">
                            <h4 className="font-semibold text-gray-900 mb-2">
                              Хэдий хугацаанд хүргэх вэ?
                            </h4>
                            <p className="text-gray-700 text-sm">
                              Сонгосон багцын дагуу 3-7 өдрийн дотор хүргэнэ.
                            </p>
                          </div>
                        </div>
                        <div className="border border-gray-200 rounded-lg">
                          <div className="p-4">
                            <h4 className="font-semibold text-gray-900 mb-2">
                              Өөрчлөлт оруулах боломжтой юу?
                            </h4>
                            <p className="text-gray-700 text-sm">
                              Тийм, сонгосон багцынхаа хязгаарын дотор өөрчлөлт
                              оруулж болно.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Related Gigs */}
                {relatedGigs.length > 0 && (
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-6">
                      Холбоотой үйлчилгээ
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {relatedGigs.map((relatedGig) => (
                        <div
                          key={relatedGig.id}
                          className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                          onClick={() => router.push(`/gigs/${relatedGig.id}`)}
                        >
                          <h4 className="font-semibold text-gray-900 mb-2">
                            {relatedGig.title}
                          </h4>
                          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                            {relatedGig.description}
                          </p>
                          <div className="flex justify-between items-center">
                            <span className="text-green-600 font-bold">
                              ₮{relatedGig.price.toLocaleString()}
                            </span>
                            <div className="flex items-center">
                              <span className="text-yellow-500 text-sm">★</span>
                              <span className="ml-1 text-sm text-gray-600">
                                {relatedGig.rating}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Sidebar with Packages */}
              <div className="lg:w-1/3">
                <div className="bg-gray-50 rounded-lg p-6 sticky top-8">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">
                    Багц сонгох
                  </h3>

                  <div className="space-y-4 mb-6">
                    {packages.map((pkg) => (
                      <div
                        key={pkg.name}
                        className={`border rounded-lg p-4 cursor-pointer transition-all ${
                          selectedPackage === pkg.name
                            ? "border-green-500 bg-green-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                        onClick={() => setSelectedPackage(pkg.name)}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-semibold text-gray-900 capitalize">
                              {pkg.name === "basic"
                                ? "Үндсэн"
                                : pkg.name === "standard"
                                  ? "Стандарт"
                                  : "Премиум"}
                            </h4>
                            <p className="text-sm text-gray-600">
                              {pkg.description}
                            </p>
                          </div>
                          <span className="text-lg font-bold text-green-600">
                            ₮{pkg.price.toLocaleString()}
                          </span>
                        </div>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {pkg.features.map((feature, index) => (
                            <li key={index} className="flex items-center">
                              <span className="text-green-600 mr-1">✓</span>
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => handleOrderPackage(selectedPackage)}
                    className="w-full bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 mb-4"
                  >
                    Захиалах (₮
                    {packages
                      .find((p) => p.name === selectedPackage)
                      ?.price.toLocaleString()}
                    )
                  </button>

                  <div className="space-y-3">
                    <button
                      onClick={handleContactSeller}
                      disabled={loading}
                      className="w-full border border-gray-300 py-3 px-4 rounded-md hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? "Уншиж байна..." : "Холбоо барих"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GigDetail;
