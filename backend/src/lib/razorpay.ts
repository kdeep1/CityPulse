import Razorpay from "razorpay";
export const razorpayInstance = new Razorpay({
  
  key_id: process.env.RAZORPAY_KEY_ID!,

  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});
console.log("Razorpay Key ID:", process.env.RAZORPAY_KEY_ID);
  console.log("Razorpay Key Secret:", process.env.RAZORPAY_KEY_SECRET);