const mongoose = require("mongoose");
const Order = require("./models/order");
const User = require("./models/user");
const jwt = require("jsonwebtoken");
require("dotenv").config();

async function testOrder() {
  try {
    await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/govindhacanteen");
    console.log("Connected to MongoDB");

    // Find admin user
    const user = await User.findOne({ email: "puspha480@gmail.com" });
    if (!user) {
      console.log("User not found");
      process.exit(1);
    }
    console.log("User found:", user.username, user._id);

    // Create token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || "secretkey");
    console.log("Token created");

    // Try to create order
    const orderData = {
      items: [{ name: "Test Biryani", price: 150, quantity: 2, image: "biryani.jpg" }],
      totalAmount: 300,
      discount: 0,
      finalAmount: 300,
      couponApplied: null,
      paymentStatus: "pending",
      paymentMethod: "cash_on_delivery"
    };

    console.log("Creating order with data:", JSON.stringify(orderData, null, 2));

    // Use supertest-like approach with http
    const http = require('http');

    const postData = JSON.stringify(orderData);

    const options = {
      hostname: 'localhost',
      port: 5000,
      path: '/api/orders',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        console.log("Response status:", res.statusCode);
        console.log("Response body:", data);
        
        if (res.statusCode === 201) {
          const order = JSON.parse(data);
          console.log("Order created successfully! Order ID:", order.order?._id || order.order?.orderId);
        }
        process.exit(0);
      });
    });

    req.on('error', (e) => {
      console.error("Request error:", e.message);
      process.exit(1);
    });

    req.write(postData);
    req.end();

  } catch (err) {
    console.error("Error:", err.message);
    process.exit(1);
  }
}

testOrder();
