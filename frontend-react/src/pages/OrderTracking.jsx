


import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./OrderTracking.css";

function OrderTracking() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState(null);
  const [otpInput, setOtpInput] = useState("");
  const [otpError, setOtpError] = useState("");
  const [otpSuccess, setOtpSuccess] = useState("");
  const [verifying, setVerifying] = useState(false);

  // Cancel button state
  const [canCancel, setCanCancel] = useState(false);
  const [cancelCountdown, setCancelCountdown] = useState(40);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [cancelError, setCancelError] = useState("");
  const [cancelSuccess, setCancelSuccess] = useState(false);

  // Feedback state
  const [feedbackRating, setFeedbackRating] = useState(0);
  const [feedbackComment, setFeedbackComment] = useState("");
  const [submittingFeedback, setSubmittingFeedback] = useState(false);
  const [feedbackError, setFeedbackError] = useState("");
  const [feedbackSuccess, setFeedbackSuccess] = useState(false);

  // Check if order can be cancelled (within 40 seconds and status is pending)
  useEffect(() => {
    if (order && order.status === "pending") {
      const orderTime = new Date(order.createdAt).getTime();
      const currentTime = Date.now();
      const timeElapsed = Math.floor((currentTime - orderTime) / 1000);
      const timeLeft = 40 - timeElapsed;
      
      if (timeLeft > 0) {
        setCanCancel(true);
        setCancelCountdown(timeLeft);
      } else {
        setCanCancel(false);
      }
    } else {
      setCanCancel(false);
    }
  }, [order, lastUpdated]);

  // Countdown timer for cancel button
  useEffect(() => {
    if (canCancel && cancelCountdown > 0) {
      const timer = setInterval(() => {
        setCancelCountdown((prev) => {
          if (prev <= 1) {
            setCanCancel(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [canCancel, cancelCountdown]);

  const handleCancelOrder = async () => {
    setCancelling(true);
    setCancelError("");
    
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `http://localhost:5000/api/orders/${orderId}/status`,
        { status: "cancelled" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCancelSuccess(true);
      setOrder(response.data.order);
      setCanCancel(false);
    } catch (err) {
      setCancelError(err.response?.data?.message || "Failed to cancel order");
    } finally {
      setCancelling(false);
      setShowCancelConfirm(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setOtpError("");
    setOtpSuccess("");
    setVerifying(true);

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `http://localhost:5000/api/orders/${orderId}/verify-otp`,
        { otp: otpInput },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setOtpSuccess(response.data.message);
      setOrder(response.data.order);
    } catch (err) {
      setOtpError(err.response?.data?.message || "Failed to verify OTP");
    } finally {
      setVerifying(false);
    }
  };

  const handleSubmitFeedback = async (e) => {
    e.preventDefault();
    setFeedbackError("");
    setFeedbackSuccess(false);

    if (feedbackRating === 0) {
      setFeedbackError("Please select a rating");
      return;
    }

    setSubmittingFeedback(true);

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `http://localhost:5000/api/orders/${orderId}/feedback`,
        { rating: feedbackRating, comment: feedbackComment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setFeedbackSuccess(response.data.message);
      fetchOrder(); // Refresh order to show updated feedback
    } catch (err) {
      setFeedbackError(err.response?.data?.message || "Failed to submit feedback");
    } finally {
      setSubmittingFeedback(false);
    }
  };

  const fetchOrder = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:5000/api/orders/${orderId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setOrder(response.data);
      setLastUpdated(new Date());
      setError("");
    } catch (err) {
      console.error("Error fetching order:", err);
      setError("Failed to load order details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch order initially and set up polling for real-time updates
  useEffect(() => {
    fetchOrder();

    // Poll every 5 seconds for real-time updates
    const interval = setInterval(() => {
      fetchOrder();
    }, 5000);

    // Cleanup interval on unmount
    return () => clearInterval(interval);
  }, [orderId]);

  // Get status step (0-3 for progress bar)
  const getStatusStep = (status) => {
    switch (status) {
      case "pending":
        return 0;
      case "cooking":
        return 1;
      case "ready":
        return 2;
      case "completed":
        return 3;
      case "cancelled":
        return -1;
      default:
        return 0;
    }
  };

  const statusStep = order ? getStatusStep(order.status) : 0;

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  if (loading) {
    return (
      <div className="tracking-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="tracking-container">
        <div className="error-message">
          <h2>⚠️ Error</h2>
          <p>{error}</p>
          <button onClick={() => navigate("/")} className="back-btn">
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="tracking-container">
        <div className="error-message">
          <h2>Order Not Found</h2>
          <p>We couldn't find this order.</p>
          <button onClick={() => navigate("/")} className="back-btn">
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="tracking-container">
      <div className="tracking-card">
        <div className="tracking-header">
          <h1>📦 Order Tracking</h1>
          <button onClick={() => navigate("/")} className="back-btn">
            ← Back to Home
          </button>
        </div>

        <div className="order-id-section">
          <span className="order-id-label">Order ID:</span>
          <span className="order-id-value">{order.orderId}</span>
          {lastUpdated && (
            <span className="last-updated">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </span>
          )}
        </div>

        {/* Status Progress Bar */}
        <div className="status-progress">
          <div className={`progress-step ${statusStep >= 0 ? "active" : ""} ${statusStep > 0 ? "completed" : ""}`}>
            <div className="step-circle">1</div>
            <span className="step-label">Order Placed</span>
          </div>
          <div className={`progress-line ${statusStep > 0 ? "active" : ""}`}></div>
          <div className={`progress-step ${statusStep >= 1 ? "active" : ""} ${statusStep > 1 ? "completed" : ""}`}>
            <div className="step-circle">2</div>
            <span className="step-label">Cooking</span>
          </div>
          <div className={`progress-line ${statusStep > 1 ? "active" : ""}`}></div>
          <div className={`progress-step ${statusStep >= 2 ? "active" : ""} ${statusStep > 2 ? "completed" : ""}`}>
            <div className="step-circle">3</div>
            <span className="step-label">Ready</span>
          </div>
          <div className={`progress-line ${statusStep > 2 ? "active" : ""}`}></div>
          <div className={`progress-step ${statusStep >= 3 ? "active" : ""}`}>
            <div className="step-circle">4</div>
            <span className="step-label">Completed</span>
          </div>
        </div>

        {/* Current Status */}
        <div className="current-status">
          <div className={`status-badge ${order.status}`}>
            {order.status === "pending" && "⏳"}
            {order.status === "cooking" && "👨‍🍳"}
            {order.status === "ready" && "✅"}
            {order.status === "completed" && "🎉"}
            {order.status === "cancelled" && "❌"}
            <span>Status: {order.status.toUpperCase()}</span>
          </div>
          <p className="status-message">
            {order.status === "pending" && "Your order has been received and is waiting to be prepared."}
            {order.status === "cooking" && "Your food is being prepared with care!"}
            {order.status === "ready" && "Your food is ready! Please collect it at the counter."}
            {order.status === "completed" && "Thank you for your order. Enjoy your meal!"}
            {order.status === "cancelled" && "This order has been cancelled."}
          </p>
        </div>

        {/* Cancel Button Section */}
        {canCancel && order.status === "pending" && (
          <div className="cancel-section">
            <div className="cancel-timer">
              <span className="timer-icon">⏱️</span>
              <span>Cancelling available for: <strong>{cancelCountdown}s</strong></span>
            </div>
            {!showCancelConfirm ? (
              <button 
                onClick={() => setShowCancelConfirm(true)} 
                className="cancel-order-btn"
              >
                ❌ Cancel Order
              </button>
            ) : (
              <div className="cancel-confirm">
                <p>Are you sure you want to cancel this order?</p>
                <div className="confirm-buttons">
                  <button 
                    onClick={handleCancelOrder} 
                    className="confirm-yes-btn"
                    disabled={cancelling}
                  >
                    {cancelling ? "Cancelling..." : "Yes, Cancel"}
                  </button>
                  <button 
                    onClick={() => setShowCancelConfirm(false)} 
                    className="confirm-no-btn"
                    disabled={cancelling}
                  >
                    No, Keep Order
                  </button>
                </div>
              </div>
            )}
            {cancelError && <p className="cancel-error">{cancelError}</p>}
            {cancelSuccess && <p className="cancel-success">✅ Order cancelled successfully!</p>}
          </div>
        )}

        {/* Order Details */}
        <div className="order-details">
          <h2>Order Details</h2>
          <div className="details-grid">
            <div className="detail-item">
              <span className="detail-label">Order Date:</span>
              <span className="detail-value">{formatDate(order.createdAt)}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Payment Method:</span>
              <span className="detail-value">
                {order.paymentMethod === "phonepe" ? "📱 PhonePe" : "💵 Cash on Delivery"}
              </span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Payment Status:</span>
              <span className={`detail-value payment-status ${order.paymentStatus}`}>
                {order.paymentStatus === "paid" && "✅ Paid"}
                {order.paymentStatus === "pending" && "⏳ Pending"}
                {order.paymentStatus === "failed" && "❌ Failed"}
              </span>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="order-items">
          <h2>Items Ordered</h2>
          <div className="items-list">
            {order.items.map((item, index) => (
              <div key={index} className="item-row">
                <img src={`/${item.image}`} alt={item.name} className="item-image" />
                <div className="item-info">
                  <span className="item-name">{item.name}</span>
                  <span className="item-qty">x{item.quantity}</span>
                </div>
                <span className="item-price">₹{item.price * item.quantity}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="order-summary">
          <div className="summary-row">
            <span>Subtotal:</span>
            <span>₹{order.totalAmount}</span>
          </div>
          {order.discount > 0 && (
            <div className="summary-row discount">
              <span>Discount:</span>
              <span>-₹{order.discount}</span>
            </div>
          )}
          <div className="summary-row final">
            <span>Total:</span>
            <span>₹{order.finalAmount}</span>
          </div>
        </div>

        {/* Feedback Section */}
        {order.status === "completed" && !order.feedbackSubmittedAt && (
          <div className="feedback-section">
            <h2>📝 Share Your Feedback</h2>
            <p>We'd love to hear about your experience! Your feedback helps us improve.</p>

            <form onSubmit={handleSubmitFeedback} className="feedback-form">
              <div className="rating-section">
                <label>Rate your experience:</label>
                <div className="rating-stars">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      className={`star ${feedbackRating >= star ? 'active' : ''}`}
                      onClick={() => setFeedbackRating(star)}
                    >
                      ⭐
                    </button>
                  ))}
                </div>
                {feedbackRating > 0 && (
                  <span className="rating-text">
                    {feedbackRating === 1 && "Poor"}
                    {feedbackRating === 2 && "Fair"}
                    {feedbackRating === 3 && "Good"}
                    {feedbackRating === 4 && "Very Good"}
                    {feedbackRating === 5 && "Excellent"}
                  </span>
                )}
              </div>

              <div className="comment-section">
                <label htmlFor="feedback-comment">Comments (optional):</label>
                <textarea
                  id="feedback-comment"
                  value={feedbackComment}
                  onChange={(e) => setFeedbackComment(e.target.value)}
                  placeholder="Tell us about your experience..."
                  rows="3"
                  maxLength="500"
                />
                <span className="char-count">{feedbackComment.length}/500</span>
              </div>

              {feedbackError && <p className="feedback-error">{feedbackError}</p>}
              {feedbackSuccess && <p className="feedback-success">{feedbackSuccess}</p>}

              <button
                type="submit"
                className="submit-feedback-btn"
                disabled={feedbackRating === 0 || submittingFeedback}
              >
                {submittingFeedback ? "Submitting..." : "Submit Feedback"}
              </button>
            </form>
          </div>
        )}

        {/* Feedback Display */}
        {order.feedbackSubmittedAt && (
          <div className="feedback-display">
            <h2>✅ Your Feedback</h2>
            <div className="feedback-content">
              <div className="feedback-rating">
                <span>Rating: </span>
                <div className="rating-stars">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span key={star} className={`star ${order.feedbackRating >= star ? 'active' : ''}`}>
                      ⭐
                    </span>
                  ))}
                </div>
                <span className="rating-text">
                  ({order.feedbackRating}/5)
                </span>
              </div>
              {order.feedbackComment && (
                <div className="feedback-comment">
                  <span>Comment: </span>
                  <p>{order.feedbackComment}</p>
                </div>
              )}
              <div className="feedback-date">
                <span>Submitted on: {formatDate(order.feedbackSubmittedAt)}</span>
              </div>
            </div>
          </div>
        )}

        {/* Auto-refresh indicator */}
        <div className="auto-refresh">
          <span className="refresh-icon">🔄</span>
          <span>Auto-refreshing every 5 seconds</span>
        </div>
      </div>
    </div>
  );
}

export default OrderTracking;
