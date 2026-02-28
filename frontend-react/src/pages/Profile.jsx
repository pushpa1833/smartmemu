import { useState, useEffect, useContext } from "react";
import { UserContext } from "../context/Usercontext";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";
import "./Profile.css";

function Profile() {
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("profile");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    username: "",
    phone: ""
  });
  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateMessage, setUpdateMessage] = useState("");

  useEffect(() => {
    if (user && activeTab === "orders") {
      fetchOrders();
    }
  }, [activeTab, user]);

  useEffect(() => {
    if (user) {
      setEditForm({
        username: user.username || "",
        phone: user.phone || ""
      });
    }
  }, [user]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get("/orders", {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Filter orders for current user
      const userOrders = response.data.filter(order => order.userId === user._id || order.username === user.username);
      setOrders(userOrders.reverse()); // Most recent first
    } catch (err) {
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  const handleEditClick = () => {
    setEditForm({
      username: user?.username || "",
      phone: user?.phone || ""
    });
    setIsEditing(true);
    setUpdateMessage("");
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setUpdateMessage("");
  };

  const handleSaveProfile = async () => {
    try {
      setUpdateLoading(true);
      setUpdateMessage("");
      const token = localStorage.getItem("token");
      const response = await axios.put("/profile", editForm, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Update localStorage and context
      const updatedUser = { ...user, ...response.data.user };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);
      
      setUpdateMessage("Profile updated successfully!");
      setIsEditing(false);
    } catch (err) {
      console.error("Error updating profile:", err);
      setUpdateMessage(err.response?.data?.message || "Failed to update profile");
    } finally {
      setUpdateLoading(false);
    }
  };

  const getStatusColor = (status) => {
    return status || "pending";
  };

  const getPaymentStatusColor = (status) => {
    return status || "pending";
  };

  if (!user) {
    return (
      <div className="profile-container">
        <div className="login-required">
          <h2>🔐 Login Required</h2>
          <p>Please login to view your profile and orders.</p>
          <button className="login-btn" onClick={() => navigate("/login")}>
            Login Now
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      {/* Profile Header */}
      <div className="profile-header">
        <div className="profile-header-content">
          {user.avatar ? (
            <img src={user.avatar} alt="profile" className="profile-avatar-large" />
          ) : (
            <div className="profile-avatar-large-placeholder">
              {user.username ? user.username.charAt(0).toUpperCase() : "U"}
            </div>
          )}
          <div className="profile-info">
            <h2>{user.username || user.name || "User"}</h2>
            <p className="email">📧 {user.email}</p>
            {user.phone && <p className="phone">📱 {user.phone}</p>}
            <span className="profile-badge">{user.role || "User"}</span>
          </div>
        </div>

        {/* Tabs */}
        <div className="profile-tabs">
          <button 
            className={`profile-tab-btn ${activeTab === "profile" ? "active" : ""}`}
            onClick={() => setActiveTab("profile")}
          >
            👤 Profile
          </button>
          <button 
            className={`profile-tab-btn ${activeTab === "orders" ? "active" : ""}`}
            onClick={() => setActiveTab("orders")}
          >
            📦 Orders
          </button>
        </div>
      </div>

      {/* Profile Content */}
      <div className="profile-content">
        {activeTab === "profile" && (
          <>
            <h3 className="profile-section-title">👤 My Details</h3>
            
            {updateMessage && (
              <div className={`update-message ${updateMessage.includes("success") ? "success" : "error"}`}>
                {updateMessage}
              </div>
            )}

            {isEditing ? (
              <div className="edit-form">
                <div className="form-group">
                  <label>Username</label>
                  <input
                    type="text"
                    value={editForm.username}
                    onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
                    placeholder="Enter your username"
                  />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    value={user.email}
                    disabled
                    className="disabled-input"
                  />
                  <small>Email cannot be changed</small>
                </div>
                <div className="form-group">
                  <label>Phone Number</label>
                  <input
                    type="tel"
                    value={editForm.phone}
                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                    placeholder="Enter your phone number"
                  />
                </div>
                <div className="edit-form-buttons">
                  <button 
                    className="action-btn primary" 
                    onClick={handleSaveProfile}
                    disabled={updateLoading}
                  >
                    {updateLoading ? "Saving..." : "Save Changes"}
                  </button>
                  <button 
                    className="action-btn secondary" 
                    onClick={handleCancelEdit}
                    disabled={updateLoading}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="info-grid">
                <div className="info-card">
                  <label>Username</label>
                  <span>{user.username || "Not set"}</span>
                </div>
                <div className="info-card">
                  <label>Email</label>
                  <span>{user.email}</span>
                </div>
                <div className="info-card">
                  <label>Phone</label>
                  <span>{user.phone || "Not set"}</span>
                </div>
                <div className="info-card">
                  <label>Account Type</label>
                  <span>{user.role || "User"}</span>
                </div>
              </div>
            )}

            <div className="account-actions">
              {!isEditing && (
                <button className="action-btn primary" onClick={handleEditClick}>
                  ✏️ Edit Profile
                </button>
              )}
              <button className="action-btn danger" onClick={handleLogout}>
                🚪 Logout
              </button>
            </div>
          </>
        )}

        {activeTab === "orders" && (
          <>
            <h3 className="profile-section-title">📦 Order History</h3>
            {loading ? (
              <div className="profile-loading">Loading orders...</div>
            ) : orders.length === 0 ? (
              <div className="no-data">
                <div className="no-data-icon">🛒</div>
                <p>No orders yet. Start ordering from our menu!</p>
                <button 
                  className="action-btn primary" 
                  style={{ margin: "20px auto 0", display: "block" }}
                  onClick={() => navigate("/menu")}
                >
                  Browse Menu
                </button>
              </div>
            ) : (
              <div className="orders-list">
                {orders.map((order) => (
                  <div key={order._id} className="order-item">
                    <div className="order-item-header">
                      <span className="order-id">#{order.orderId || order._id.slice(-8)}</span>
                      <span className="order-date">
                        {new Date(order.createdAt).toLocaleString()}
                      </span>
                      <span className={`order-status-badge ${getStatusColor(order.status)}`}>
                        {order.status || "pending"}
                      </span>
                    </div>
                    <div className="order-item-details">
                      <div className="order-items-list">
                        {order.items && order.items.map((item, idx) => (
                          <span key={idx} className="order-item-tag">
                            {item.name} x{item.quantity}
                          </span>
                        ))}
                      </div>
                      <div className="order-payment-info">
                        <span className={`payment-status ${getPaymentStatusColor(order.paymentStatus)}`}>
                          {order.paymentStatus || "pending"}
                        </span>
                        <span className="payment-method">
                          {order.paymentMethod === "phonepe" ? "📱 PhonePe" : "💵 COD"}
                        </span>
                      </div>
                    </div>
                    <div className="order-total">
                      <span className="order-total-label">Total Amount</span>
                      <span className="order-total-amount">
                        ₹{order.finalAmount || order.totalAmount || 0}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Profile;
