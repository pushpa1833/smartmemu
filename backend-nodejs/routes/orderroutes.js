

const express = require("express");
const router = express.Router();
const orderController = require("./controllers/ordercontroller");
const authMiddleware = require("../middlewar/authMiddleware");

// Protected - Create order (when customer places order) - requires authentication
router.post("/", authMiddleware, orderController.createOrder);

// Protected - Get all orders (admin only)
router.get("/", authMiddleware, orderController.getAllOrders);

// Protected - Get sales statistics (admin only)
router.get("/stats", authMiddleware, orderController.getSalesStats);

// Protected - Get order by ID
router.get("/:id", authMiddleware, orderController.getOrderById);

// Protected - Get orders by user ID
router.get("/user/:userId", authMiddleware, orderController.getOrdersByUser);

// Protected - Update order status
router.put("/:id/status", authMiddleware, orderController.updateOrderStatus);

// Protected - Update payment status
router.put("/:id/payment", authMiddleware, orderController.updatePaymentStatus);

// Protected - Delete order
router.delete("/:id", authMiddleware, orderController.deleteOrder);

// Protected - Generate delivery OTP (admin only)
router.post("/:id/generate-otp", authMiddleware, orderController.generateDeliveryOTP);

// Protected - Verify delivery OTP (user or admin)
router.post("/:id/verify-otp", authMiddleware, orderController.verifyDeliveryOTP);

// Protected - Resend delivery OTP (admin only)
router.post("/:id/resend-otp", authMiddleware, orderController.resendDeliveryOTP);

// Protected - Submit feedback for completed order
router.post("/:id/feedback", authMiddleware, orderController.submitFeedback);

module.exports = router;
