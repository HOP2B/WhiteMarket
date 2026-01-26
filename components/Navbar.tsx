import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "../context/AuthContext";
import { useNotifications } from "../context/NotificationContext";
import { UserButton } from "@clerk/nextjs";
import NotificationDropdown from "./NotificationDropdown";

const Navbar: React.FC = () => {
  const { user } = useAuth();
  const { unreadCount, toggleNotifications } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md border-b border-gray-200 sticky top-0 z-50 backdrop-blur-sm bg-opacity-95 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 lg:grid lg:grid-cols-12 lg:items-center">
          {/* Logo Section - 2 columns */}
          <div className="flex items-center lg:col-span-2">
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-bold text-gradient">
                White Market
              </span>
            </Link>
          </div>

          {/* Search Bar - 8 columns */}
          <div className="flex items-center lg:col-span-8">
            <div className="flex items-center hidden md:block w-full">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Search services..."
                  className="w-full pl-14 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white text-base"
                />
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg
                    className="h-6 w-6 text-text-gray-600"
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
          </div>

          {/* Navigation - 2 columns */}
          <div className="flex items-center space-x-4 lg:col-span-2 justify-end">
            {/* Desktop Navigation */}
            {user ? (
              <div className="flex items-center space-x-1">
                <Link
                  href="/jobs"
                  className="px-4 py-2 text-text-gray-600 hover:text-gray-900-color hover:bg-bg-gray-100 rounded-lg transition-all duration-200 font-medium"
                >
                  Үйлчилгээ
                </Link>
                <Link
                  href="/dashboard"
                  className="px-4 py-2 text-text-gray-600 hover:text-gray-900-color hover:bg-bg-gray-100 rounded-lg transition-all duration-200 font-medium"
                >
                  Dashboard
                </Link>
                <Link
                  href="/messages"
                  className="px-4 py-2 text-text-gray-600 hover:text-gray-900-color hover:bg-bg-gray-100 rounded-lg transition-all duration-200 font-medium"
                >
                  Messages
                </Link>

                {/* Notification Bell */}
                <div className="relative">
                  <button
                    onClick={toggleNotifications}
                    className="relative p-2 text-text-gray-600 hover:text-gray-900-color hover:bg-bg-gray-100 rounded-lg transition-all duration-200"
                    title="Мэдэгдэл"
                  >
                    <span className="text-xl">🔔</span>
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse-subtle">
                        {unreadCount > 9 ? "9+" : unreadCount}
                      </span>
                    )}
                  </button>
                  <NotificationDropdown />
                </div>

                {/* User Profile */}
                <div className="ml-4">
                  <UserButton
                    appearance={{
                      elements: {
                        avatarBox: "w-8 h-8 border-2 border-blue-600",
                        userButtonTrigger: "p-1",
                      },
                    }}
                  />
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  href="/login"
                  className="px-4 py-2 text-text-gray-600 hover:text-gray-900-color hover:bg-bg-gray-100 rounded-lg transition-all duration-200 font-medium"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="btn-primary px-6 py-2 text-sm"
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
