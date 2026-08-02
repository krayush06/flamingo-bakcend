const express = require("express");
const Razorpay = require("razorpay");
const paymentRouter = express.Router();
const { userAuth } = require("../middleware/auth"); // Aapka auth middleware
const User = require("../models/user"); // Aapka User model

// 1. Razorpay Instance Config
const instance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// 2. Create Order Endpoint (/payment/create)
paymentRouter.post("/payment/create", userAuth, async (req, res) => {
  try {
    const { membershipType } = req.body;

    // Amount in paise (1 INR = 100 paise)
    const amount = membershipType === "gold" ? 49900 : 19900;

    const options = {
      amount: amount,
      currency: "INR",
      receipt: `rcpt_${req.user._id.toString().slice(-8)}_${Date.now().toString().slice(-6)}`,
      notes: {
        userId: req.user._id.toString(),
        membershipType: membershipType,
      },
    };

    // Razorpay par Order create kar rahe hain
    const order = await instance.orders.create(options);

    // Response Frontend ko bhej rahe hain
    res.json({
      keyId: process.env.RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      orderId: order.id,
      notes: order.notes,
    });
  } /*catch (err) {
    res.status(500).json({ message: err.message });
  }*/
  catch (err) {
  console.error("Payment Error:", err);

  res.status(500).json({
    success: false,
    message: err.message,
  });
}
});

// 3. Webhook / Payment Verification Endpoint (/payment/webhook)
paymentRouter.post("/payment/webhook", async (req, res) => {
  try {
    const webhookEvent = req.body;

    // Direct event check (Production mein signature verify hota hai)
    if (webhookEvent.event === "payment.captured") {
      const payment = webhookEvent.payload.payment.entity;
      const userId = payment.notes.userId;
      const membershipType = payment.notes.membershipType;

      // User status update in Database
      await User.findByIdAndUpdate(userId, {
        isPremium: true,
        membershipType: membershipType,
      });
    }

    res.status(200).json({ message: "Webhook received successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = paymentRouter;