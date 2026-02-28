import "./Login.css";
import { Link, useNavigate } from "react-router-dom";
import { useState, useContext } from "react";
import { login } from "../api/axios";
import { UserContext } from "../context/Usercontext";

function Login() {
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
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
    setLoading(true);

    try {
      const response = await login(formData);

      localStorage.setItem("token", response.data.token);

      if (response.data.user) {
        const currentUser = response.data.user;
        localStorage.setItem("user", JSON.stringify(currentUser));
        setUser(currentUser);
      }

      alert("Login successful!");

      navigate("/profile");
    } catch (err) {
      console.error("Login error:", err);
      setError(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <form onSubmit={handleSubmit}>
          <h2>Login</h2>
          <p className="subtitle">Welcome back to Govindha Canteen</p>

          {error && <p className="error-message">{error}</p>}

          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="Enter your email"
          />

          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            placeholder="Enter your password"
          />

          <button type="submit" id="login-button" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>

          <p>Don't have an account?</p>
          <Link to="/signup">Sign Up</Link>
        </form>
      </div>
    </div>
  );
}

export default Login;
