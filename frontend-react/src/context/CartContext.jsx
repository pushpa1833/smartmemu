import { useState, createContext } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  const addToCart = (item) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.name === item.name);

      if (existing) {
        return prev.map((i) =>
          i.name === item.name ? { ...i, quantity: i.quantity + 1 } : i
        );
      }

      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const increaseQty = (itemName) => {
    setCart((prev) =>
      prev.map((item) =>
        item.name === itemName ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const decreaseQty = (itemName) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.name === itemName);
      if (existing) {
        if (existing.quantity > 1) {
          return prev.map((item) =>
            item.name === itemName ? { ...item, quantity: item.quantity - 1 } : item
          );
        } else {
          return prev.filter((item) => item.name !== itemName);
        }
      }
      return prev;
    });
  };

  const removeFromCart = (itemName) => {
    setCart((prev) => prev.filter((item) => item.name !== itemName));
  };

  const clearCart = () => {
    setCart([]);
  };

  const getTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, increaseQty, decreaseQty, getTotal, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};
