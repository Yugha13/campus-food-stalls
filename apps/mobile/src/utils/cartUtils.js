import AsyncStorage from '@react-native-async-storage/async-storage';
import { scheduleOrderUpdateNotifications } from './notificationUtils';

export const addToCart = async (food, quantity = 1) => {
  try {
    const cartData = await AsyncStorage.getItem('cartItems');
    let cartItems = cartData ? JSON.parse(cartData) : [];
    
    const existingItem = cartItems.find(item => item.id === food.id);
    
    if (existingItem) {
      // Update quantity if item already exists
      cartItems = cartItems.map(item => 
        item.id === food.id 
          ? { ...item, quantity: item.quantity + quantity }
          : item
      );
    } else {
      // Add new item to cart
      cartItems.push({ 
        ...food, 
        quantity: quantity, 
        addedAt: new Date().toISOString() 
      });
    }
    
    await AsyncStorage.setItem('cartItems', JSON.stringify(cartItems));
    return cartItems;
  } catch (error) {
    console.error('Error adding to cart:', error);
    throw error;
  }
};

export const getCartItems = async () => {
  try {
    const cartData = await AsyncStorage.getItem('cartItems');
    return cartData ? JSON.parse(cartData) : [];
  } catch (error) {
    console.error('Error getting cart items:', error);
    return [];
  }
};

export const removeFromCart = async (itemId) => {
  try {
    const cartData = await AsyncStorage.getItem('cartItems');
    let cartItems = cartData ? JSON.parse(cartData) : [];
    
    cartItems = cartItems.filter(item => item.id !== itemId);
    
    await AsyncStorage.setItem('cartItems', JSON.stringify(cartItems));
    return cartItems;
  } catch (error) {
    console.error('Error removing from cart:', error);
    throw error;
  }
};

export const updateCartItemQuantity = async (itemId, newQuantity) => {
  try {
    const cartData = await AsyncStorage.getItem('cartItems');
    let cartItems = cartData ? JSON.parse(cartData) : [];
    
    if (newQuantity <= 0) {
      return await removeFromCart(itemId);
    }
    
    cartItems = cartItems.map(item =>
      item.id === itemId ? { ...item, quantity: newQuantity } : item
    );
    
    await AsyncStorage.setItem('cartItems', JSON.stringify(cartItems));
    return cartItems;
  } catch (error) {
    console.error('Error updating cart item quantity:', error);
    throw error;
  }
};

export const clearCart = async () => {
  try {
    await AsyncStorage.setItem('cartItems', JSON.stringify([]));
    return [];
  } catch (error) {
    console.error('Error clearing cart:', error);
    throw error;
  }
};

// Place order and schedule notifications
export const placeOrder = async (cartItems, deliveryAddress, paymentMethod = 'Online Payment') => {
  try {
    if (!cartItems || cartItems.length === 0) {
      throw new Error('Cart is empty');
    }
    
    // Generate order ID
    const orderId = `ORD${Date.now().toString().slice(-6)}`;
    
    // Calculate total amount
    const totalAmount = cartItems.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
    
    // Create order object
    const order = {
      id: orderId,
      items: cartItems.map(item => ({
        id: item.id,
        name: item.name,
        image: item.image,
        price: item.price,
        quantity: item.quantity,
        shop: item.shop || 'Unknown Shop'
      })),
      totalAmount,
      status: 'confirmed',
      orderDate: new Date().toISOString(),
      estimatedDelivery: new Date(Date.now() + 30 * 60 * 1000).toISOString(), // 30 mins from now
      deliveryAddress,
      paymentMethod,
      orderId
    };
    
    // Save order to order history
    const orderHistoryData = await AsyncStorage.getItem('orderHistory');
    let orderHistory = orderHistoryData ? JSON.parse(orderHistoryData) : [];
    orderHistory.unshift(order); // Add to beginning of array
    await AsyncStorage.setItem('orderHistory', JSON.stringify(orderHistory));
    
    // Clear cart after successful order
    await clearCart();
    
    // Schedule order update notifications
    await scheduleOrderUpdateNotifications(orderId, 'confirmed');
    
    return order;
  } catch (error) {
    console.error('Error placing order:', error);
    throw error;
  }
};

// Get order history
export const getOrderHistory = async () => {
  try {
    const orderHistoryData = await AsyncStorage.getItem('orderHistory');
    return orderHistoryData ? JSON.parse(orderHistoryData) : [];
  } catch (error) {
    console.error('Error getting order history:', error);
    return [];
  }
};

// Get cart total
export const getCartTotal = (cartItems) => {
  return cartItems.reduce((total, item) => {
    return total + (item.price * item.quantity);
  }, 0);
};

// Get cart item count
export const getCartItemCount = (cartItems) => {
  return cartItems.reduce((count, item) => {
    return count + item.quantity;
  }, 0);
};