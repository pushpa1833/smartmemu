
import { useState, useEffect, useContext } from "react";
import axios from "../api/axios";
import { UserContext } from "../context/Usercontext";
import { useNavigate } from "react-router-dom";
import "./AdminDashboard.css";

function AdminDashboard() {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("orders");
  const [orders, setOrders] = useState([]);
  const [foods, setFoods] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Add food form state
  const [showAddForm, setShowAddForm] = useState(false);
  const [newFood, setNewFood] = useState({
    name: "",
    price: "",
    image: "",
    description: ""
  });
  const [addingFood, setAddingFood] = useState(false);

  // Check if user is admin
  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/");
      return;
    }
    fetchData();
  }, [user]);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };

      if (activeTab === "orders") {
        const ordersRes = await axios.get("/orders", config);
        setOrders(ordersRes.data);
      } else if (activeTab === "menu") {
        const foodRes = await axios.get("/food", config);
        setFoods(foodRes.data);
      } else if (activeTab === "sales") {
        const statsRes = await axios.get("/orders/stats?period=month", config);
        setStats(statsRes.data);
      }
      setLoading(false);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to fetch data");
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && user.role === "admin") {
      fetchData();
    }
  }, [activeTab, user]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(`/orders/${orderId}/status`, { status: newStatus }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // If changing to "ready", generate OTP automatically
      if (newStatus === "ready") {
        try {
          const otpRes = await axios.post(`/orders/${orderId}/generate-otp`, {}, {
            headers: { Authorization: `Bearer ${token}` }
          });
          alert(`OTP Generated for this order: ${otpRes.data.otp}`);
        } catch (otpErr) {
          console.error("Error generating OTP:", otpErr);
        }
      }
      
      fetchData();
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  const handleGenerateOTP = async (orderId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(`/orders/${orderId}/generate-otp`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert(`New OTP Generated: ${res.data.otp}`);
      fetchData();
    } catch (err) {
      console.error("Error generating OTP:", err);
      alert("Failed to generate OTP");
    }
  };

  const handlePaymentChange = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(`/orders/${orderId}/payment`, { paymentStatus: newStatus }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchData();
    } catch (err) {
      console.error("Error updating payment:", err);
    }
  };

  const handleAvailabilityChange = async (foodId, currentAvailability) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(`/food/${foodId}`, { availability: !currentAvailability }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchData();
    } catch (err) {
      console.error("Error updating availability:", err);
    }
  };

  const handleDeleteFood = async (foodId) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`/food/${foodId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchData();
    } catch (err) {
      console.error("Error deleting food:", err);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending": return "status-pending";
      case "cooking": return "status-cooking";
      case "ready": return "status-ready";
      case "completed": return "status-completed";
      case "cancelled": return "status-cancelled";
      default: return "";
    }
  };

  const getPaymentColor = (status) => {
    switch (status) {
      case "paid": return "payment-paid";
      case "pending": return "payment-pending";
      case "failed": return "payment-failed";
      default: return "";
    }
  };

  const handleAddFood = async (e) => {
    e.preventDefault();
    if (!newFood.name || !newFood.price) {
      alert("Please fill in name and price");
      return;
    }
    
    setAddingFood(true);
    try {
      const token = localStorage.getItem("token");
      await axios.post("/food", {
        name: newFood.name,
        price: parseFloat(newFood.price),
        image: newFood.image || "placeholder.png",
        description: newFood.description
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      alert("Food item added successfully!");
      setNewFood({ name: "", price: "", image: "", description: "" });
      setShowAddForm(false);
      fetchData();
    } catch (err) {
      console.error("Error adding food:", err);
      alert("Failed to add food item");
    } finally {
      setAddingFood(false);
    }
  };

  if (!user || user.role !== "admin") {
    return <div className="admin-container"><p>Access denied. Admin only.</p></div>;
  }

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>📊 Admin Dashboard</h1>
        <p>Welcome, {user.username}</p>
      </div>

      <div className="admin-tabs">
        <button 
          className={`tab-btn ${activeTab === "orders" ? "active" : ""}`}
          onClick={() => setActiveTab("orders")}
        >
          📋 Orders
        </button>
        <button 
          className={`tab-btn ${activeTab === "menu" ? "active" : ""}`}
          onClick={() => setActiveTab("menu")}
        >
          🍔 Menu Management
        </button>
        <button 
          className={`tab-btn ${activeTab === "sales" ? "active" : ""}`}
          onClick={() => setActiveTab("sales")}
        >
          💰 Sales Stats
        </button>
      </div>

      {loading ? (
        <div className="admin-loading">Loading...</div>
      ) : error ? (
        <div className="admin-error">{error}</div>
      ) : (
        <>
          {activeTab === "orders" && (
            <div className="orders-section">
              <h2>All Orders</h2>
              {orders.length === 0 ? (
                <p className="no-data">No orders found</p>
              ) : (
                <div className="orders-list">
                  {orders.map((order) => (
                    <div key={order._id} className="order-card">
                      <div className="order-header">
                        <span className="order-id">#{order.orderId}</span>
                        <span className="order-date">
                          {new Date(order.createdAt).toLocaleString()}
                        </span>
                      </div>
                      
                      <div className="order-customer">
                        <strong>Customer:</strong> {order.username}
                      </div>
                      
                      <div className="order-items">
                        {order.items.map((item, idx) => (
                          <span key={idx} className="item-tag">
                            {item.name} x{item.quantity}
                          </span>
                        ))}
                      </div>
                      
                      <div className="order-amount">
                        <strong>Total:</strong> ₹{order.finalAmount}
                        {order.discount > 0 && (
                          <span className="discount-tag">(-₹{order.discount})</span>
                        )}
                      </div>
                      
                      <div className="order-status-section">
                        <div className="status-group">
                          <label>Order Status:</label>
                          <select 
                            value={order.status}
                            onChange={(e) => handleStatusChange(order._id, e.target.value)}
                            className={`status-select ${getStatusColor(order.status)}`}
                          >
                            <option value="pending">Pending</option>
                            <option value="cooking">Cooking</option>
                            <option value="ready">Ready</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </div>
                        
                        <div className="status-group">
                          <label>Payment:</label>
                          <select 
                            value={order.paymentStatus}
                            onChange={(e) => handlePaymentChange(order._id, e.target.value)}
                            className={`status-select ${getPaymentColor(order.paymentStatus)}`}
                          >
                            <option value="paid">Paid</option>
                            <option value="pending">Pending</option>
                            <option value="failed">Failed</option>
                          </select>
                        </div>
                      </div>
                      
                      {/* OTP Section */}
                      {order.status === "ready" && !order.isOTPVerified && (
                        <div className="otp-section">
                          <div className="otp-info">
                            <span className="otp-label">Delivery OTP:</span>
                            <span className="otp-value">{order.deliveryOTP}</span>
                            <span className="otp-expires">
                              (Expires: {order.deliveryOTPExpires ? new Date(order.deliveryOTPExpires).toLocaleTimeString() : "N/A"})
                            </span>
                          </div>
                          <button 
                            className="otp-btn"
                            onClick={() => handleGenerateOTP(order._id)}
                          >
                            🔄 Resend OTP
                          </button>
                        </div>
                      )}
                      
                      {order.isOTPVerified && (
                        <div className="otp-verified">
                          ✅ OTP Verified - Order Completed
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "menu" && (
            <div className="menu-section">
              <div className="menu-header">
                <h2>Menu Management</h2>
                <button 
                  className="add-food-btn"
                  onClick={() => setShowAddForm(!showAddForm)}
                >
                  {showAddForm ? "✕ Cancel" : "+ Add New Item"}
                </button>
              </div>
              
              {showAddForm && (
                <div className="add-food-form">
                  <h3>Add New Food Item</h3>
                  <form onSubmit={handleAddFood}>
                    <div className="form-group">
                      <label>Item Name *</label>
                      <input 
                        type="text" 
                        value={newFood.name}
                        onChange={(e) => setNewFood({...newFood, name: e.target.value})}
                        placeholder="Enter item name"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Price (₹) *</label>
                      <input 
                        type="number" 
                        value={newFood.price}
                        onChange={(e) => setNewFood({...newFood, price: e.target.value})}
                        placeholder="Enter price"
                        min="0"
                        step="0.01"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Image URL</label>
                      <input 
                        type="text" 
                        value={newFood.image}
                        onChange={(e) => setNewFood({...newFood, image: e.target.value})}
                        placeholder="e.g., biriyani.jpeg"
                      />
                    </div>
                    <div className="form-group">
                      <label>Description</label>
                      <textarea 
                        value={newFood.description}
                        onChange={(e) => setNewFood({...newFood, description: e.target.value})}
                        placeholder="Enter item description"
                        rows="2"
                      />
                    </div>
                    <button 
                      type="submit" 
                      className="submit-food-btn"
                      disabled={addingFood}
                    >
                      {addingFood ? "Adding..." : "Add to Menu"}
                    </button>
                  </form>
                </div>
              )}
              
              {foods.length === 0 ? (
                <p className="no-data">No menu items found</p>
              ) : (
                <div className="menu-grid">
                  {foods.map((food) => (
                    <div key={food._id} className={`menu-item ${!food.availability ? "unavailable" : ""}`}>
                      <img src={`/${food.image}`} alt={food.name} className="menu-item-image" />
                      <div className="menu-item-info">
                        <h3>{food.name}</h3>
                        <p className="menu-item-desc">{food.description}</p>
                        <p className="menu-item-price">₹{food.price}</p>
                        <div className="menu-item-actions">
                          <button 
                            className={`availability-btn ${food.availability ? "available" : "unavailable"}`}
                            onClick={() => handleAvailabilityChange(food._id, food.availability)}
                          >
                            {food.availability ? "✓ Available" : "✗ Unavailable"}
                          </button>
                          <button 
                            className="delete-btn"
                            onClick={() => handleDeleteFood(food._id)}
                          >
                            🗑️ Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "sales" && stats && (
            <div className="sales-section">
              <h2>Sales Statistics</h2>
              
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-icon">🧾</div>
                  <div className="stat-value">{stats.totalOrders}</div>
                  <div className="stat-label">Total Orders</div>
                </div>
                
                <div className="stat-card highlight">
                  <div className="stat-icon">💵</div>
                  <div className="stat-value">₹{stats.totalRevenue}</div>
                  <div className="stat-label">Total Revenue</div>
                </div>
                
                <div className="stat-card">
                  <div className="stat-icon">🎟️</div>
                  <div className="stat-value">₹{stats.totalDiscount}</div>
                  <div className="stat-label">Total Discount</div>
                </div>
                
                <div className="stat-card">
                  <div className="stat-icon">✅</div>
                  <div className="stat-value">{stats.paidOrders}</div>
                  <div className="stat-label">Paid Orders</div>
                </div>
                
                <div className="stat-card">
                  <div className="stat-icon">⏳</div>
                  <div className="stat-value">{stats.pendingOrders}</div>
                  <div className="stat-label">Pending Payments</div>
                </div>
              </div>

              <div className="orders-status-section">
                <h3>Orders by Status</h3>
                <div className="status-bars">
                  <div className="status-bar-item">
                    <span>Pending</span>
                    <div className="bar-container">
                      <div 
                        className="bar pending" 
                        style={{width: `${(stats.ordersByStatus.pending / stats.totalOrders) * 100}%`}}
                      ></div>
                    </div>
                    <span>{stats.ordersByStatus.pending}</span>
                  </div>
                  <div className="status-bar-item">
                    <span>Cooking</span>
                    <div className="bar-container">
                      <div 
                        className="bar cooking" 
                        style={{width: `${(stats.ordersByStatus.cooking / stats.totalOrders) * 100}%`}}
                      ></div>
                    </div>
                    <span>{stats.ordersByStatus.cooking}</span>
                  </div>
                  <div className="status-bar-item">
                    <span>Ready</span>
                    <div className="bar-container">
                      <div 
                        className="bar ready" 
                        style={{width: `${(stats.ordersByStatus.ready / stats.totalOrders) * 100}%`}}
                      ></div>
                    </div>
                    <span>{stats.ordersByStatus.ready}</span>
                  </div>
                  <div className="status-bar-item">
                    <span>Completed</span>
                    <div className="bar-container">
                      <div 
                        className="bar completed" 
                        style={{width: `${(stats.ordersByStatus.completed / stats.totalOrders) * 100}%`}}
                      ></div>
                    </div>
                    <span>{stats.ordersByStatus.completed}</span>
                  </div>
                  <div className="status-bar-item">
                    <span>Cancelled</span>
                    <div className="bar-container">
                      <div 
                        className="bar cancelled" 
                        style={{width: `${(stats.ordersByStatus.cancelled / stats.totalOrders) * 100}%`}}
                      ></div>
                    </div>
                    <span>{stats.ordersByStatus.cancelled}</span>
                  </div>
                </div>
              </div>

              <div className="daily-sales-section">
                <h3>Daily Sales</h3>
                <div className="daily-sales-list">
                  {Object.entries(stats.dailySales).map(([date, data]) => (
                    <div key={date} className="daily-sale-item">
                      <span className="daily-date">{date}</span>
                      <span className="daily-orders">{data.orders} orders</span>
                      <span className="daily-revenue">₹{data.revenue}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default AdminDashboard;
