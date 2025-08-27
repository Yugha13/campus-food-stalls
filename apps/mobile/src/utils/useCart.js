import { useState } from "react";
import { cartItemsData } from "./ordersData";

export function useCart() {
  const [items, setItems] = useState(cartItemsData);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [checkoutItems, setCheckoutItems] = useState([]);
  const [currentStep, setCurrentStep] = useState(1);

  const handleQuantityChange = (itemId, type) => {
    setItems((prevItems) =>
      prevItems.map((item) => {
        if (item.id === itemId) {
          if (type === "increase") {
            return { ...item, quantity: item.quantity + 1 };
          } else if (type === "decrease" && item.quantity > 1) {
            return { ...item, quantity: item.quantity - 1 };
          }
        }
        return item;
      })
    );
  };

  const handleRemoveItem = (itemId) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
  };

  const calculateSubtotal = () => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const calculateTax = (subtotal) => {
    return Math.round(subtotal * 0.05);
  };

  const subtotal = calculateSubtotal();
  const tax = calculateTax(subtotal);
  const total = subtotal + tax;

  const handleCheckout = () => {
    const initCheckoutItems = items.map((item) => ({
      ...item,
      selectedOrderType: item.orderType,
      selectedTiming: "Now (15-20 mins)",
    }));
    setCheckoutItems(initCheckoutItems);
    setCurrentStep(1);
    setShowCheckoutModal(true);
  };

  const updateCheckoutItemOrderType = (itemId, orderType) => {
    setCheckoutItems((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, selectedOrderType: orderType } : item
      )
    );
  };

  const updateCheckoutItemTiming = (itemId, timing) => {
    setCheckoutItems((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, selectedTiming: timing } : item
      )
    );
  };

  const handlePlaceOrder = () => {
    console.log("Order placed:", checkoutItems);
    setShowCheckoutModal(false);
    setItems([]);

    setTimeout(() => {
      alert(
        "Order placed successfully! You'll be notified when your food is ready for pickup/dine-in."
      );
    }, 500);
  };

  return {
    items,
    showCheckoutModal,
    setShowCheckoutModal,
    checkoutItems,
    currentStep,
    setCurrentStep,
    handleQuantityChange,
    handleRemoveItem,
    subtotal,
    tax,
    total,
    handleCheckout,
    updateCheckoutItemOrderType,
    updateCheckoutItemTiming,
    handlePlaceOrder,
  };
}
