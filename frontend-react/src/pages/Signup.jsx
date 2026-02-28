import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import "./Signup.css";
import { signup } from "../api/axios";

function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    adminSecret: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      console.log("Attempting signup with:", { username: formData.username, email: formData.email });
      const response = await signup({
        username: formData.username,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        adminSecret: formData.adminSecret,
      });
      console.log("Signup successful:", response.data);
      alert("Signup successful! Please login.");
      navigate("/login");
    } catch (err) {
      console.error("Signup error:", err);
      
      if (err.response) {
        setError(err.response.data?.message || "Signup failed. Please try again.");
      } else if (err.request) {
        setError("Cannot connect to server. Please make sure the backend is running on port 5000.");
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-box">
        <form onSubmit={handleSubmit}>
          <h3>Sign Up</h3>
          <p className="subtitle">Join Govindha Canteen</p>

          {error && <p className="error-message">{error}</p>}

          <label>Username:</label>
          <input 
            type="text" 
            id="username" 
            name="username" 
            value={formData.username} 
            onChange={handleChange} 
            required 
            placeholder="Enter your username"
          />

          <label>Email:</label>
          <input 
            type="email" 
            id="email" 
            name="email" 
            value={formData.email} 
            onChange={handleChange} 
            required 
            placeholder="Enter your email"
          />

          <label>Phone Number:</label>
          <input 
            type="tel" 
            id="phone" 
            name="phone" 
            value={formData.phone} 
            onChange={handleChange} 
            placeholder="Enter your phone number"
          />

          <label>Password:</label>
          <input 
            type="password" 
            id="password" 
            name="password" 
            value={formData.password} 
            onChange={handleChange} 
            required 
            placeholder="Enter your password"
          />

          <label>Confirm Password:</label>
          <input 
            type="password" 
            id="confirm-password" 
            name="confirmPassword" 
            value={formData.confirmPassword} 
            onChange={handleChange} 
            required 
            placeholder="Confirm your password"
          />

          <label>Admin Secret (Optional):</label>
          <input 
            type="password" 
            id="admin-secret" 
            name="adminSecret" 
            value={formData.adminSecret} 
            onChange={handleChange} 
            placeholder="Enter admin secret for admin account"
          />

          <button type="submit" id="button" disabled={loading}>
            {loading ? "Signing up..." : "Sign Up"}
          </button>

          <p>
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Signup;
