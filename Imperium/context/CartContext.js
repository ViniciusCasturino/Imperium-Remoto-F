import React, { createContext, useState } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (item) => {
    const identifier = String(item.id || item.name); 
    
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((cartItem) => String(cartItem.id || cartItem.name) === identifier);

      if (existingItem) {
        return prevItems.map((cartItem) =>
          String(cartItem.id || cartItem.name) === identifier
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      } else {
        return [...prevItems, { ...item, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (identifierToRemove) => {
    setCartItems((prevItems) => prevItems.filter((item) => String(item.id || item.name) !== identifierToRemove));
  };

  const updateQuantity = (identifierToUpdate, change) => {
    setCartItems((prevItems) => {
      return prevItems.map((item) =>
        String(item.id || item.name) === identifierToUpdate
          ? { ...item, quantity: Math.max(1, item.quantity + change) } 
          : item
      );
    });
  };
  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};