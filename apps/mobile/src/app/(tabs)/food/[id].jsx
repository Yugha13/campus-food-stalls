import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
  Platform,
  Alert,
} from "react-native";
import { Image } from "expo-image";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useRouter, useLocalSearchParams } from "expo-router";
import { ChevronLeft, Star, Plus, Minus, Store, ShoppingCart } from "lucide-react-native";
import {
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
} from "@expo-google-fonts/inter";
import { useState, useEffect } from "react";
import * as Haptics from 'expo-haptics';
import { addToCart, getCartItems } from '../../../utils/cartUtils';

// Dummy data for all food items
const foodsData = {
  "1": {
    id: "1",
    name: "Chicken Momos",
    image: "https://images.unsplash.com/photo-1496412705862-e0088f16f791?w=600&h=400&fit=crop",
    price: 80,
    shop: "Momos Point",
    rating: 4.6,
    description: "Steamed chicken momos served with spicy sauce and chutney. Made with fresh chicken mince and traditional spices.",
  },
  "2": {
    id: "2",
    name: "Margherita Pizza",
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&h=400&fit=crop",
    price: 180,
    shop: "Pizza Corner",
    rating: 4.4,
    description: "Classic Italian pizza with tomato sauce, mozzarella cheese and fresh basil. Baked in wood-fired oven.",
  },
  "3": {
    id: "3",
    name: "Crispy Burger",
    image: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=600&h=400&fit=crop",
    price: 150,
    shop: "Burger Hub",
    rating: 4.7,
    description: "Crispy chicken patty with lettuce, tomato, mayo and our special sauce. Served with french fries.",
  },
  "4": {
    id: "4",
    name: "Cold Coffee",
    image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=600&h=400&fit=crop",
    price: 120,
    shop: "Cafe Beans",
    rating: 4.5,
    description: "Refreshing cold coffee made with premium beans, ice cream and whipped cream. Perfect for hot days.",
  },
  "5": {
    id: "5",
    name: "Veg Momos",
    image: "https://images.unsplash.com/photo-1496412705862-e0088f16f791?w=600&h=400&fit=crop",
    price: 60,
    shop: "Momos Point",
    rating: 4.3,
    description: "Fresh vegetable momos with cabbage, carrot and herbs. Served with tomato chutney and spicy sauce.",
  },
  "6": {
    id: "6",
    name: "Chicken Burger",
    image: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=600&h=400&fit=crop",
    price: 180,
    shop: "Burger Hub",
    rating: 4.6,
    description: "Juicy chicken patty with cheese, lettuce and special burger sauce. Made with premium ingredients.",
  },
  "7": {
    id: "7",
    name: "Cappuccino",
    image: "https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=600&h=400&fit=crop",
    price: 100,
    shop: "Cafe Beans",
    rating: 4.4,
    description: "Classic cappuccino with frothy milk and coffee art. Made with freshly ground coffee beans.",
  },
  "8": {
    id: "8",
    name: "Pepperoni Pizza",
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=600&h=400&fit=crop",
    price: 250,
    shop: "Pizza Corner",
    rating: 4.5,
    description: "Spicy pepperoni pizza with mozzarella cheese and herbs. Loaded with premium pepperoni slices.",
  },
};

export default function FoodScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const [quantity, setQuantity] = useState(1);
  const [cartItems, setCartItems] = useState([]);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  useEffect(() => {
    loadCartItems();
  }, []);

  const loadCartItems = async () => {
    try {
      const items = await getCartItems();
      setCartItems(items);
    } catch (error) {
      console.error('Error loading cart items:', error);
    }
  };

  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
  });

  if (!fontsLoaded) {
    return null;
  }

  const food = foodsData[id];
  
  if (!food) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Food item not found</Text>
      </View>
    );
  }

  const handleQuantityChange = (type) => {
    if (type === 'increase') {
      setQuantity(prev => prev + 1);
    } else if (type === 'decrease' && quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const totalPrice = food.price * quantity;

  const handleAddToCart = async () => {
    if (isAddingToCart) return;
    
    setIsAddingToCart(true);
    
    try {
      if (Platform.OS === 'ios') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      }
      
      const updatedCart = await addToCart(food, quantity);
      setCartItems(updatedCart);
      
      // Show success feedback
      Alert.alert(
        "Added to Cart",
        `${quantity} ${food.name} added to your cart`,
        [
          {
            text: "Continue Shopping",
            style: "cancel"
          },
          {
            text: "View Cart",
            onPress: () => router.push('/cart')
          }
        ]
      );
      
    } catch (error) {
      Alert.alert("Error", "Failed to add item to cart. Please try again.");
    } finally {
      setIsAddingToCart(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: isDark ? "#121212" : "#F8FDF8" }}>
      <StatusBar style={isDark ? "light" : "dark"} />

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingBottom: insets.bottom + 100, // Extra space for fixed button
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Image */}
        <View style={{ position: "relative" }}>
          <Image
            source={{ uri: food.image }}
            style={{
              width: "100%",
              height: 300,
            }}
            contentFit="cover"
          />
          
          {/* Back Button */}
          <TouchableOpacity
            onPress={() => router.back()}
            style={{
              position: "absolute",
              top: insets.top + 16,
              left: 20,
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <ChevronLeft size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Food Info */}
        <View style={{ paddingHorizontal: 20, paddingTop: 20 }}>
          <Text
            style={{
              fontSize: 28,
              fontFamily: "Inter_600SemiBold",
              color: isDark ? "#FFFFFF" : "#000000",
              marginBottom: 8,
            }}
          >
            {food.name}
          </Text>
          
          <Text
            style={{
              fontSize: 24,
              fontFamily: "Inter_600SemiBold",
              color: "#22C55E",
              marginBottom: 12,
            }}
          >
            ₹{food.price}
          </Text>
          
          <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 20 }}>
            <Store size={16} color={isDark ? "#9CA3AF" : "#6B7280"} />
            <Text
              style={{
                fontSize: 16,
                fontFamily: "Inter_500Medium",
                color: isDark ? "#9CA3AF" : "#6B7280",
                marginLeft: 8,
                marginRight: 16,
              }}
            >
              {food.shop}
            </Text>
            <Star size={16} color="#F59E0B" fill="#F59E0B" />
            <Text
              style={{
                fontSize: 16,
                fontFamily: "Inter_500Medium",
                color: isDark ? "#E5E7EB" : "#374151",
                marginLeft: 6,
              }}
            >
              {food.rating}
            </Text>
          </View>



          {/* Description */}
          <View
            style={{
              backgroundColor: isDark ? "#1E1E1E" : "#FFFFFF",
              borderRadius: 16,
              padding: 20,
              marginBottom: 24,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 8,
              elevation: 3,
            }}
          >
            <Text
              style={{
                fontSize: 16,
                fontFamily: "Inter_600SemiBold",
                color: isDark ? "#FFFFFF" : "#000000",
                marginBottom: 12,
              }}
            >
              Description
            </Text>
            <Text
              style={{
                fontSize: 15,
                fontFamily: "Inter_400Regular",
                color: isDark ? "#E5E7EB" : "#374151",
                lineHeight: 22,
              }}
            >
              {food.description}
            </Text>
          </View>

          {/* Quantity Selector */}
          <View
            style={{
              backgroundColor: isDark ? "#1E1E1E" : "#FFFFFF",
              borderRadius: 16,
              padding: 20,
              marginBottom: 24,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 8,
              elevation: 3,
            }}
          >
            <Text
              style={{
                fontSize: 16,
                fontFamily: "Inter_600SemiBold",
                color: isDark ? "#FFFFFF" : "#000000",
                marginBottom: 16,
              }}
            >
              Quantity
            </Text>
            
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <TouchableOpacity
                  onPress={() => handleQuantityChange('decrease')}
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    backgroundColor: quantity > 1 ? "#22C55E" : isDark ? "#333333" : "#E5E7EB",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  activeOpacity={0.7}
                  disabled={quantity <= 1}
                >
                  <Minus size={20} color={quantity > 1 ? "#FFFFFF" : isDark ? "#666666" : "#9CA3AF"} />
                </TouchableOpacity>
                
                <Text
                  style={{
                    fontSize: 20,
                    fontFamily: "Inter_600SemiBold",
                    color: isDark ? "#FFFFFF" : "#000000",
                    marginHorizontal: 24,
                    minWidth: 30,
                    textAlign: "center",
                  }}
                >
                  {quantity}
                </Text>
                
                <TouchableOpacity
                  onPress={() => handleQuantityChange('increase')}
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    backgroundColor: "#22C55E",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  activeOpacity={0.7}
                >
                  <Plus size={20} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
              
              <View style={{ alignItems: "flex-end" }}>
                <Text
                  style={{
                    fontSize: 12,
                    fontFamily: "Inter_400Regular",
                    color: isDark ? "#9CA3AF" : "#6B7280",
                    marginBottom: 2,
                  }}
                >
                  Total
                </Text>
                <Text
                  style={{
                    fontSize: 20,
                    fontFamily: "Inter_600SemiBold",
                    color: "#22C55E",
                  }}
                >
                  ₹{totalPrice}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Fixed Bottom Button */}
      <View
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: isDark ? "#121212" : "#F8FDF8",
          paddingHorizontal: 20,
          paddingBottom: insets.bottom + 20,
          paddingTop: 20,
          borderTopWidth: 1,
          borderTopColor: isDark ? "#333333" : "#E5E7EB",
        }}
      >
        <TouchableOpacity
          onPress={handleAddToCart}
          disabled={isAddingToCart}
          style={{
            backgroundColor: isAddingToCart ? "#9CA3AF" : "#22C55E",
            borderRadius: 16,
            paddingVertical: 16,
            paddingHorizontal: 24,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            shadowColor: "#22C55E",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 8,
          }}
          activeOpacity={0.8}
        >
          <ShoppingCart size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
          <Text
            style={{
              fontSize: 16,
              fontFamily: "Inter_600SemiBold",
              color: "#FFFFFF",
              marginRight: 8,
            }}
          >
            {isAddingToCart ? "Adding..." : "Add to Cart"}
          </Text>
          <Text
            style={{
              fontSize: 16,
              fontFamily: "Inter_600SemiBold",
              color: "#FFFFFF",
            }}
          >
            ₹{totalPrice}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}