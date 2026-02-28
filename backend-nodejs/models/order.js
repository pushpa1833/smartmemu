
const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  image: { type: String }
});

const orderSchema = new mongoose.Schema({
  orderId: { type: String, required: true, unique: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  username: { type: String, required: true },
  items: [orderItemSchema],
  totalAmount: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  finalAmount: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ["pending", "cooking", "ready", "completed", "cancelled"],
    default: "pending"
  },
  paymentStatus: { 
    type: String, 
    enum: ["paid", "pending", "failed"],
    default: "pending"
  },
  paymentMethod: {
    type: String,
    enum: ["phonepe", "cash_on_delivery"],
    default: "cash_on_delivery"
  },
  couponApplied: { type: String, default: null },
  // Delivery OTP fields
  deliveryOTP: { type: String, default: null },
  deliveryOTPExpires: { type: Date, default: null },
  isOTPVerified: { type: Boolean, default: false },
  otpVerifiedAt: { type: Date, default: null },
  // Feedback fields
  feedbackRating: { type: Number, min: 1, max: 5, default: null },
  feedbackComment: { type: String, default: null },
  feedbackSubmittedAt: { type: Date, default: null },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Generate unique order ID with retry logic
orderSchema.pre("save", async function(next) {
  if (!this.orderId) {
    let unique = false;
    let attempts = 0;
    const maxAttempts = 5;
    
    while (!unique && attempts < maxAttempts) {
      const timestamp = Date.now().toString(36).toUpperCase();
      const random = Math.random().toString(36).substring(2, 6).toUpperCase();
      const newOrderId = `ORD-${timestamp}-${random}`;
      
      // Check if this orderId already exists
      const existingOrder = await this.constructor.findOne({ orderId: newOrderId });
      if (!existingOrder) {
        this.orderId = newOrderId;
        unique = true;
      }
      attempts++;
    }
    
    if (!unique) {
      // Fallback: use timestamp with milliseconds
      this.orderId = `ORD-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
    }
  }
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model("Order", orderSchema);
