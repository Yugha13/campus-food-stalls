import AsyncStorage from '@react-native-async-storage/async-storage';

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