import React, { useState } from "react";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";

const PaymentMethodsPage: React.FC = () => {
  const { user } = useAuth();
  const [paymentMethods, setPaymentMethods] = useState([
    {
      id: "1",
      type: "qpay",
      name: "QPay данс",
      account: "****1234",
      default: true,
    },
    {
      id: "2",
      type: "socialpay",
      name: "Social Pay",
      account: "****5678",
      default: false,
    },
    {
      id: "3",
      type: "bank",
      name: "Хаан банк",
      account: "****9012",
      default: false,
    },
  ]);

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-2xl font-bold text-gray-900">
            Please login to manage payment methods
          </h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Төлбөрийн арга
        </h1>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Таны данснууд
            </h2>
            <button className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700">
              Шинэ данс нэмэх
            </button>
          </div>

          <div className="space-y-4">
            {paymentMethods.map((method) => (
              <div
                key={method.id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
              >
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gray-100 rounded-md flex items-center justify-center mr-4">
                    <span className="text-gray-600 font-semibold">
                      {method.type === "qpay"
                        ? "QP"
                        : method.type === "socialpay"
                          ? "SP"
                          : "Б"}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{method.name}</p>
                    <p className="text-sm text-gray-600">{method.account}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {method.default && (
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                      Үндсэн
                    </span>
                  )}
                  <button className="text-blue-600 hover:text-blue-700 text-sm">
                    Засах
                  </button>
                  <button className="text-red-600 hover:text-red-700 text-sm">
                    Устгах
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentMethodsPage;
