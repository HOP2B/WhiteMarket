import React, { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "../components/Navbar";
import GigCard from "../components/GigCard";
import { getGigs } from "../api/mockApi";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabase";

const Home: React.FC = () => {
  const { user } = useAuth();
  const [gigs, setGigs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGigs = async () => {
      try {
        let data;
        if (user?.unsafeMetadata?.role === "employer" && user.id) {
          // Fetch employer's own gigs
          const { data: employerGigs, error } = await supabase
            .from("gigs")
            .select(
              `
              *,
              users!inner(name, avatar)
            `,
            )
            .eq("user_id", user.id);
          if (error) throw error;
          data = employerGigs.map((gig) => ({
            ...gig,
            userName: gig.users.name,
            userAvatar: gig.users.avatar,
          }));
        } else {
          // Fetch all gigs for workers or guests
          data = await getGigs();
        }
        setGigs(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching gigs:", error);
        setLoading(false);
      }
    };

    fetchGigs();
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
          <div className="max-w-md w-full text-center">
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Welcome to WhiteMarket
              </h1>
              <p className="text-lg text-gray-600">
                Connect with talented freelancers or find the perfect job for
                your skills.
              </p>
            </div>
            <div className="space-y-4">
              <Link href="/login" className="block">
                <button className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-semibold text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transform transition-all duration-200 hover:scale-105">
                  <span className="mr-2">🚀</span>
                  Get Started
                </button>
              </Link>
              <div className="text-sm text-gray-500">
                Join as a{" "}
                <Link
                  href="/register"
                  className="text-blue-600 hover:text-blue-500 font-medium"
                >
                  Worker
                </Link>{" "}
                or{" "}
                <Link
                  href="/register"
                  className="text-green-600 hover:text-green-500 font-medium"
                >
                  Employer
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const userRole = user.unsafeMetadata?.role;
  const isWorker = userRole === "worker";
  const isEmployer = userRole === "employer";

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex flex-col">
      <Navbar />
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl w-full">
          <div className="text-center mb-12">
            <div
              className={`inline-flex items-center justify-center w-16 h-16 ${isWorker ? "bg-blue-100" : "bg-green-100"} rounded-full mb-4`}
            >
              <span
                className="text-2xl"
                role="img"
                aria-label={isWorker ? "Worker" : "Employer"}
              >
                {isWorker ? "👷" : "🏢"}
              </span>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {isWorker ? "Find Your Next Opportunity" : "Manage Your Projects"}
            </h1>
            <p className="text-lg text-gray-600">
              {isWorker
                ? "Discover exciting projects and showcase your skills"
                : "Oversee your posted jobs and connect with talented professionals"}
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-xl border border-gray-100 p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                {isWorker ? "Available Projects" : "Your Posted Jobs"}
              </h2>
              <p className="text-gray-600">
                {isWorker
                  ? "Browse and apply for projects that match your expertise"
                  : "Track applications and manage your job postings"}
              </p>
            </div>

            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
              </div>
            ) : gigs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {gigs.map((gig) => (
                  <GigCard key={gig.id} gig={gig} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📋</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {isWorker ? "No projects available" : "No jobs posted yet"}
                </h3>
                <p className="text-gray-600 mb-6">
                  {isWorker
                    ? "Check back later for new opportunities"
                    : "Create your first job posting to get started"}
                </p>
                {isEmployer && (
                  <Link href="/dashboard">
                    <button className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors duration-200">
                      Post a Job
                    </button>
                  </Link>
                )}
              </div>
            )}
          </div>

          <div
            className={`mt-8 grid grid-cols-1 ${isWorker ? "md:grid-cols-3" : "md:grid-cols-2"} gap-6`}
          >
            {isWorker && (
              <div className="bg-white rounded-lg shadow-md border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Offer Your Service
                </h3>
                <p className="text-gray-600 mb-4">
                  Create a new service listing to attract clients
                </p>
                <Link href="/offer-service">
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium">
                    Offer Service
                  </button>
                </Link>
              </div>
            )}

            <div className="bg-white rounded-lg shadow-md border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {isWorker ? "My Applications" : "Applications Received"}
              </h3>
              <p className="text-gray-600 mb-4">
                {isWorker
                  ? "Track your submitted applications"
                  : "Review applications for your jobs"}
              </p>
              <Link href="/dashboard">
                <button className="text-indigo-600 hover:text-indigo-500 font-medium">
                  View Dashboard →
                </button>
              </Link>
            </div>

            <div className="bg-white rounded-lg shadow-md border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Messages
              </h3>
              <p className="text-gray-600 mb-4">
                Communicate with {isWorker ? "employers" : "candidates"}
              </p>
              <Link href="/messages">
                <button className="text-indigo-600 hover:text-indigo-500 font-medium">
                  Open Messages →
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
