import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import { getGigById, createOrder } from "../api/mockApi";

const CheckoutPage: React.FC = () => {
  const { user } = useAuth();
  const router = useRouter();
  const { gigId } = router.query;
  const [gig, setGig] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Order Summary
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
            <p className="text-gray-600 mb-4">{gig.description}</p>
            <div className="border-t pt-4">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold">Нийт:</span>
                <span className="text-2xl font-bold text-green-600">
                  ₮{gig.price.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Payment</h2>
            <div>
              <p className="text-gray-600 mb-4">
                Ready to hire this freelancer? Click below to complete your
                payment.
              </p>
              <button
                onClick={handleQPayPayment}
                disabled={processing}
                className="w-full bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 disabled:opacity-50"
              >
                {processing
                  ? "QPay төлбөр боловсруулж байна..."
                  : `QPay-р төлөх ₮${gig.price.toLocaleString()}`}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
