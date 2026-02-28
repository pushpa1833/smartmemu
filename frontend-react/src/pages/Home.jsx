import { Link } from "react-router-dom";
import "./Home.css";

function Home() {
  return (
    <div className="home-container">
      <div className="hero-section">
        <div className="hero-content">
          <h1>Welcome to  Canteen</h1>
          <p className="hero-subtitle">IT College Canteen - Delicious Food at Your Fingertips</p>
          <div className="hero-buttons">
            <Link to="/menu" className="hero-btn primary">View Menu</Link>
            <Link to="/cart" className="hero-btn secondary">View Cart</Link>
          </div>
        </div>
        <div className="hero-image">
          <img src="home.png" alt="Canteen" />
        </div>
      </div>

      <div className="features-section">
        <div className="feature-card">
          <div className="feature-icon">🍔</div>
          <h3>Fresh Food</h3>
          <p>Freshly prepared meals daily</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">⚡</div>
          <h3>Quick Service</h3>
          <p>Fast ordering and delivery</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">💰</div>
          <h3>Affordable Prices</h3>
          <p>Budget-friendly for students</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">🎉</div>
          <h3>Special Offers</h3>
          <p>Exciting deals and coupons</p>
        </div>
      </div>

      <div className="popular-section">
        <h2>Popular Items</h2>
        <div className="popular-grid">
          <div className="popular-item">
            <img src="/bajjijpeg.jpeg" alt="Bajji" />
            <span>Bajji - ₹10</span>
          </div>
          <div className="popular-item">
            <img src="/samos.jpeg" alt="Samosa" />
            <span>Samosa - ₹8</span>
          </div>
          <div className="popular-item">
            <img src="/panipuri.jpeg" alt="Pani Puri" />
            <span>Pani Puri - ₹12</span>
          </div>
          <div className="popular-item">
            <img src="/Dosa.jpeg" alt="Dosa" />
            <span>Dosa - ₹30</span>
          </div>
        </div>
      </div>

      <div className="cta-section">
        <h2>Ready to Order?</h2>
        <p>Browse our menu and order your favorite food now!</p>
        <Link to="/menu" className="cta-button">Order Now</Link>
      </div>
    </div>
  );
}

export default Home;
