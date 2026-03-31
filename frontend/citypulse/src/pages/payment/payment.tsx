import { useParams, useNavigate } from "react-router-dom";
import { api } from "../../api/axios";

export default function Payment() {
  const { bookingId } = useParams();
  const navigate = useNavigate();

  const handlePayment = async () => {
    try {
      const res = await api.post("/booking/payments/create", { bookingId });
      console.log("PAYMENT CREATE RESPONSE:", res.data);

      // Backend returns { payment, order }
      const { order } = res.data;
      startRazorpay(order);

    } catch (err: any) {
      console.error("Payment init error:", err.response?.data);
      alert(err.response?.data?.message || "Payment init failed");
    }
  };

  const startRazorpay = (order: any) => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency || "INR",
      name: "CityPulse",
      description: "Event Booking",
      order_id: order.id,

      handler: async function (response: any) {
        console.log("PAYMENT SUCCESS:", response);
        await confirmPayment(response);
      },

      prefill: {},
      theme: {
        color: "#7c3aed",
      },
    };

    if (!(window as any).Razorpay) {
      alert("Razorpay SDK not loaded. Please refresh the page.");
      return;
    }

    const rzp = new (window as any).Razorpay(options);
    rzp.on("payment.failed", (response: any) => {
      console.error("Payment failed:", response.error);
      alert("Payment failed: " + response.error.description);
    });
    rzp.open();
  };

  const confirmPayment = async (paymentData: any) => {
    try {
      console.log("RAZORPAY KEY:", import.meta.env.VITE_RAZORPAY_KEY_ID);
      const res = await api.post("/booking/payments/confirm", {
        bookingId,
        paymentId: paymentData.razorpay_payment_id,
        razorpay_order_id: paymentData.razorpay_order_id,
        razorpay_payment_id: paymentData.razorpay_payment_id,
        razorpay_signature: paymentData.razorpay_signature,
      });

      alert("🎉 Booking Confirmed! Your ticket has been generated.");
      console.log("TICKET:", res.data);
      navigate("/");

    } catch (err: any) {
      console.error("Confirm error:", err.response?.data);
      alert("Payment verification failed: " + (err.response?.data?.message || "Unknown error"));
    }
  };

  return (
    <div className="text-white text-center mt-20">
      <h1 className="text-3xl mb-6">Complete Payment 💳</h1>
      <p className="text-gray-400 mb-8">Booking ID: {bookingId}</p>
      <button
        onClick={handlePayment}
        className="bg-purple-600 px-8 py-4 rounded-xl text-lg hover:bg-purple-700 transition"
      >
        Pay Now
      </button>
    </div>
  );
}