import { useState, useEffect } from "react";
import { Alert, Platform } from "react-native";
import * as Haptics from 'expo-haptics';
import { 
  getCartItems, 
  updateCartItemQuantity, 
  removeFromCart, 
  clearCart, 
  placeOrder,
  getCartTotal,
  getCartItemCount
} from "./cartUtils";
import { useRouter } from "expo-router";

export function useCart() {
  const [items, setItems] = useState([]);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [checkoutItems, setCheckoutItems] = useState([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    loadCartItems();
  }, []);

  const loadCartItems = async () => {
    try {
      const cartItems = await getCartItems();
      setItems(cartItems);
    } catch (error) {
      console.error('Error loading cart items:', error);
    }
  };

  const handleQuantityChange = async (itemId, type) => {
    try {
      if (Platform.OS === 'ios') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
      
      const item = items.find(item => item.id === itemId);
      if (!item) return;
      
      let newQuantity = item.quantity;
      if (type === "increase") {
        newQuantity = item.quantity + 1;
      } else if (type === "decrease" && item.quantity > 1) {
        newQuantity = item.quantity - 1;
      } else {
        return;
      }
      
      const updatedItems = await updateCartItemQuantity(itemId, newQuantity);
      setItems(updatedItems);
    } catch (error) {
      console.error('Error updating quantity:', error);
      Alert.alert('Error', 'Failed to update item quantity');
    }
  };

  const handleRemoveItem = async (itemId) => {
    try {
      if (Platform.OS === 'ios') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      }
      
      Alert.alert(
        'Remove Item',
        'Are you sure you want to remove this item from your cart?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Remove',
            style: 'destructive',
            onPress: async () => {
              const updatedItems = await removeFromCart(itemId);
              setItems(updatedItems);
            }
          }
        ]
      );
    } catch (error) {
      console.error('Error removing item:', error);
      Alert.alert('Error', 'Failed to remove item');
    }
  };

  const calculateSubtotal = () => {
    return getCartTotal(items);
  };

  const calculateTax = (subtotal) => {
    return Math.round(subtotal * 0.05);
  };

  const subtotal = calculateSubtotal();
  const tax = calculateTax(subtotal);
  const total = subtotal + tax;
  const itemCount = getCartItemCount(items);

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

  const handlePlaceOrder = async () => {
    try {
      setIsLoading(true);
      
      if (Platform.OS === 'ios') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
      
      // Use default delivery address for now
      const deliveryAddress = "Block A, Room 205";
      const paymentMethod = "Online Payment";
      
      const order = await placeOrder(checkoutItems, deliveryAddress, paymentMethod);
      
      setShowCheckoutModal(false);
      setItems([]);
      setCheckoutItems([]);
      setCurrentStep(1);
      
      // Show success message
      Alert.alert(
        'Order Placed Successfully! 🎉',
        `Your order #${order.orderId} has been confirmed. You'll receive notifications about your order status.`,
        [
          {
            text: 'Track Order',
            onPress: () => router.push('/order-history')
          },
          {
            text: 'Continue Shopping',
            style: 'cancel'
          }
        ]
      );
    } catch (error) {
      console.error('Error placing order:', error);
      Alert.alert(
        'Order Failed',
        'There was an error placing your order. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsLoading(false);
    }
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
    itemCount,
    isLoading,
    handleCheckout,
    updateCheckoutItemOrderType,
    updateCheckoutItemTiming,
    handlePlaceOrder,
    loadCartItems,
  };
}
