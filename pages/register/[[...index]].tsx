import React, { useState } from "react";
import { SignUp } from "@clerk/nextjs";

const Register: React.FC = () => {
  const [role, setRole] = useState<"worker" | "employer" | null>(null);

  if (!role) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-gray-900 mb-2">
              Join Our Platform
            </h2>
            <p className="text-lg text-gray-600">
              Select your role to get started
            </p>
          </div>
        </div>
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-6 shadow-xl rounded-xl border border-gray-100">
            <div className="space-y-4">
              <button
                onClick={() => setRole("worker")}
                className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-semibold text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transform transition-all duration-200 hover:scale-105"
              >
                <span className="mr-2" role="img" aria-label="Worker">
                  👷
                </span>
                Join as Worker
              </button>
              <button
                onClick={() => setRole("employer")}
                className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-semibold text-white bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transform transition-all duration-200 hover:scale-105"
              >
                <span className="mr-2" role="img" aria-label="Employer">
                  🏢
                </span>
                Join as Employer
              </button>
            </div>
            <div className="mt-8 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <a
                  href="/login"
                  className="font-semibold text-indigo-600 hover:text-indigo-500 transition-colors duration-200"
                >
                  Sign in
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen ${role === "worker" ? "bg-gradient-to-br from-blue-50 via-white to-blue-100" : "bg-gradient-to-br from-green-50 via-white to-green-100"} flex flex-col justify-center py-12 sm:px-6 lg:px-8`}
    >
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center mb-8">
          <div
            className={`inline-flex items-center justify-center w-16 h-16 ${role === "worker" ? "bg-blue-100" : "bg-green-100"} rounded-full mb-4`}
          >
            <span
              className="text-2xl"
              role="img"
              aria-label={role === "worker" ? "Worker" : "Employer"}
            >
              {role === "worker" ? "👷" : "🏢"}
            </span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Create Your {role.charAt(0).toUpperCase() + role.slice(1)} Account
          </h2>
          <p className="text-gray-600">
            {role === "worker"
              ? "Start offering your services"
              : "Find the perfect talent for your projects"}
          </p>
        </div>
      </div>
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-xl rounded-xl border border-gray-100">
          <SignUp
            path="/register"
            routing="path"
            signInUrl="/login"
            redirectUrl="/"
            unsafeMetadata={{ role }}
            appearance={{
              elements: {
                formButtonPrimary: `${role === "worker" ? "bg-blue-600 hover:bg-blue-700" : "bg-green-600 hover:bg-green-700"} text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200`,
                card: "shadow-none border-none",
                headerTitle: "hidden",
                headerSubtitle: "hidden",
                socialButtonsBlockButton:
                  "border border-gray-300 hover:bg-gray-50 transition-colors duration-200",
              },
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Register;
