const Order = require("../../models/order");
const User = require("../../models/user");

// Create a new order
exports.createOrder = async (req, res) => {
  try {
    // Get userId from authenticated token (more secure)
    const userId = req.userId;
    const { items, totalAmount, discount, finalAmount, couponApplied, paymentStatus, paymentMethod } = req.body;

    console.log("Creating order for user:", userId);
    console.log("Order data:", { items, totalAmount, discount, finalAmount, paymentMethod });

    // Validate required fields
    if (!userId) {
      return res.status(400).json({ message: "User not authenticated" });
    }
    
    if (!items || items.length === 0) {
      return res.status(400).json({ message: "Cart is empty. Please add items to your cart." });
    }
    
    if (!finalAmount || finalAmount <= 0) {
      return res.status(400).json({ message: "Invalid order amount" });
    }

    // Get user details
    const user = await User.findById(userId);
    if (!user) {
      console.error("User not found for ID:", userId);
      return res.status(404).json({ message: "User account not found. Please login again." });
    }

    // Generate order ID manually to ensure it works
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    const orderId = `ORD-${timestamp}-${random}`;

    // Create new order
    const newOrder = new Order({
      orderId,
      userId,
      username: user.username,
      items,
      totalAmount,
      discount: discount || 0,
      finalAmount,
      couponApplied: couponApplied || null,
      paymentStatus: paymentStatus || "pending",
      paymentMethod: paymentMethod || "cash_on_delivery",
      status: "pending"
    });

    console.log("Order created with ID:", orderId);
    await newOrder.save();

    res.status(201).json({
      message: "Order placed successfully",
      order: newOrder
    });
  } catch (err) {
    console.error("Create order error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get all orders (for admin)
exports.getAllOrders = async (req, res) => {
  try {
    const { status, paymentStatus, date } = req.query;
    
    let query = {};
    
    // Filter by status if provided
    if (status) {
      query.status = status;
    }
    
    // Filter by payment status if provided
    if (paymentStatus) {
      query.paymentStatus = paymentStatus;
    }
    
    // Filter by date if provided (YYYY-MM-DD)
    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);
      query.createdAt = { $gte: startDate, $lte: endDate };
    }

    const orders = await Order.find(query).sort({ createdAt: -1 });
    
    res.json(orders);
  } catch (err) {
    console.error("Get all orders error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get order by ID
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.json(order);
  } catch (err) {
    console.error("Get order by ID error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get orders by user ID
exports.getOrdersByUser = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    console.error("Get orders by user error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Update order status
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!["pending", "cooking", "ready", "completed", "cancelled"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status, updatedAt: new Date() },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json({
      message: "Order status updated",
      order
    });
  } catch (err) {
    console.error("Update order status error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Update payment status
exports.updatePaymentStatus = async (req, res) => {
  try {
    const { paymentStatus } = req.body;
    
    if (!["paid", "pending", "failed"].includes(paymentStatus)) {
      return res.status(400).json({ message: "Invalid payment status" });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { paymentStatus, updatedAt: new Date() },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json({
      message: "Payment status updated",
      order
    });
  } catch (err) {
    console.error("Update payment status error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get sales statistics
exports.getSalesStats = async (req, res) => {
  try {
    const { period } = req.query;
    
    let startDate = new Date();
    
    switch (period) {
      case "today":
        startDate.setHours(0, 0, 0, 0);
        break;
      case "week":
        startDate.setDate(startDate.getDate() - 7);
        break;
      case "month":
        startDate.setMonth(startDate.getMonth() - 1);
        break;
      case "year":
        startDate.setFullYear(startDate.getFullYear() - 1);
        break;
      default:
        startDate = new Date(0); // All time
    }

    const orders = await Order.find({
      createdAt: { $gte: startDate },
      status: { $ne: "cancelled" }
    });

    // Calculate statistics
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, order) => sum + order.finalAmount, 0);
    const totalDiscount = orders.reduce((sum, order) => sum + order.discount, 0);
    const paidOrders = orders.filter(order => order.paymentStatus === "paid").length;
    const pendingOrders = orders.filter(order => order.paymentStatus === "pending").length;

    // Orders by status
    const ordersByStatus = {
      pending: orders.filter(o => o.status === "pending").length,
      cooking: orders.filter(o => o.status === "cooking").length,
      ready: orders.filter(o => o.status === "ready").length,
      completed: orders.filter(o => o.status === "completed").length,
      cancelled: orders.filter(o => o.status === "cancelled").length
    };

    // Daily sales for the period
    const dailySales = {};
    orders.forEach(order => {
      const date = order.createdAt.toISOString().split("T")[0];
      if (!dailySales[date]) {
        dailySales[date] = { orders: 0, revenue: 0 };
      }
      dailySales[date].orders += 1;
      dailySales[date].revenue += order.finalAmount;
    });

    res.json({
      totalOrders,
      totalRevenue,
      totalDiscount,
      paidOrders,
      pendingOrders,
      ordersByStatus,
      dailySales
    });
  } catch (err) {
    console.error("Get sales stats error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Delete order
exports.deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json({ message: "Order deleted successfully" });
  } catch (err) {
    console.error("Delete order error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Generate Delivery OTP - called when admin marks order as "Ready"
exports.generateDeliveryOTP = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date();
    otpExpires.setMinutes(otpExpires.getMinutes() + 30); // OTP valid for 30 minutes

    order.deliveryOTP = otp;
    order.deliveryOTPExpires = otpExpires;
    await order.save();

    console.log(`OTP generated for order ${order.orderId}: ${otp}`);

    res.json({
      message: "Delivery OTP generated successfully",
      otp: otp, // In production, send via SMS instead
      expiresAt: otpExpires,
      orderId: order.orderId
    });
  } catch (err) {
    console.error("Generate OTP error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Verify Delivery OTP - called when customer receives food
exports.verifyDeliveryOTP = async (req, res) => {
  try {
    const { otp } = req.body;
    const orderId = req.params.id;

    const order = await Order.findById(orderId);
    
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Check if OTP is already verified
    if (order.isOTPVerified) {
      return res.status(400).json({ message: "Order already verified" });
    }

    // Check if OTP matches
    if (order.deliveryOTP !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // Check if OTP is expired
    if (new Date() > order.deliveryOTPExpires) {
      return res.status(400).json({ message: "OTP has expired" });
    }

    // Mark as verified and complete the order
    order.isOTPVerified = true;
    order.otpVerifiedAt = new Date();
    order.status = "completed";
    order.deliveryOTP = null; // Clear OTP after verification
    order.deliveryOTPExpires = null;
    await order.save();

    res.json({
      message: "Order verified successfully! Delivery confirmed.",
      order
    });
  } catch (err) {
    console.error("Verify OTP error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Resend Delivery OTP
exports.resendDeliveryOTP = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.status !== "ready") {
      return res.status(400).json({ message: "OTP can only be generated for ready orders" });
    }

    if (order.isOTPVerified) {
      return res.status(400).json({ message: "Order already verified" });
    }

    // Generate new 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date();
    otpExpires.setMinutes(otpExpires.getMinutes() + 30);

    order.deliveryOTP = otp;
    order.deliveryOTPExpires = otpExpires;
    await order.save();

    res.json({
      message: "New OTP sent successfully",
      otp: otp,
      expiresAt: otpExpires
    });
  } catch (err) {
    console.error("Resend OTP error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Submit feedback for completed order
exports.submitFeedback = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const orderId = req.params.id;

    // Validate rating
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Please provide a valid rating (1-5)" });
    }

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Check if order is completed
    if (order.status !== "completed") {
      return res.status(400).json({ message: "Feedback can only be submitted for completed orders" });
    }

    // Check if feedback already submitted
    if (order.feedbackSubmittedAt) {
      return res.status(400).json({ message: "Feedback already submitted for this order" });
    }

    // Update order with feedback
    order.feedbackRating = rating;
    order.feedbackComment = comment || "";
    order.feedbackSubmittedAt = new Date();
    await order.save();

    console.log(`Feedback submitted for order ${order.orderId}: Rating - ${rating}, Comment - ${comment || "N/A"}`);

    res.json({
      message: "Thank you for your feedback!",
      feedback: {
        rating: order.feedbackRating,
        comment: order.feedbackComment,
        submittedAt: order.feedbackSubmittedAt
      }
    });
  } catch (err) {
    console.error("Submit feedback error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Submit feedback for completed order
exports.submitFeedback = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const orderId = req.params.id;

    // Validate rating
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Please provide a valid rating (1-5)" });
    }

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Check if order is completed
    if (order.status !== "completed") {
      return res.status(400).json({ message: "Feedback can only be submitted for completed orders" });
    }

    // Check if feedback already submitted
    if (order.feedbackSubmittedAt) {
      return res.status(400).json({ message: "Feedback already submitted for this order" });
    }

    // Update order with feedback
    order.feedbackRating = rating;
    order.feedbackComment = comment || "";
    order.feedbackSubmittedAt = new Date();
    await order.save();

    console.log(`Feedback submitted for order ${order.orderId}: Rating - ${rating}, Comment - ${comment || "N/A"}`);

    res.json({
      message: "Thank you for your feedback!",
      feedback: {
        rating: order.feedbackRating,
        comment: order.feedbackComment,
        submittedAt: order.feedbackSubmittedAt
      }
    });
  } catch (err) {
    console.error("Submit feedback error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
