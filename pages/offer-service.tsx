import React, { useState } from "react";
import { useRouter } from "next/router";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabase";

const OfferService: React.FC = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "Graphics & Design",
    packages: {
      basic: {
        name: "Үндсэн",
        price: "",
        description: "",
        deliveryTime: "3",
        revisions: "2",
      },
      standard: {
        name: "Стандарт",
        price: "",
        description: "",
        deliveryTime: "5",
        revisions: "3",
      },
      premium: {
        name: "Премиум",
        price: "",
        description: "",
        deliveryTime: "7",
        revisions: "5",
      },
    },
    tags: [] as string[],
    images: [] as File[],
  });

  const categories = [
    "Graphics & Design",
    "Programming & Tech",
    "Digital Marketing",
    "Writing & Translation",
  ];

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      // Simulate service creation (database not set up yet)
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // In production, this would insert into database
      console.log("Creating service:", {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        packages: formData.packages,
        user_id: user.id,
      });

      alert("Үйлчилгээ амжилттай үүсгэгдлээ!");
      router.push("/dashboard");
    } catch (error) {
      console.error("Error creating gig:", error);
      alert("Үйлчилгээ үүсгэхэд алдаа гарлаа. Дахин оролдоно уу.");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
          <div className="max-w-md w-full text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Please login to offer a service
            </h1>
            <button
              onClick={() => router.push("/login")}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex flex-col">
      <Navbar />
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-2xl w-full">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
              <span className="text-2xl" role="img" aria-label="Service">
                💼
              </span>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Үйлчилгээ үүсгэх
            </h1>
            <p className="text-lg text-gray-600">
              Өөрийн ур чадвараа харуулж үйлчлүүлэгчдийг тат
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-xl border border-gray-100 p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Basic Info */}
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Үйлчилгээний нэр
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Жишээ нь: Лого дизайн"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ангилал
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Тайлбар
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    placeholder="Үйлчилгээнийхээ дэлгэрэнгүй тайлбарыг бичнэ үү..."
                  />
                </div>
              </div>

              {/* Packages */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Багцууд
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {Object.entries(formData.packages).map(([key, pkg]) => (
                    <div
                      key={key}
                      className="border border-gray-200 rounded-lg p-4"
                    >
                      <h4 className="font-semibold text-gray-900 mb-3">
                        {pkg.name}
                      </h4>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">
                            Үнэ (₮)
                          </label>
                          <input
                            type="number"
                            value={pkg.price}
                            onChange={(e) => {
                              const newPackages = { ...formData.packages };
                              newPackages[
                                key as keyof typeof newPackages
                              ].price = e.target.value;
                              setFormData({
                                ...formData,
                                packages: newPackages,
                              });
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                            placeholder="0"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">
                            Хүргэх хугацаа (өдөр)
                          </label>
                          <input
                            type="number"
                            value={pkg.deliveryTime}
                            onChange={(e) => {
                              const newPackages = { ...formData.packages };
                              newPackages[
                                key as keyof typeof newPackages
                              ].deliveryTime = e.target.value;
                              setFormData({
                                ...formData,
                                packages: newPackages,
                              });
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">
                            Засвар (удаа)
                          </label>
                          <input
                            type="number"
                            value={pkg.revisions}
                            onChange={(e) => {
                              const newPackages = { ...formData.packages };
                              newPackages[
                                key as keyof typeof newPackages
                              ].revisions = e.target.value;
                              setFormData({
                                ...formData,
                                packages: newPackages,
                              });
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="flex-1 bg-gray-200 text-gray-800 py-3 px-6 rounded-lg hover:bg-gray-300 font-medium"
                >
                  Цуцлах
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50"
                >
                  {loading ? "Үүсгэж байна..." : "Үйлчилгээ үүсгэх"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfferService;
