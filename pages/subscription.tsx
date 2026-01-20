import React, { useState } from "react";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";

interface Subscription {
  id: string;
  plan: string;
  status: "active" | "cancelled" | "expired";
  startDate: string;
  endDate: string;
  amount: number;
  autoRenew: boolean;
}

const SubscriptionPage: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("current");
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  // Mock current subscription data
  const currentSubscription: Subscription = {
    id: "sub_123",
    plan: "Үндсэн",
    status: "active",
    startDate: "2024-01-15",
    endDate: "2024-02-15",
    amount: 0,
    autoRenew: true,
  };

  // Mock subscription history
  const subscriptionHistory: Subscription[] = [
    {
      id: "sub_123",
      plan: "Үндсэн",
      status: "active",
      startDate: "2024-01-15",
      endDate: "2024-02-15",
      amount: 0,
      autoRenew: true,
    },
    {
      id: "sub_122",
      plan: "Про",
      status: "expired",
      startDate: "2023-12-15",
      endDate: "2024-01-15",
      amount: 29000,
      autoRenew: false,
    },
  ];

  const handleUpgrade = (planName: string) => {
    setSelectedPlan(planName);
    setShowUpgradeModal(true);
  };

  const confirmUpgrade = () => {
    if (!selectedPlan) return;

    // Simulate API call
    alert(
      `${selectedPlan} төлөвлөгөөнд шинэчлэх хүсэлтийг илгээлээ. Төлбөр баталгаажсан дараа идэвхжих болно.`,
    );
    setShowUpgradeModal(false);
    setSelectedPlan(null);
  };

  const handleCancelSubscription = () => {
    // Simulate API call
    alert(
      "Таны захиалгыг цуцлах хүсэлтийг хүлээн авлаа. Энэ сарын төгсгөлд хүчингүй болно.",
    );
    setShowCancelModal(false);
  };

  const toggleAutoRenew = () => {
    // Simulate API call
    alert("Автомат сунгалтын тохиргоог шинэчиллээ.");
  };

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
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Захиалгын удирлага
        </h1>

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow-md mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex">
              <button
                onClick={() => setActiveTab("current")}
                className={`px-6 py-4 text-sm font-medium ${
                  activeTab === "current"
                    ? "border-b-2 border-green-500 text-green-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Одоогийн захиалга
              </button>
              <button
                onClick={() => setActiveTab("history")}
                className={`px-6 py-4 text-sm font-medium ${
                  activeTab === "history"
                    ? "border-b-2 border-green-500 text-green-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Захиалгын түүх
              </button>
              <button
                onClick={() => setActiveTab("plans")}
                className={`px-6 py-4 text-sm font-medium ${
                  activeTab === "plans"
                    ? "border-b-2 border-green-500 text-green-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Төлөвлөгөөнүүд
              </button>
            </nav>
          </div>
        </div>

        {/* Current Subscription Tab */}
        {activeTab === "current" && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Одоогийн захиалга
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Төлөвлөгөө
                  </label>
                  <p className="text-lg font-semibold text-gray-900">
                    {currentSubscription.plan}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Төлөв
                  </label>
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      currentSubscription.status === "active"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {currentSubscription.status === "active"
                      ? "Идэвхтэй"
                      : "Цуцлагдсан"}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Эхлэх огноо
                  </label>
                  <p className="text-gray-900">
                    {new Date(currentSubscription.startDate).toLocaleDateString(
                      "mn-MN",
                    )}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Дуусах огноо
                  </label>
                  <p className="text-gray-900">
                    {new Date(currentSubscription.endDate).toLocaleDateString(
                      "mn-MN",
                    )}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Сарын төлбөр
                  </label>
                  <p className="text-2xl font-bold text-green-600">
                    ₮{currentSubscription.amount.toLocaleString()}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Автомат сунгалт
                  </label>
                  <button
                    onClick={toggleAutoRenew}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      currentSubscription.autoRenew
                        ? "bg-green-600"
                        : "bg-gray-200"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        currentSubscription.autoRenew
                          ? "translate-x-6"
                          : "translate-x-1"
                      }`}
                    />
                  </button>
                  <span className="ml-3 text-sm text-gray-600">
                    {currentSubscription.autoRenew ? "Идэвхтэй" : "Идэвхгүй"}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex space-x-4">
              <button
                onClick={() => setActiveTab("plans")}
                className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700"
              >
                Төлөвлөгөө сайжруулах
              </button>
              <button
                onClick={() => setShowCancelModal(true)}
                className="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700"
              >
                Захиалга цуцлах
              </button>
            </div>
          </div>
        )}

        {/* Subscription History Tab */}
        {activeTab === "history" && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Захиалгын түүх
            </h2>

            <div className="space-y-4">
              {subscriptionHistory.map((subscription) => (
                <div
                  key={subscription.id}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {subscription.plan}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {new Date(subscription.startDate).toLocaleDateString(
                          "mn-MN",
                        )}{" "}
                        -{" "}
                        {new Date(subscription.endDate).toLocaleDateString(
                          "mn-MN",
                        )}
                      </p>
                    </div>
                    <div className="text-right">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          subscription.status === "active"
                            ? "bg-green-100 text-green-800"
                            : subscription.status === "cancelled"
                              ? "bg-red-100 text-red-800"
                              : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {subscription.status === "active"
                          ? "Идэвхтэй"
                          : subscription.status === "cancelled"
                            ? "Цуцлагдсан"
                            : "Дууссан"}
                      </span>
                      <p className="text-lg font-bold text-green-600 mt-1">
                        ₮{subscription.amount.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <span>
                      Автомат сунгалт:{" "}
                      {subscription.autoRenew ? "Тийм" : "Үгүй"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Plans Tab */}
        {activeTab === "plans" && (
          <div>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Төлөвлөгөө сонгох
              </h2>
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
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {plan.name}
                  </h3>
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
                    onClick={() => handleUpgrade(plan.name)}
                    className={`w-full py-3 px-4 rounded-md font-semibold ${
                      plan.name === currentSubscription.plan
                        ? "bg-gray-200 text-gray-700 cursor-not-allowed"
                        : "bg-green-600 text-white hover:bg-green-700"
                    }`}
                    disabled={plan.name === currentSubscription.plan}
                  >
                    {plan.name === currentSubscription.plan
                      ? "Одоогийн төлөвлөгөө"
                      : "Сайжруулах"}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Cancel Subscription Modal */}
        {showCancelModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Захиалга цуцлах
              </h3>
              <p className="text-gray-600 mb-6">
                Та захиалгаа цуцлахдаа итгэлтэй байна уу? Энэ сарын төгсгөлд
                хүчингүй болно.
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowCancelModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Цуцлах
                </button>
                <button
                  onClick={handleCancelSubscription}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  Цуцлах
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Upgrade Modal */}
        {showUpgradeModal && selectedPlan && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                {selectedPlan} төлөвлөгөөнд шинэчлэх
              </h3>
              <p className="text-gray-600 mb-6">
                Та {selectedPlan} төлөвлөгөөнд шинэчлэх гэж байна. Төлбөр
                баталгаажсан дараа идэвхжих болно.
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowUpgradeModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Цуцлах
                </button>
                <button
                  onClick={confirmUpgrade}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  Баталгаажуулах
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubscriptionPage;
