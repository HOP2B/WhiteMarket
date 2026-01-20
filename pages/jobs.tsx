import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Navbar from "../components/Navbar";
import { searchGigs, getCategories } from "../api/mockApi";

interface Gig {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  rating: number;
  reviews: number;
  userName: string;
  userAvatar: string;
  userId: string;
}

interface Category {
  name: string;
  count: number;
}

const Jobs: React.FC = () => {
  const router = useRouter();
  const [gigs, setGigs] = useState<Gig[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [sortBy, setSortBy] = useState("relevance");
  const [minRating, setMinRating] = useState("");

  const fetchData = async () => {
    try {
      const [gigsData, categoriesData] = await Promise.all([
        searchGigs("", {}),
        getCategories(),
      ]);
      setGigs(gigsData);
      setCategories(categoriesData);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Refresh data when component mounts (useful when returning from other pages)
  useEffect(() => {
    const handleFocus = () => {
      fetchData();
    };

    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, []);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const filters = {
        category: selectedCategory,
        minPrice: priceRange.min ? parseInt(priceRange.min) : undefined,
        maxPrice: priceRange.max ? parseInt(priceRange.max) : undefined,
        minRating: minRating ? parseInt(minRating) : undefined,
        sortBy,
      };

      const results = await searchGigs(searchQuery, filters);
      setGigs(results);
    } catch (error) {
      console.error("Error searching gigs:", error);
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("");
    setPriceRange({ min: "", max: "" });
    setSortBy("relevance");
    setMinRating("");
    handleSearch();
  };

  if (loading && gigs.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Үйлчилгээ хайх
          </h1>
          <p className="text-gray-600">
            Чадварлаг freelancer-үүдээс үйлчилгээ сонгон аваарай
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            {/* Search Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Хайх
              </label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Үйлчилгээний нэр..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ангилал
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">Бүгд</option>
                {categories.map((category) => (
                  <option key={category.name} value={category.name}>
                    {category.name} ({category.count})
                  </option>
                ))}
              </select>
            </div>

            {/* Price Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Үнийн хязгаар
              </label>
              <div className="flex space-x-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={priceRange.min}
                  onChange={(e) =>
                    setPriceRange({ ...priceRange, min: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={priceRange.max}
                  onChange={(e) =>
                    setPriceRange({ ...priceRange, max: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>

            {/* Rating Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Хамгийн бага үнэлгээ
              </label>
              <select
                value={minRating}
                onChange={(e) => setMinRating(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">Бүгд</option>
                <option value="4">4+ од</option>
                <option value="3">3+ од</option>
                <option value="2">2+ од</option>
                <option value="1">1+ од</option>
              </select>
            </div>
          </div>

          {/* Sort and Actions */}
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-4">
              <label className="text-sm font-medium text-gray-700">
                Эрэмбэлэх:
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="relevance">Холбогдолтой</option>
                <option value="price_low">Үнэ: багаас их</option>
                <option value="price_high">Үнэ: ихээс бага</option>
                <option value="rating">Үнэлгээ</option>
                <option value="newest">Хамгийн шинэ</option>
              </select>
            </div>

            <div className="flex space-x-2">
              <button
                onClick={clearFilters}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Шүүлтүүрийг цэвэрлэх
              </button>
              <button
                onClick={handleSearch}
                className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                Хайх
              </button>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar with Categories */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Ангилалууд
              </h3>
              <div className="space-y-2">
                <button
                  onClick={() => {
                    setSelectedCategory("");
                    handleSearch();
                  }}
                  className={`w-full text-left px-3 py-2 rounded-md ${
                    selectedCategory === ""
                      ? "bg-green-100 text-green-800"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  Бүгд ({gigs.length})
                </button>
                {categories.map((category) => (
                  <button
                    key={category.name}
                    onClick={() => {
                      setSelectedCategory(category.name);
                      handleSearch();
                    }}
                    className={`w-full text-left px-3 py-2 rounded-md ${
                      selectedCategory === category.name
                        ? "bg-green-100 text-green-800"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {category.name} ({category.count})
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:w-3/4">
            <div className="mb-4">
              <p className="text-gray-600">{gigs.length} үйлчилгээ олдлоо</p>
            </div>

            {loading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
              </div>
            ) : gigs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {gigs.map((gig) => (
                  <div
                    key={gig.id}
                    className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => router.push(`/gigs/${gig.id}`)}
                  >
                    <div className="p-6">
                      <div className="flex items-center mb-4">
                        <img
                          src={gig.userAvatar}
                          alt={gig.userName}
                          className="w-10 h-10 rounded-full mr-3"
                        />
                        <div>
                          <p className="font-semibold text-gray-900">
                            {gig.userName}
                          </p>
                          <div className="flex items-center">
                            <span className="text-yellow-500 text-sm">★</span>
                            <span className="ml-1 text-sm text-gray-600">
                              {gig.rating} ({gig.reviews})
                            </span>
                          </div>
                        </div>
                      </div>

                      <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                        {gig.title}
                      </h3>

                      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                        {gig.description}
                      </p>

                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                          {gig.category}
                        </span>
                        <span className="text-xl font-bold text-green-600">
                          ₮{gig.price.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 mb-4">
                  Таны хайлтад тохирох үйлчилгээ олдсонгүй
                </p>
                <button
                  onClick={clearFilters}
                  className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700"
                >
                  Шүүлтүүрийг цэвэрлэх
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Jobs;
