import React, { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "../components/Navbar";
import {
  getFeaturedJobs,
  getJobCategories,
  getAllReviews,
  getUserStats,
} from "../api/mockApi";

const Home: React.FC = () => {
  const [jobs, setJobs] = useState<any[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [userStats, setUserStats] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [jobsData, categoriesData, reviewsData] = await Promise.all([
          getFeaturedJobs(),
          getJobCategories(),
          getAllReviews(3), // Get 3 recent reviews for testimonials
        ]);
        setJobs(jobsData);
        setFilteredJobs(jobsData);
        setCategories(categoriesData);
        setReviews(reviewsData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Search functionality
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    if (query === "") {
      setFilteredJobs(jobs);
    } else {
      const filtered = jobs.filter(
        (job) =>
          job.title.toLowerCase().includes(query) ||
          job.description.toLowerCase().includes(query) ||
          job.jobType.toLowerCase().includes(query),
      );
      setFilteredJobs(filtered);
    }
  };

  // Category filtering
  const handleCategoryClick = (categoryName: string) => {
    if (categoryName === "All") {
      setFilteredJobs(jobs);
    } else {
      const filtered = jobs.filter(
        (job) => job.category.toLowerCase() === categoryName.toLowerCase(),
      );
      setFilteredJobs(filtered);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero Section */}
      <section className="gradient-primary py-20 md:py-28 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight animate-fade-in">
              Find work. Get paid.
            </h1>
            <p
              className="text-lg md:text-xl text-blue-100 mb-8 max-w-2xl mx-auto animate-fade-in"
              style={{ animationDelay: "0.1s" }}
            >
              Explore freelance and part-time jobs across Mongolia. Connect with
              talented professionals and get your projects done.
            </p>
            <div
              className="max-w-md mx-auto mb-8 animate-fade-in"
              style={{ animationDelay: "0.2s" }}
            >
              <div className="relative">
                <input
                  type="text"
                  placeholder="Job title, keyword, location…"
                  value={searchQuery}
                  onChange={handleSearch}
                  className="w-full pl-14 pr-4 py-4 text-gray-900 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white"
                />
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg
                    className="h-6 w-6 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
              </div>
            </div>
            <button
              className="btn-primary bg-white text-blue-600 hover:bg-gray-100 hover:text-blue-600 px-8 py-3 rounded-lg text-base animate-fade-in"
              style={{ animationDelay: "0.3s" }}
            >
              Find Jobs
            </button>
          </div>
        </div>
      </section>

      {/* Category Filters */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-4">
            <button
              key="all"
              onClick={() => handleCategoryClick("All")}
              className="flex items-center px-6 py-3 bg-gray-50 hover:bg-gray-100 text-gray-900 rounded-full shadow-sm hover:shadow-md transition-all duration-200 border border-gray-200 group"
            >
              <span className="mr-2 text-xl group-hover:text-blue-600 transition-colors duration-200">
                📋
              </span>
              <span className="font-medium">All Categories</span>
            </button>
            {categories.map((category: any) => (
              <button
                key={category.id}
                onClick={() => handleCategoryClick(category.name)}
                className="flex items-center px-6 py-3 bg-gray-50 hover:bg-gray-100 text-gray-900 rounded-full shadow-sm hover:shadow-md transition-all duration-200 border border-gray-200 group"
              >
                <span className="mr-2 text-xl group-hover:text-blue-600 transition-colors duration-200">
                  {category.icon}
                </span>
                <span className="font-medium">{category.name}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Jobs Section */}
      <section className="section bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="section-title">Latest Jobs</h2>
            <p className="section-subtitle">
              Discover the most recent job opportunities from trusted employers
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredJobs.length > 0 ? (
                filteredJobs.map((job: any, index: number) => (
                  <div
                    key={job.id}
                    className="card animate-fade-in"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1">
                        {job.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {job.description}
                      </p>
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                          {job.jobType}
                        </span>
                        <span className="text-lg font-bold text-blue-600">
                          ₮{job.budget.toLocaleString()}
                        </span>
                      </div>
                      <Link href={`/gigs/${job.id}`}>
                        <button className="w-full btn-primary py-2 px-4 text-sm">
                          View Job
                        </button>
                      </Link>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <div className="text-gray-400 mb-4">
                    <svg
                      className="w-16 h-16 mx-auto mb-4 opacity-50"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                    <h3 className="text-xl font-semibold text-gray-600">
                      No jobs found
                    </h3>
                    <p className="text-gray-500 mt-2">
                      Try adjusting your search or category filters
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="section bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="section-title">How It Works</h2>
            <p className="section-subtitle">
              Get started in just a few simple steps to find or offer services
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                icon: "📝",
                title: "Sign Up",
                description:
                  "Create your account and set up a professional profile to showcase your skills",
              },
              {
                icon: "🔍",
                title: "Find Jobs",
                description:
                  "Browse through thousands of jobs and apply for positions that match your expertise",
              },
              {
                icon: "💰",
                title: "Get Paid",
                description:
                  "Complete work and receive secure payments directly to your account",
              },
            ].map((step, index) => (
              <div
                key={index}
                className="text-center animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-20 h-20 gradient-primary rounded-full flex items-center justify-center mx-auto mb-6 animate-float">
                  <span className="text-3xl">{step.icon}</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  {step.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="section bg-bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="section-title">What Our Users Say</h2>
            <p className="section-subtitle">
              Hear from freelancers who have found success on our platform
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {reviews.map((review: any, index: number) => (
              <div
                key={review.id}
                className="card p-6 animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-center mb-4">
                  <img
                    src={review.userAvatar}
                    alt={review.userName}
                    className="w-12 h-12 rounded-full mr-4 border-2 border-blue-600"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      {review.userName}
                    </h4>
                    <p className="text-sm text-gray-600">{review.gigTitle}</p>
                  </div>
                </div>
                <p className="text-gray-600 mb-4 italic">"{review.comment}"</p>
                <div className="flex text-yellow-500">
                  {[...Array(review.rating)].map((_, i) => (
                    <span key={i}>★</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section gradient-secondary text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Post your first job and find the best talent today
          </h2>
          <p className="text-lg text-pink-100 mb-8 max-w-2xl mx-auto">
            Connect with skilled professionals and get your projects done
            efficiently. Start hiring today.
          </p>
          <Link href="/dashboard">
            <button className="btn-primary bg-white text-pink-600 hover:bg-gray-100 hover:text-pink-600 px-8 py-3 rounded-lg">
              Post Job
            </button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4 text-gradient">
                White Market
              </h3>
              <p className="text-gray-400 mb-6">
                Connecting talent with opportunity in Mongolia. Find your next
                job or hire skilled professionals.
              </p>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                >
                  <span className="text-xl">📱</span>
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                >
                  <span className="text-xl">🐦</span>
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                >
                  <span className="text-xl">📘</span>
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                >
                  <span className="text-xl">📧</span>
                </a>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Jobs</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link
                    href="/jobs"
                    className="hover:text-white transition-colors duration-200"
                  >
                    Browse Jobs
                  </Link>
                </li>
                <li>
                  <Link
                    href="/dashboard"
                    className="hover:text-white transition-colors duration-200"
                  >
                    Post a Job
                  </Link>
                </li>
                <li>
                  <Link
                    href="/categories"
                    className="hover:text-white transition-colors duration-200"
                  >
                    Job Categories
                  </Link>
                </li>
                <li>
                  <Link
                    href="/search"
                    className="hover:text-white transition-colors duration-200"
                  >
                    Advanced Search
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link
                    href="/about"
                    className="hover:text-white transition-colors duration-200"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="hover:text-white transition-colors duration-200"
                  >
                    Contact
                  </Link>
                </li>
                <li>
                  <Link
                    href="/blog"
                    className="hover:text-white transition-colors duration-200"
                  >
                    Blog
                  </Link>
                </li>
                <li>
                  <Link
                    href="/careers"
                    className="hover:text-white transition-colors duration-200"
                  >
                    Careers
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link
                    href="/terms"
                    className="hover:text-white transition-colors duration-200"
                  >
                    Terms & Conditions
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy"
                    className="hover:text-white transition-colors duration-200"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/cookies"
                    className="hover:text-white transition-colors duration-200"
                  >
                    Cookie Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-500">
            <p>&copy; 2024 White Market. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
