import React from 'react';
import "./FoodCard.css";

function FoodCard({ name, price, image, description, isVeg, onAddToCart, quantityInCart = 0 }) {
  return (
    <div className="food-card">
      <div className="food-image-container">
        <img src={`/${image}`} alt={name} />
        <span className={`veg-indicator ${isVeg ? 'veg' : 'non-veg'}`}>
          {isVeg ? '🟢' : '🔴'}
        </span>
      </div>
      <div className="food-info">
        <h3>{name}</h3>
        <p className="food-description">{description}</p>
        <div className="food-price-row">
          <span className="food-price">₹{price}</span>
          {quantityInCart > 0 ? (
            <button className="added-btn" disabled>
              ✓ Added ({quantityInCart})
            </button>
          ) : (
            <button
              className="add-cart-btn"
              onClick={() => onAddToCart({ name, price, image, description, isVeg })}
            >
              🛒 Add
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default FoodCard;
