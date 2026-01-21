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
    <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 lg:grid lg:grid-cols-3 lg:items-center">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-xl font-bold text-blue-600">
                White Market
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
                  href="/jobs"
                  className="text-gray-700 hover:text-green-600 transition-colors duration-200"
                >
                  Үйлчилгээ
                </Link>
                <Link
                  href="/dashboard"
                  className="text-gray-700 hover:text-green-600 transition-colors duration-200"
                >
                  Dashboard
                </Link>
                <Link
                  href="/messages"
                  className="text-gray-700 hover:text-green-600 transition-colors duration-200"
                >
                  Messages
                </Link>

                {/* Notification Bell */}
                <div className="relative">
                  <button
                    onClick={toggleNotifications}
                    className="relative p-2 text-gray-700 hover:text-green-600 transition-colors duration-200"
                    title="Мэдэгдэл"
                  >
                    <span className="text-xl">🔔</span>
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {unreadCount > 9 ? "9+" : unreadCount}
                      </span>
                    )}
                  </button>
                  <NotificationDropdown />
                </div>

                <UserButton
                  appearance={{
                    elements: {
                      avatarBox: "w-8 h-8",
                    },
                  }}
                />
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  href="/login"
                  className="text-gray-700 hover:text-green-600 transition-colors duration-200"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors duration-200"
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
