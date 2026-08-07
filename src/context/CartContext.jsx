import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

const VALID_COUPONS = {
  'COFFEE10': { type: 'percent', value: 10, code: 'COFFEE10' },
  'WELCOME5': { type: 'fixed', value: 5, code: 'WELCOME5' },
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem('app_cafe_cart');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [coupon, setCoupon] = useState(null);
  const [orderType, setOrderType] = useState('Dine-In'); // Dine-In, Takeaway, Delivery
  const [tableNumber, setTableNumber] = useState('Table 05');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');

  useEffect(() => {
    localStorage.setItem('app_cafe_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, qty = 1, options = {}) => {
    setCartItems((prev) => {
      const cartKey = `${product.id}_${options.ice || 'normal'}_${options.sugar || '100%'}`;
      const existingIndex = prev.findIndex((item) => item.cartKey === cartKey);
      
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].qty += qty;
        return updated;
      }

      return [
        ...prev,
        {
          ...product,
          cartKey,
          qty,
          options,
          note: options.note || '',
        },
      ];
    });
  };

  const updateQuantity = (cartKey, newQty) => {
    if (newQty <= 0) {
      removeFromCart(cartKey);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) => (item.cartKey === cartKey ? { ...item, qty: newQty } : item))
    );
  };

  const updateNote = (cartKey, note) => {
    setCartItems((prev) =>
      prev.map((item) => (item.cartKey === cartKey ? { ...item, note } : item))
    );
  };

  const removeFromCart = (cartKey) => {
    setCartItems((prev) => prev.filter((item) => item.cartKey !== cartKey));
  };

  const clearCart = () => {
    setCartItems([]);
    setCoupon(null);
  };

  const applyCoupon = (code) => {
    const cleanCode = code.trim().toUpperCase();
    if (VALID_COUPONS[cleanCode]) {
      setCoupon(VALID_COUPONS[cleanCode]);
      return { success: true, message: `Coupon ${cleanCode} applied successfully!` };
    }
    return { success: false, message: 'Invalid promo code. Try COFFEE10 or WELCOME5' };
  };

  const removeCoupon = () => {
    setCoupon(null);
  };

  // Calculations
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);
  
  let discountAmount = 0;
  if (coupon) {
    if (coupon.type === 'percent') {
      discountAmount = (subtotal * coupon.value) / 100;
    } else if (coupon.type === 'fixed') {
      discountAmount = Math.min(coupon.value, subtotal);
    }
  }

  const discountedSubtotal = Math.max(0, subtotal - discountAmount);
  const taxAmount = discountedSubtotal * 0.10; // 10% Tax
  const serviceCharge = discountedSubtotal > 0 ? 0.50 : 0.00; // Flat $0.50 service charge
  const grandTotal = discountedSubtotal + taxAmount + serviceCharge;

  const totalItemsCount = cartItems.reduce((sum, item) => sum + item.qty, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        updateQuantity,
        updateNote,
        removeFromCart,
        clearCart,
        coupon,
        applyCoupon,
        removeCoupon,
        orderType,
        setOrderType,
        tableNumber,
        setTableNumber,
        customerName,
        setCustomerName,
        customerPhone,
        setCustomerPhone,
        subtotal,
        discountAmount,
        taxAmount,
        serviceCharge,
        grandTotal,
        totalItemsCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
