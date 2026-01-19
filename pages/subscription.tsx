import React from "react";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";

const SubscriptionPage: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-2xl font-bold text-gray-900">
            Please login to view subscriptions
          </h1>
        </div>
      </div>
    );
  }

  const plans = [
    {
      name: "Үндсэн",
      price: 0,
      features: [
        "3 хүртэлх үйлчилгээ үүсгэх",
        "Үндсэн мессеж",
        "Стандарт дэмжлэг",
      ],
    },
    {
      name: "Про",
      price: 29000,
      features: [
        "Хязгааргүй үйлчилгээ",
        "Тэргүүлэх мессеж",
        "Дээд зэрэглэлийн дэмжлэг",
        "Аналитикийн самбар",
      ],
      popular: true,
    },
    {
      name: "Байгууллага",
      price: 99000,
      features: [
        "Про-н бүх боломж",
        "Өөрийн брендинг",
        "Зориулсан менежер",
        "API хандалт",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Төлөвлөгөө сонгох
          </h1>
          <p className="text-lg text-gray-600">
            Чөлөөт ажилчны бизнесээ өргөжүүлэх дээд зэрэглэлийн боломжуудыг
            нээнэ
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`bg-white rounded-lg shadow-md p-6 ${
                plan.popular ? "border-2 border-green-500" : ""
              }`}
            >
              {plan.popular && (
                <div className="bg-green-500 text-white text-sm px-3 py-1 rounded-full inline-block mb-4">
                  Most Popular
                </div>
              )}
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {plan.name}
              </h2>
              <div className="text-3xl font-bold text-green-600 mb-6">
                ₮{plan.price.toLocaleString()}
                <span className="text-lg text-gray-500">/сар</span>
              </div>
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
              <button
                className={`w-full py-3 px-4 rounded-md font-semibold ${
                  plan.price === 0
                    ? "bg-gray-200 text-gray-700 cursor-not-allowed"
                    : "bg-green-600 text-white hover:bg-green-700"
                }`}
                disabled={plan.price === 0}
              >
                {plan.price === 0 ? "Одоогийн төлөвлөгөө" : "Сайжруулах"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPage;
