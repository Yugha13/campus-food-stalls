import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
  Platform,
  Alert,
  Dimensions,
  Animated,
} from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from "expo-image";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useRouter, useLocalSearchParams } from "expo-router";
import { 
  ChevronLeft, 
  Star, 
  Plus, 
  Minus, 
  Store, 
  ShoppingCart,
  Heart,
  Share2,
  Clock,
  MapPin,
  Leaf,
  FlameKindling
} from "lucide-react-native";
import {
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
} from "@expo-google-fonts/inter";
import { useState, useEffect, useRef } from "react";
import * as Haptics from 'expo-haptics';
import { addToCart, getCartItems } from '../../../utils/cartUtils';
import { getFoodById, getShopById } from '../../../data/mockData';

export default function FoodScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const { width: screenWidth } = Dimensions.get('window');
  
  const [quantity, setQuantity] = useState(1);
  const [cartItems, setCartItems] = useState([]);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const scrollY = useRef(new Animated.Value(0)).current;

  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
  });

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

  if (!fontsLoaded) {
    return (
      <View style={{ 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center',
        backgroundColor: isDark ? "#121212" : "#F8FDF8"
      }}>
        <Text style={{ color: isDark ? "#FFFFFF" : "#000000" }}>Loading...</Text>
      </View>
    );
  }

  const food = getFoodById(id);
  const shop = food ? getShopById(food.shopId) : null;
  
  if (!food) {
    return (
      <View style={{ 
        flex: 1, 
        justifyContent: "center", 
        alignItems: "center",
        backgroundColor: isDark ? "#121212" : "#F8FDF8"
      }}>
        <Text style={{ 
          color: isDark ? "#FFFFFF" : "#000000",
          fontSize: 18,
          fontFamily: "Inter_500Medium",
          marginBottom: 16
        }}>
          Food item not found
        </Text>
        <TouchableOpacity
          onPress={() => router.back()}
          style={{
            backgroundColor: "#22C55E",
            paddingHorizontal: 24,
            paddingVertical: 12,
            borderRadius: 12,
          }}
        >
          <Text style={{
            color: "#FFFFFF",
            fontSize: 16,
            fontFamily: "Inter_600SemiBold"
          }}>
            Go Back
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleQuantityChange = (type) => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
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
      
      if (Platform.OS === 'ios') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
      
      Alert.alert(
        "🎉 Added to Cart!",
        `${quantity} ${food.name} added successfully`,
        [
          {
            text: "Continue Shopping",
            style: "default"
          },
          {
            text: "View Cart →",
            onPress: () => router.push('/cart')
          }
        ]
      );
      
    } catch (error) {
      Alert.alert("❌ Error", "Failed to add item to cart. Please try again.");
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleLike = () => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    setIsLiked(!isLiked);
  };

  const handleShare = () => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    Alert.alert("Share", "Share functionality will be implemented soon!");
  };

  // Animated header opacity
  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 200],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  return (
    <View style={{ flex: 1, backgroundColor: "#A8C472" }}>
      <StatusBar style="light" translucent={true} />

      {/* Image Section */}
      <View style={{ position: "relative", flex: 1 }}>
        <Image
          source={{ uri: food.image }}
          style={{
            width: screenWidth,
            height: "100%",
            borderBottomLeftRadius: 40,
            borderBottomRightRadius: 40,
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
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            justifyContent: "center",
            alignItems: "center",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3,
          }}
        >
          <ChevronLeft size={20} color="#000000" />
        </TouchableOpacity>
        
        {/* Heart Button */}
        <TouchableOpacity
          onPress={handleLike}
          style={{
            position: "absolute",
            bottom: 20,
            right: 20,
            width: 56,
            height: 56,
            borderRadius: 16,
            backgroundColor: isLiked ? "#EF4444" : "#A8C472",
            justifyContent: "center",
            alignItems: "center",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.2,
            shadowRadius: 8,
            elevation: 5,
          }}
        >
          <Heart 
            size={24} 
            color="#FFFFFF" 
            fill={isLiked ? "#FFFFFF" : "none"}
          />
        </TouchableOpacity>
      </View>


      {/* Content Card */}
      <View style={{
        backgroundColor: "#FFFFFF",
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingHorizontal: 24,
        paddingTop: 24,
        paddingBottom: insets.bottom + 140,
        marginTop: -30,
        flex: 1,
      }}>
        {/* Title and Rating */}
        <Text style={{
          fontSize: 24,
          fontFamily: "Inter_600SemiBold",
          color: "#000000",
          marginBottom: 12,
        }}>
          {food.name}
        </Text>
        
        <View style={{ 
          flexDirection: "row", 
          alignItems: "center", 
          marginBottom: 24,
          gap: 16,
        }}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Star size={16} color="#F59E0B" fill="#F59E0B" />
            <Text style={{
              fontSize: 16,
              fontFamily: "Inter_600SemiBold",
              color: "#000000",
              marginLeft: 4,
            }}>
              {food.rating}
            </Text>
            <Text style={{
              fontSize: 14,
              fontFamily: "Inter_400Regular",
              color: "#9CA3AF",
              marginLeft: 4,
            }}>
              (125)
            </Text>
          </View>
          
          <Text style={{
            fontSize: 14,
            fontFamily: "Inter_400Regular",
            color: "#9CA3AF",
          }}>
            {Math.floor(Math.random() * 200) + 150} calories
          </Text>
          
          <View style={{
            backgroundColor: "#FF8C42",
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: 16,
            flexDirection: "row",
            alignItems: "center",
          }}>
            <Clock size={12} color="#FFFFFF" />
            <Text style={{
              fontSize: 12,
              fontFamily: "Inter_500Medium",
              color: "#FFFFFF",
              marginLeft: 4,
            }}>
              {Math.floor(Math.random() * 20) + 15} min
            </Text>
          </View>
        </View>
        
        {/* Details Section */}
        <Text style={{
          fontSize: 18,
          fontFamily: "Inter_600SemiBold",
          color: "#000000",
          marginBottom: 12,
        }}>
          Details
        </Text>
        
        <Text style={{
          fontSize: 14,
          fontFamily: "Inter_400Regular",
          color: "#6B7280",
          lineHeight: 20,
          marginBottom: 24,
        }}>
          {food.description || `The ${food.name.toLowerCase()} looks great on the plate because it's a whole dish. And bright vegetables, which you can choose yourself, will delight in color and complement the picture.`}
        </Text>
        
        {/* Ingredients Section */}
        <Text style={{
          fontSize: 18,
          fontFamily: "Inter_600SemiBold",
          color: "#000000",
          marginBottom: 16,
        }}>
          Ingredients
        </Text>
        
        <View style={{
          flexDirection: "row",
          gap: 12,
          marginBottom: 32,
        }}>
          {/* Sample ingredient icons */}
          {[
            "🥩", "🥑", "🍅", "🥬", "🌶️"
          ].map((emoji, index) => (
            <View
              key={index}
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: "#F3F4F6",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text style={{ fontSize: 20 }}>{emoji}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Bottom Fixed Section */}
      <View style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: "#FFFFFF",
        paddingHorizontal: 24,
        paddingTop: 20,
        paddingBottom: insets.bottom + 20,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 10,
        flexDirection: "row",
        alignItems: "center",
        gap: 16,
      }}>
        {/* Quantity Control */}
        <View style={{
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: "#F3F4F6",
          borderRadius: 20,
          padding: 4,
        }}>
          <TouchableOpacity
            onPress={() => handleQuantityChange('decrease')}
            disabled={quantity <= 1}
            style={{
              width: 32,
              height: 32,
              borderRadius: 16,
              backgroundColor: quantity <= 1 ? "#E5E7EB" : "#FFFFFF",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Minus 
              size={16} 
              color={quantity <= 1 ? "#9CA3AF" : "#000000"}
            />
          </TouchableOpacity>
          
          <Text style={{
            fontSize: 18,
            fontFamily: "Inter_600SemiBold",
            color: "#000000",
            marginHorizontal: 16,
            minWidth: 20,
            textAlign: 'center',
          }}>
            {quantity}
          </Text>
          
          <TouchableOpacity
            onPress={() => handleQuantityChange('increase')}
            style={{
              width: 32,
              height: 32,
              borderRadius: 16,
              backgroundColor: "#FFFFFF",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Plus size={16} color="#000000" />
          </TouchableOpacity>
        </View>
        
        {/* Add to Cart Button */}
        <TouchableOpacity
          onPress={handleAddToCart}
          disabled={isAddingToCart}
          style={{
            flex: 1,
            backgroundColor: isAddingToCart ? "#9CA3AF" : "#A8C472",
            borderRadius: 20,
            paddingVertical: 16,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            shadowColor: "#A8C472",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 8,
          }}
        >
          <Text style={{
            fontSize: 18,
            fontFamily: "Inter_600SemiBold",
            color: "#FFFFFF",
            marginRight: 8,
          }}>
            {isAddingToCart ? 'Adding...' : 'Order for'}
          </Text>
          <Text style={{
            fontSize: 18,
            fontFamily: "Inter_600SemiBold",
            color: "#FFFFFF",
          }}>
            ₹{totalPrice}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}