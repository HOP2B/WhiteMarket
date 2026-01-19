import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import GigCard from "../components/GigCard";
import { getGigs } from "../api/mockApi";
import { useApp } from "../context/AppContext";

const Home: React.FC = () => {
  const { gigs, setGigs } = useApp();
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");

  useEffect(() => {
    const fetchGigs = async () => {
      try {
        const data = await getGigs();
        setGigs(data as any[]);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching gigs:", error);
        setLoading(false);
      }
    };

    fetchGigs();
  }, [setGigs]);

  const filteredGigs = gigs.filter((gig) => {
    const matchesSearch =
      gig.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      gig.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      categoryFilter === "All" || gig.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const categories = [
    "All",
    "Graphics & Design",
    "Programming & Tech",
    "Digital Marketing",
    "Writing & Translation",
  ];

  return (
    <div className="min-h-screen bg-gray-50 test-bg">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Find the perfect service for your business
        </h1>

        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <input
            type="text"
            placeholder="Search services..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGigs.map((gig) => (
              <GigCard key={gig.id} gig={gig} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
