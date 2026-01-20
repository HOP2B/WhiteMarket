import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import { getGigById, createOrder } from "../api/mockApi";

interface OrderDetails {
  requirements: string;
  deliveryDate: string;
  specialInstructions: string;
}

const CheckoutPage: React.FC = () => {
  const { user } = useAuth();
  const router = useRouter();
  const { gigId } = router.query;
  const [gig, setGig] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("qpay");
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [orderDetails, setOrderDetails] = useState<OrderDetails>({
    requirements: "",
    deliveryDate: "",
    specialInstructions: "",
  });

  const applyPromoCode = () => {
    if (promoCode.toLowerCase() === "discount10") {
      setDiscount(gig ? gig.price * 0.1 : 0);
      alert("10% хөнгөлөлт амжилттай хэрэглэгдлээ!");
    } else if (promoCode.toLowerCase() === "welcome20") {
      setDiscount(gig ? gig.price * 0.2 : 0);
      alert("20% хөнгөлөлт амжилттай хэрэглэгдлээ!");
    } else {
      alert("Буруу промо код!");
      setDiscount(0);
    }
  };

  const calculateTotal = () => {
    if (!gig) return 0;
    return gig.price - discount;
  };

  const handlePayment = async () => {
    if (!gig || !user) return;

    // Validate order details
    if (!orderDetails.requirements.trim()) {
      alert("Үйлчилгээний шаардлагыг оруулна уу!");
      return;
    }

    if (!orderDetails.deliveryDate) {
      alert("Дуусгах огноог сонгоно уу!");
      return;
    }

    setProcessing(true);
    try {
      if (selectedPaymentMethod === "qpay") {
        await handleQPayPayment();
      } else if (selectedPaymentMethod === "socialpay") {
        await handleSocialPayPayment();
      } else if (selectedPaymentMethod === "bank") {
        await handleBankTransferPayment();
      }
    } catch (error) {
      console.error("Payment error:", error);
      alert("Төлбөр амжилтгүй боллоо. Дахин оролдоно уу.");
    } finally {
      setProcessing(false);
    }
  };

  const handleSocialPayPayment = async () => {
    // Simulate Social Pay payment
    alert("Social Pay төлбөрийн интеграц хөгжүүлэгдэж байна. QPay-р төлнө үү.");
  };

  const handleBankTransferPayment = async () => {
    // Simulate Bank transfer payment
    alert(
      "Банкны шилжүүлэг хүлээн авлаа. Баталгаажуулалт 1-2 ажлын өдөр үргэлжилнэ.",
    );
    router.push("/dashboard");
  };

  useEffect(() => {
    const fetchGig = async () => {
      if (gigId && typeof gigId === "string") {
        try {
          const gigData = await getGigById(gigId);
          setGig(gigData);
        } catch (error) {
          console.error("Error fetching gig:", error);
        }
      }
      setLoading(false);
    };

    fetchGig();
  }, [gigId]);

  const handleQPayPayment = async () => {
    if (!gig || !user) return;

    setProcessing(true);
    try {
      // QPay Integration Simulation
      // In production, this would use QPay's API/SDK

      // Step 1: Create invoice with QPay
      const invoiceData = {
        amount: gig.price,
        currency: "MNT",
        description: `Payment for ${gig.title}`,
        callback_url: `${window.location.origin}/payment/callback`,
        merchant_id: process.env.NEXT_PUBLIC_QPAY_MERCHANT_ID,
      };

      // Simulate QPay API call
      console.log("Creating QPay invoice:", invoiceData);

      // Simulate API response
      const qpayResponse = {
        invoice_id: `QPAY_${Date.now()}`,
        qr_code: "https://api.qpay.mn/v2/qr?invoice_id=QPAY_" + Date.now(),
        payment_url: "https://qpay.mn/payment/" + Date.now(),
      };

      // Step 2: Create order (simulate - database not set up yet)
      const order = {
        id: Date.now().toString(),
        gig_id: gig.id,
        buyer_id: user.id,
        seller_id: gig.userId,
        amount: gig.price,
        status: "pending",
        qpay_invoice_id: qpayResponse.invoice_id,
        created_at: new Date().toISOString(),
      };

      console.log("Creating order:", order);
      // await createOrder(order); // Commented out until database is set up

      // Step 3: Redirect to QPay payment page or show QR code
      // For demo purposes, we'll simulate successful payment
      setTimeout(async () => {
        // Update order status to completed
        const updatedOrder = { ...order, status: "completed" };
        // In real app, this would be done via webhook

        alert(
          `QPay төлбөр амжилттай! ₮${gig.price.toLocaleString()} төлөгдлөө.`,
        );
        router.push("/dashboard");
      }, 3000);
    } catch (error) {
      console.error("QPay payment error:", error);
      alert("Төлбөр амжилтгүй боллоо. Дахин оролдоно уу.");
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-2xl font-bold text-gray-900">
            Please login to checkout
          </h1>
        </div>
      </div>
    );
  }

  if (!gig) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-2xl font-bold text-gray-900">Gig not found</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Тооцоо хийх</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Захиалгын дэлгэрэнгүй
              </h2>
              <div className="flex items-center mb-4">
                <img
                  src={gig.userAvatar}
                  alt={gig.userName}
                  className="w-12 h-12 rounded-full mr-4"
                />
                <div>
                  <h3 className="font-semibold text-gray-900">{gig.title}</h3>
                  <p className="text-sm text-gray-600">by {gig.userName}</p>
                </div>
              </div>
              <p className="text-gray-600 mb-4 text-sm">{gig.description}</p>

              {/* Promo Code */}
              <div className="border-t pt-4 mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Промо код
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Промо код оруулна уу"
                  />
                  <button
                    onClick={applyPromoCode}
                    className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                  >
                    Хэрэглэх
                  </button>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between">
                  <span>Үндсэн үнэ:</span>
                  <span>₮{gig.price.toLocaleString()}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Хөнгөлөлт:</span>
                    <span>-₮{discount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between items-center pt-2 border-t">
                  <span className="text-lg font-semibold">Нийт:</span>
                  <span className="text-2xl font-bold text-green-600">
                    ₮{calculateTotal().toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Order Details and Payment */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Requirements */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900">
                  Захиалгын мэдээлэл
                </h2>
                <button
                  onClick={() => setShowOrderDetails(!showOrderDetails)}
                  className="text-green-600 hover:text-green-700 text-sm"
                >
                  {showOrderDetails ? "Хураах" : "Дэлгэрэнгүй"}
                </button>
              </div>

              {showOrderDetails && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Таны шаардлага *
                    </label>
                    <textarea
                      value={orderDetails.requirements}
                      onChange={(e) =>
                        setOrderDetails({
                          ...orderDetails,
                          requirements: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      rows={4}
                      placeholder="Үйлчилгээний талаархи дэлгэрэнгүй шаардлага, хүссэн үр дүн зэргийг бичнэ үү..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Дуусгах огноо *
                    </label>
                    <input
                      type="date"
                      value={orderDetails.deliveryDate}
                      onChange={(e) =>
                        setOrderDetails({
                          ...orderDetails,
                          deliveryDate: e.target.value,
                        })
                      }
                      min={
                        new Date(Date.now() + 24 * 60 * 60 * 1000)
                          .toISOString()
                          .split("T")[0]
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Нэмэлт заавар
                    </label>
                    <textarea
                      value={orderDetails.specialInstructions}
                      onChange={(e) =>
                        setOrderDetails({
                          ...orderDetails,
                          specialInstructions: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      rows={3}
                      placeholder="Нэмэлт тайлбар, файлын линк зэрэг..."
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Payment Method Selection */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Төлбөрийн арга сонгох
              </h2>

              <div className="space-y-3">
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="qpay"
                    name="paymentMethod"
                    value="qpay"
                    checked={selectedPaymentMethod === "qpay"}
                    onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                    className="mr-3"
                  />
                  <label
                    htmlFor="qpay"
                    className="flex items-center cursor-pointer"
                  >
                    <div className="w-8 h-8 bg-blue-100 rounded-md flex items-center justify-center mr-3">
                      <span className="text-blue-600 font-semibold text-sm">
                        QP
                      </span>
                    </div>
                    <div>
                      <span className="font-medium">QPay</span>
                      <p className="text-sm text-gray-600">
                        Шуурхай, аюулгүй төлбөр
                      </p>
                    </div>
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="radio"
                    id="socialpay"
                    name="paymentMethod"
                    value="socialpay"
                    checked={selectedPaymentMethod === "socialpay"}
                    onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                    className="mr-3"
                  />
                  <label
                    htmlFor="socialpay"
                    className="flex items-center cursor-pointer"
                  >
                    <div className="w-8 h-8 bg-purple-100 rounded-md flex items-center justify-center mr-3">
                      <span className="text-purple-600 font-semibold text-sm">
                        SP
                      </span>
                    </div>
                    <div>
                      <span className="font-medium">Social Pay</span>
                      <p className="text-sm text-gray-600">
                        Сошиал апп-аар төлөх
                      </p>
                    </div>
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="radio"
                    id="bank"
                    name="paymentMethod"
                    value="bank"
                    checked={selectedPaymentMethod === "bank"}
                    onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                    className="mr-3"
                  />
                  <label
                    htmlFor="bank"
                    className="flex items-center cursor-pointer"
                  >
                    <div className="w-8 h-8 bg-green-100 rounded-md flex items-center justify-center mr-3">
                      <span className="text-green-600 font-semibold text-sm">
                        Б
                      </span>
                    </div>
                    <div>
                      <span className="font-medium">Банкны шилжүүлэг</span>
                      <p className="text-sm text-gray-600">
                        Удамшуулалтын мэдээлэл
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              <div className="mt-6">
                <button
                  onClick={handlePayment}
                  disabled={processing}
                  className="w-full bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {processing ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                      Боловсруулж байна...
                    </div>
                  ) : (
                    `₮${calculateTotal().toLocaleString()} төлөх`
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
