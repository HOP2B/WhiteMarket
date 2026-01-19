import React from "react";
import Link from "next/link";
import { useAuth } from "../context/AuthContext";

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-xl font-bold text-green-600">
                WhiteMarket
              </Link>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <input
                type="text"
                placeholder="Search services..."
                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            {user ? (
              <div className="flex items-center space-x-4">
                <Link
                  href="/dashboard"
                  className="text-gray-700 hover:text-green-600"
                >
                  Dashboard
                </Link>
                <Link
                  href="/messages"
                  className="text-gray-700 hover:text-green-600"
                >
                  Messages
                </Link>
                <button
                  onClick={logout}
                  className="text-gray-700 hover:text-green-600"
                >
                  Logout
                </button>
                <img
                  src={user.avatar || "/default-avatar.jpg"}
                  alt="User Avatar"
                  className="w-8 h-8 rounded-full"
                />
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  href="/login"
                  className="text-gray-700 hover:text-green-600"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
