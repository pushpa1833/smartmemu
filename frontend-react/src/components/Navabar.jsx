import { Link, useNavigate } from "react-router-dom";
import { useContext, useState, useRef, useEffect } from "react";
import { UserContext } from "../context/Usercontext";
import "./Navabar.css";

function Navbar({ setSearch }) {
  const navigate = useNavigate();
  const { user, setUser } = useContext(UserContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef();

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (e) {
        console.error("Error parsing user data:", e);
      }
    }
  }, [setUser]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  // Check if user is admin
  const isAdmin = user?.role === "admin";

  return (
    <nav className="navbar">
      <span className="logo">🍽️</span>
      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/menu">Menu</Link>
        <Link to="/cart">Cart</Link>
        {isAdmin && <Link to="/admin" className="admin-link">Admin</Link>}
      </div>

      <input
        type="text"
        placeholder="Search food..."
        className="search-input"
        onChange={(e) => setSearch(e.target.value)}
      />

      {user ? (
        <Link to="/profile" className="login-btn">Profile</Link>
      ) : (
        <Link to="/login" className="login-btn">Login</Link>
      )}
    </nav>
  );
}

export default Navbar;
