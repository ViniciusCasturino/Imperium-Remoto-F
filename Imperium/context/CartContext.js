import React, { createContext, useState } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (item) => {
    setCartItems(prev => {
      const existing = prev.find(p => p.title === item.title);
      if (existing) {
        return prev.map(p =>
          p.title === item.title ? { ...p, quantity: p.quantity + 1 } : p
        );
      } else {
        return [...prev, { ...item, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (title) => {
    setCartItems(prev => prev.filter(p => p.title !== title));
  };

    const clearCart = () => {
    setCartItems([]);
  };

  const updateQuantity = (title, amount) => {
    setCartItems(prev =>
      prev.map(p =>
        p.title === title
          ? { ...p, quantity: Math.max(1, p.quantity + amount) }
          : p
      )
    );
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity,clearCart }}>
      {children}
    </CartContext.Provider>
  );
};
