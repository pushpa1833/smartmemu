import { useContext, useState, useEffect } from "react";
import { CartContext } from "../context/Cartcontext";
import { UserContext } from "../context/Usercontext";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "./Cart.css";

function Cart() {
  const { cart, increaseQty, decreaseQty, removeFromCart, getTotal, clearCart } = useContext(CartContext);
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();
  
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState("");
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("cash_on_delivery");
  const [orderDetails, setOrderDetails] = useState(null);

  const coupons = {
    "SAVE10": { discount: 10, description: "10% off" },
    "SAVE20": { discount: 20, description: "20% off" },
    "FLAT50": { discount: 50, description: "₹50 off" },
    "FIRST100": { discount: 100, description: "₹100 off for first order" },
  };

  const totalAmount = getTotal();

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setCurrentUser(parsedUser);
        setUser(parsedUser);
      } catch (e) {
        console.error("Error parsing user data:", e);
      }
    }
  }, [setUser]);

  const handleApplyCoupon = () => {
    setCouponError("");
    const coupon = coupons[couponCode.toUpperCase()];
    
    if (coupon) {
      if (coupon.discount > totalAmount) {
        setCouponError("Discount cannot exceed total amount");
        return;
      }
      setAppliedCoupon({ code: couponCode.toUpperCase(), ...coupon });
    } else {
      setCouponError("Invalid coupon code");
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
    setCouponError("");
  };

  const calculateDiscount = () => {
    if (!appliedCoupon) return 0;
    if (appliedCoupon.discount > 50) {
      return appliedCoupon.discount;
    }
    return (totalAmount * appliedCoupon.discount) / 100;
  };

  const discount = calculateDiscount();
  const finalAmount = totalAmount - discount;

  const handlePlaceOrder = async () => {
    try {
      const token = localStorage.getItem("token");
      console.log("Token found:", token ? "Yes" : "No");
      
      if (!token) {
        alert("Please login to place an order");
        navigate("/login");
        return;
      }

      // Check if cart is empty
      if (!cart || cart.length === 0) {
        alert("Your cart is empty! Please add items before placing an order.");
        return;
      }
      
      const orderData = {
        items: cart.map(item => ({
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image
        })),
        totalAmount: totalAmount,
        discount: discount,
        finalAmount: finalAmount,
        couponApplied: appliedCoupon ? appliedCoupon.code : null,
        paymentStatus: "pending",
        paymentMethod: paymentMethod
      };
      
      console.log("Sending order data:", orderData);
      console.log("Cart items count:", cart.length);
      console.log("Final amount:", finalAmount);
      
      const response = await axios.post("http://localhost:5000/api/orders", orderData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        timeout: 15000 // 15 second timeout
      });
      
      console.log("Order placed successfully:", response.data);
      setOrderDetails(response.data.order);
      setOrderPlaced(true);
      clearCart(); // Clear the cart after successful order
    } catch (err) {
      console.error("Error placing order:", err);
      console.error("Error response:", err.response?.data);
      console.error("Error code:", err.code);
      console.error("Error message:", err.message);
      
      let errorMessage;
      
      // Handle different types of errors
      if (err.code === "ECONNABORTED") {
        errorMessage = "Request timed out. Please check your connection and try again.";
      } else if (err.code === "ERR_NETWORK" || err.message === "Network Error") {
        // First, check if backend is running
        try {
          const healthCheck = await axios.get("http://localhost:5000/api/health", { timeout: 5000 });
          if (healthCheck.data.mongodb !== "connected") {
            errorMessage = "Database connection issue. Please contact support.";
          } else {
            errorMessage = "Cannot connect to server. Please ensure the backend is running.";
          }
        } catch (healthErr) {
          errorMessage = "Cannot connect to server. Please ensure the backend is running on port 5000.";
        }
      } else if (err.response) {
        // Server responded with error
        errorMessage = err.response.data?.message || "Server error occurred. Please try again.";
      } else if (err.request) {
        // Request made but no response
        errorMessage = "No response from server. Please check your internet connection.";
      } else {
        errorMessage = err.message || "Failed to place order. Please try again.";
      }
      
      alert("Order Failed: " + errorMessage);
    }
  };

  if (orderPlaced && orderDetails) {
    return (
      <div className="cart-container">
        <div className="order-success">
          <h1>🎉 Order Placed Successfully!</h1>
          <div className="order-details-card">
            <div className="order-id">
              <span className="label">Order ID:</span>
              <span className="value">{orderDetails.orderId}</span>
            </div>
            <div className="order-info">
              <p><strong>Thank you for your order!</strong></p>
              <p>Your food is being prepared and will be ready soon.</p>
            </div>
            <div className="order-summary">
              <div className="summary-row">
                <span>Items:</span>
                <span>{orderDetails.items.length}</span>
              </div>
              <div className="summary-row">
                <span>Total Amount:</span>
                <span>₹{orderDetails.totalAmount}</span>
              </div>
              {orderDetails.discount > 0 && (
                <div className="summary-row discount">
                  <span>Discount:</span>
                  <span>-₹{orderDetails.discount}</span>
                </div>
              )}
              <div className="summary-row final">
                <span>Final Amount:</span>
                <span>₹{orderDetails.finalAmount}</span>
              </div>
              <div className="summary-row">
                <span>Payment Method:</span>
                <span>{orderDetails.paymentMethod === "phonepe" ? "📱 PhonePe" : "💵 Cash on Delivery"}</span>
              </div>
            </div>
            <div className="order-status">
              <span className="status-badge pending">Status: {orderDetails.status.toUpperCase()}</span>
            </div>
            <div className="order-actions">
              <Link to={`/order-tracking/${orderDetails._id}`} className="track-order-btn">
                📍 Track Your Order
              </Link>
              <button onClick={() => { setOrderPlaced(false); navigate("/"); }} className="continue-btn">
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Use currentUser if available, otherwise use user from context
  const displayUser = currentUser || user;

  return (
    <div className="cart-container">
      <h1>🛒 Your Cart</h1>

      {cart.length === 0 ? (
        <p className="empty-cart">Your cart is empty</p>
      ) : (
        <>
          {cart.map((item, index) => (
            <div className="cart-item" key={index}>
              <img src={`/${item.image}`} alt={item.name} />

              <div className="cart-details">
                <h3>{item.name}</h3>
                <p>₹{item.price}</p>

                <div className="qty-controls">
                  <button onClick={() => decreaseQty(item.name)}>-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => increaseQty(item.name)}>+</button>
                </div>
              </div>

              <div className="item-total">
                ₹{item.price * item.quantity}
              </div>
              
              <button 
                className="remove-btn" 
                onClick={() => removeFromCart(item.name)}
                title="Remove item"
              >
                ✕
              </button>
            </div>
          ))}

          {/* Payment Method Section */}
          <div className="payment-method-section">
            <h3>💳 Payment Method</h3>
            <div className="payment-options">
              <label className={`payment-option ${paymentMethod === "phonepe" ? "selected" : ""}`}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="phonepe"
                  checked={paymentMethod === "phonepe"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <span className="payment-icon">📱</span>
                <span className="payment-label">PhonePe</span>
              </label>
              <label className={`payment-option ${paymentMethod === "cash_on_delivery" ? "selected" : ""}`}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cash_on_delivery"
                  checked={paymentMethod === "cash_on_delivery"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <span className="payment-icon">💵</span>
                <span className="payment-label">Cash on Delivery</span>
              </label>
            </div>
          </div>

          <div className="coupon-section">
            <h3>🎫 Apply Coupon / Offers</h3>
            
            {appliedCoupon ? (
              <div className="applied-coupon">
                <span className="coupon-badge">
                  {appliedCoupon.code} - {appliedCoupon.description}
                </span>
                <button className="remove-coupon-btn" onClick={handleRemoveCoupon}>
                  Remove
                </button>
              </div>
            ) : (
              <div className="coupon-input-group">
                <input
                  type="text"
                  placeholder="Enter coupon code"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="coupon-input"
                />
                <button className="apply-coupon-btn" onClick={handleApplyCoupon}>
                  Apply
                </button>
              </div>
            )}
            
            {couponError && <p className="coupon-error">{couponError}</p>}
            
            <div className="available-coupons">
              <p>Available coupons:</p>
              <div className="coupon-tags">
                {Object.keys(coupons).map((code) => (
                  <span
                    key={code}
                    className="coupon-tag"
                    onClick={() => {
                      setCouponCode(code);
                      setCouponError("");
                    }}
                  >
                    {code} - {coupons[code].description}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="cart-summary">
            <div className="bill-details">
              <h2>Total Bill</h2>
              <div className="bill-row">
                <span>Subtotal:</span>
                <span>₹{totalAmount}</span>
              </div>
              
              {appliedCoupon && (
                <div className="bill-row discount-row">
                  <span>Discount ({appliedCoupon.code}):</span>
                  <span>-₹{discount}</span>
                </div>
              )}
              
              <div className="bill-row final-total">
                <span>Final Amount:</span>
                <span>₹{finalAmount}</span>
              </div>
              
              <div className="bill-row payment-method-row">
                <span>Payment Method:</span>
                <span className="payment-method-display">
                  {paymentMethod === "phonepe" ? "📱 PhonePe" : "💵 Cash on Delivery"}
                </span>
              </div>
            </div>
            
            <button className="checkout-btn" onClick={handlePlaceOrder}>
              {displayUser ? "Place Order" : "Login to Place Order"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default Cart;
