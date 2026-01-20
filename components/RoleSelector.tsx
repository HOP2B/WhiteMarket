import React from "react";
import { useAuth } from "../context/AuthContext";

const RoleSelector: React.FC = () => {
  const { updateUserRole } = useAuth();

  const handleRoleSelect = (role: "freelancer" | "client") => {
    updateUserRole(role);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Таны үүрэг сонгох
          </h2>
          <p className="text-gray-600">
            Та freelancer үү эсвэл үйлчлүүлэгч үү?
          </p>
        </div>

        <div className="space-y-4">
          <button
            onClick={() => handleRoleSelect("freelancer")}
            className="w-full p-6 border-2 border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors group"
          >
            <div className="text-center">
              <div className="text-4xl mb-3">💼</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Freelancer
              </h3>
              <p className="text-gray-600 text-sm">
                Би үйлчилгээ үзүүлэгч байна. Өөрийн ур чадвараа зарж, ажил
                хийнэ.
              </p>
            </div>
          </button>

          <button
            onClick={() => handleRoleSelect("client")}
            className="w-full p-6 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors group"
          >
            <div className="text-center">
              <div className="text-4xl mb-3">👤</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Үйлчлүүлэгч
              </h3>
              <p className="text-gray-600 text-sm">
                Би үйлчилгээ хайж байна. Freelancer-үүдээс ажил захиална.
              </p>
            </div>
          </button>
        </div>

        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            Та үүрэгээ хүссэн үедээ профайл хэсгээс өөрчлөх боломжтой.
          </p>
        </div>
      </div>
    </div>
  );
};

export default RoleSelector;
