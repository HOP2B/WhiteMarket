import React, { useState } from "react";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";

interface PaymentMethod {
  id: string;
  type: string;
  name: string;
  account: string;
  default: boolean;
}

const PaymentMethodsPage: React.FC = () => {
  const { user } = useAuth();
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
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

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingMethod, setEditingMethod] = useState<PaymentMethod | null>(
    null,
  );
  const [newMethod, setNewMethod] = useState({
    type: "qpay",
    name: "",
    account: "",
  });

  const handleAddPaymentMethod = () => {
    if (!newMethod.name || !newMethod.account) {
      alert("Бүх талбарыг бөглөнө үү");
      return;
    }

    const newPaymentMethod: PaymentMethod = {
      id: Date.now().toString(),
      type: newMethod.type,
      name: newMethod.name,
      account: newMethod.account,
      default: paymentMethods.length === 0, // First method is default
    };

    setPaymentMethods([...paymentMethods, newPaymentMethod]);
    setNewMethod({ type: "qpay", name: "", account: "" });
    setShowAddModal(false);
    alert("Төлбөрийн арга амжилттай нэмэгдлээ!");
  };

  const handleEditPaymentMethod = () => {
    if (!editingMethod || !editingMethod.name || !editingMethod.account) {
      alert("Бүх талбарыг бөглөнө үү");
      return;
    }

    setPaymentMethods(
      paymentMethods.map((method) =>
        method.id === editingMethod.id ? editingMethod : method,
      ),
    );
    setEditingMethod(null);
    setShowEditModal(false);
    alert("Төлбөрийн арга амжилттай шинэчлэгдлээ!");
  };

  const handleDeletePaymentMethod = (id: string) => {
    if (paymentMethods.length === 1) {
      alert("Хамгийн багадаа нэг төлбөрийн арга байх ёстой!");
      return;
    }

    const methodToDelete = paymentMethods.find((m) => m.id === id);
    if (methodToDelete?.default) {
      alert("Үндсэн төлбөрийн аргыг устгах боломжгүй!");
      return;
    }

    if (confirm("Энэ төлбөрийн аргыг устгахдаа итгэлтэй байна уу?")) {
      setPaymentMethods(paymentMethods.filter((method) => method.id !== id));
      alert("Төлбөрийн арга амжилттай устгагдлаа!");
    }
  };

  const handleSetDefault = (id: string) => {
    setPaymentMethods(
      paymentMethods.map((method) => ({
        ...method,
        default: method.id === id,
      })),
    );
    alert("Үндсэн төлбөрийн арга шинэчлэгдлээ!");
  };

  const openEditModal = (method: PaymentMethod) => {
    setEditingMethod({ ...method });
    setShowEditModal(true);
  };

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
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
            >
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
                  {!method.default && (
                    <button
                      onClick={() => handleSetDefault(method.id)}
                      className="text-green-600 hover:text-green-700 text-sm"
                    >
                      Үндсэн болгох
                    </button>
                  )}
                  <button
                    onClick={() => openEditModal(method)}
                    className="text-blue-600 hover:text-blue-700 text-sm"
                  >
                    Засах
                  </button>
                  <button
                    onClick={() => handleDeletePaymentMethod(method.id)}
                    className="text-red-600 hover:text-red-700 text-sm"
                  >
                    Устгах
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Add Payment Method Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">
                  Шинэ төлбөрийн арга нэмэх
                </h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Төлбөрийн төрөл
                  </label>
                  <select
                    value={newMethod.type}
                    onChange={(e) =>
                      setNewMethod({ ...newMethod, type: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="qpay">QPay</option>
                    <option value="socialpay">Social Pay</option>
                    <option value="bank">Банкны данс</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Дансны нэр
                  </label>
                  <input
                    type="text"
                    value={newMethod.name}
                    onChange={(e) =>
                      setNewMethod({ ...newMethod, name: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Жишээ: QPay данс"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Дансны дугаар
                  </label>
                  <input
                    type="text"
                    value={newMethod.account}
                    onChange={(e) =>
                      setNewMethod({ ...newMethod, account: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Жишээ: ****1234"
                  />
                </div>
              </div>

              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Цуцлах
                </button>
                <button
                  onClick={handleAddPaymentMethod}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  Нэмэх
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Payment Method Modal */}
        {showEditModal && editingMethod && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">
                  Төлбөрийн арга засах
                </h3>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Төлбөрийн төрөл
                  </label>
                  <select
                    value={editingMethod.type}
                    onChange={(e) =>
                      setEditingMethod({
                        ...editingMethod,
                        type: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="qpay">QPay</option>
                    <option value="socialpay">Social Pay</option>
                    <option value="bank">Банкны данс</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Дансны нэр
                  </label>
                  <input
                    type="text"
                    value={editingMethod.name}
                    onChange={(e) =>
                      setEditingMethod({
                        ...editingMethod,
                        name: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Жишээ: QPay данс"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Дансны дугаар
                  </label>
                  <input
                    type="text"
                    value={editingMethod.account}
                    onChange={(e) =>
                      setEditingMethod({
                        ...editingMethod,
                        account: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Жишээ: ****1234"
                  />
                </div>
              </div>

              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Цуцлах
                </button>
                <button
                  onClick={handleEditPaymentMethod}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  Хадгалах
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentMethodsPage;
