import React from "react";
import Navbar from "../components/Navbar";

const Jobs: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Jobs</h1>
        <p className="text-gray-600">
          Browse available jobs and find your next opportunity.
        </p>
      </div>
    </div>
  );
};

export default Jobs;
