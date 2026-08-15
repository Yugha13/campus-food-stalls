import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
  Platform,
  Alert,
  Animated,
  Modal,
  TextInput,
  Dimensions,
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

  const mockFoodReviews = [
    {
      id: "1",
      name: "Rohit Verma",
      rating: 5,
      comment: "Absolutely delicious! The best I've had on campus.",
      date: "1 day ago",
    },
    {
      id: "2",
      name: "Sneha Patel",
      rating: 4,
      comment: "Great taste, but portion size could be a bit larger.",
      date: "3 days ago",
    }
  ];
  const [foodReviews, setFoodReviews] = useState(mockFoodReviews);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewComment, setNewReviewComment] = useState("");

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

  const submitReview = () => {
    if (!newReviewComment.trim()) {
      Alert.alert("Error", "Please enter a comment");
      return;
    }
    const newReview = {
      id: Date.now().toString(),
      name: "Current User",
      rating: newReviewRating,
      comment: newReviewComment,
      date: "Just now",
    };
    setFoodReviews([newReview, ...foodReviews]);
    setShowReviewForm(false);
    setNewReviewComment("");
    setNewReviewRating(5);
    if (Platform.OS === 'ios') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const renderReview = (review) => (
    <View
      key={review.id}
      style={{
        backgroundColor: isDark ? "#374151" : "#F9FAFB",
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 8 }}>
        <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: "#22C55E", justifyContent: "center", alignItems: "center", marginRight: 12 }}>
          <Text style={{ fontSize: 14, fontFamily: "Inter_600SemiBold", color: "#FFFFFF" }}>{review.name.charAt(0)}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 14, fontFamily: "Inter_600SemiBold", color: isDark ? "#FFFFFF" : "#000000", marginBottom: 2 }}>{review.name}</Text>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={12} color={i < review.rating ? "#F59E0B" : "#D1D5DB"} fill={i < review.rating ? "#F59E0B" : "none"} />
            ))}
            <Text style={{ fontSize: 12, fontFamily: "Inter_400Regular", color: isDark ? "#9CA3AF" : "#6B7280", marginLeft: 8 }}>{review.date}</Text>
          </View>
        </View>
      </View>
      <Text style={{ fontSize: 14, fontFamily: "Inter_400Regular", color: isDark ? "#E5E7EB" : "#374151", lineHeight: 20 }}>{review.comment}</Text>
    </View>
  );

  // Animated header opacity
  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 200],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  return (
    <View style={{ flex: 1, backgroundColor: isDark ? "#121212" : "#F8FDF8" }}>
      <StatusBar style={isDark ? "light" : "dark"} translucent={true} />

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
            backgroundColor: isLiked ? "#EF4444" : "#22C55E",
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
      <ScrollView style={{
        backgroundColor: isDark ? "#1E1E1E" : "#FFFFFF",
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        marginTop: -30,
        flex: 1,
      }}
      contentContainerStyle={{
        paddingHorizontal: 24,
        paddingTop: 24,
        paddingBottom: insets.bottom + 140,
      }}
      showsVerticalScrollIndicator={false}
      >
        {/* Title and Rating */}
        <Text style={{
          fontSize: 24,
          fontFamily: "Inter_600SemiBold",
          color: isDark ? "#FFFFFF" : "#000000",
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
              color: isDark ? "#FFFFFF" : "#000000",
              marginLeft: 4,
            }}>
              {food.rating}
            </Text>
            <Text style={{
              fontSize: 14,
              fontFamily: "Inter_400Regular",
              color: isDark ? "#9CA3AF" : "#6B7280",
              marginLeft: 4,
            }}>
              (125)
            </Text>
          </View>
          
          <Text style={{
            fontSize: 14,
            fontFamily: "Inter_400Regular",
            color: isDark ? "#9CA3AF" : "#6B7280",
          }}>
            {food.type === 'veg' ? '🌱 Vegetarian' : '🍖 Non-Vegetarian'}
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
          color: isDark ? "#FFFFFF" : "#000000",
          marginBottom: 12,
        }}>
          Details
        </Text>
        
        <Text style={{
          fontSize: 14,
          fontFamily: "Inter_400Regular",
          color: isDark ? "#D1D5DB" : "#6B7280",
          lineHeight: 20,
          marginBottom: 24,
        }}>
          {food.description || `The ${food.name.toLowerCase()} looks great on the plate because it's a whole dish. And bright vegetables, which you can choose yourself, will delight in color and complement the picture.`}
        </Text>
        
        {/* Shop Information Section */}
        <Text style={{
          fontSize: 18,
          fontFamily: "Inter_600SemiBold",
          color: isDark ? "#FFFFFF" : "#000000",
          wmarginBottom: 16,
        }}>
          Shop Information
        </Text>
        
        <View style={{
          backgroundColor: isDark ? "#374151" : "#F9FAFB",
          borderRadius: 16,
          padding: 16,
          marginBottom: 24,
        }}>
          <View style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 8,
          }}>
            <Store size={16} color={isDark ? "#D1D5DB" : "#6B7280"} />
            <Text style={{
              fontSize: 16,
              fontFamily: "Inter_600SemiBold",
              color: isDark ? "#FFFFFF" : "#000000",
              marginLeft: 8,
            }}>
              {food.shop}
            </Text>
          </View>
          
          {shop && (
            <>
              <View style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 4,
              }}>
                <MapPin size={14} color={isDark ? "#9CA3AF" : "#6B7280"} />
                <Text style={{
                  fontSize: 14,
                  fontFamily: "Inter_400Regular",
                  color: isDark ? "#D1D5DB" : "#6B7280",
                  marginLeft: 6,
                }}>
                  {shop.location}
                </Text>
              </View>
              
              <View style={{
                flexDirection: "row",
                alignItems: "center",
              }}>
                <Star size={14} color="#F59E0B" fill="#F59E0B" />
                <Text style={{
                  fontSize: 14,
                  fontFamily: "Inter_500Medium",
                  color: isDark ? "#D1D5DB" : "#6B7280",
                  marginLeft: 6,
                }}>
                  {shop.rating} Shop Rating
                </Text>
              </View>
            </>
          )}
        </View>
        
        {/* Nutrition & Allergen Info */}
        <Text style={{
          fontSize: 18,
          fontFamily: "Inter_600SemiBold",
          color: isDark ? "#FFFFFF" : "#000000",
          marginBottom: 16,
        }}>
          Nutrition & Allergens
        </Text>
        
        <View style={{
          flexDirection: "row",
          gap: 12,
          marginBottom: 32,
        }}>
          {[
            { icon: "🔥", label: "Energy" },
            { icon: "🥗", label: "Fresh" },
            { icon: "⚡", label: "Quick" },
            { icon: "❤️", label: "Healthy" },
            { icon: "🌟", label: "Popular" }
          ].map((item, index) => (
            <View
              key={index}
              style={{
                alignItems: "center",
                flex: 1,
              }}
            >
              <View
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  backgroundColor: isDark ? "#374151" : "#F3F4F6",
                  justifyContent: "center",
                  alignItems: "center",
                  marginBottom: 4,
                }}
              >
                <Text style={{ fontSize: 18 }}>{item.icon}</Text>
              </View>
              <Text style={{
                fontSize: 10,
                fontFamily: "Inter_500Medium",
                color: isDark ? "#9CA3AF" : "#6B7280",
                textAlign: "center",
              }}>
                {item.label}
              </Text>
            </View>
          ))}
        </View>
        
        {/* Reviews Section */}
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <Text style={{ fontSize: 18, fontFamily: "Inter_600SemiBold", color: isDark ? "#FFFFFF" : "#000000" }}>
            Reviews
          </Text>
          <TouchableOpacity
            onPress={() => setShowReviewForm(true)}
            style={{ backgroundColor: "#22C55E", paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8 }}
          >
            <Text style={{ color: "#FFFFFF", fontFamily: "Inter_600SemiBold", fontSize: 14 }}>Write Review</Text>
          </TouchableOpacity>
        </View>
        {foodReviews.map(renderReview)}

      </ScrollView>

      {/* Bottom Fixed Section */}
      <View style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: isDark ? "#1E1E1E" : "#FFFFFF",
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
          backgroundColor: isDark ? "#374151" : "#F3F4F6",
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
              backgroundColor: quantity <= 1 ? (isDark ? "#4B5563" : "#E5E7EB") : (isDark ? "#6B7280" : "#FFFFFF"),
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Minus 
              size={16} 
              color={quantity <= 1 ? "#9CA3AF" : (isDark ? "#FFFFFF" : "#000000")}
            />
          </TouchableOpacity>
          
          <Text style={{
            fontSize: 18,
            fontFamily: "Inter_600SemiBold",
            color: isDark ? "#FFFFFF" : "#000000",
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
              backgroundColor: isDark ? "#6B7280" : "#FFFFFF",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Plus size={16} color={isDark ? "#FFFFFF" : "#000000"} />
          </TouchableOpacity>
        </View>
        
        {/* Add to Cart Button */}
        <TouchableOpacity
          onPress={handleAddToCart}
          disabled={isAddingToCart}
          style={{
            flex: 1,
            backgroundColor: isAddingToCart ? "#9CA3AF" : "#22C55E",
            borderRadius: 20,
            paddingVertical: 16,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            shadowColor: "#22C55E",
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

      {/* Review Form Modal */}
      <Modal visible={showReviewForm} animationType="slide" transparent={true} onRequestClose={() => setShowReviewForm(false)}>
        <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "flex-end" }}>
          <View style={{ backgroundColor: isDark ? "#1E1E1E" : "#FFFFFF", borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, minHeight: 400, paddingBottom: insets.bottom + 24 }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <Text style={{ fontSize: 20, fontFamily: "Inter_600SemiBold", color: isDark ? "#FFFFFF" : "#000000" }}>Write a Review</Text>
              <TouchableOpacity onPress={() => setShowReviewForm(false)}>
                <Text style={{ fontSize: 16, color: "#EF4444", fontFamily: "Inter_500Medium" }}>Cancel</Text>
              </TouchableOpacity>
            </View>
            
            <Text style={{ fontSize: 16, fontFamily: "Inter_500Medium", color: isDark ? "#E5E7EB" : "#374151", marginBottom: 12 }}>Rating</Text>
            <View style={{ flexDirection: "row", marginBottom: 24, gap: 8 }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity key={star} onPress={() => setNewReviewRating(star)}>
                  <Star size={32} color={star <= newReviewRating ? "#F59E0B" : "#D1D5DB"} fill={star <= newReviewRating ? "#F59E0B" : "none"} />
                </TouchableOpacity>
              ))}
            </View>
            
            <Text style={{ fontSize: 16, fontFamily: "Inter_500Medium", color: isDark ? "#E5E7EB" : "#374151", marginBottom: 12 }}>Comment</Text>
            <TextInput
              style={{
                backgroundColor: isDark ? "#374151" : "#F3F4F6",
                borderRadius: 12,
                padding: 16,
                color: isDark ? "#FFFFFF" : "#000000",
                fontFamily: "Inter_400Regular",
                minHeight: 100,
                textAlignVertical: "top",
                marginBottom: 24
              }}
              placeholder="What did you like or dislike?"
              placeholderTextColor={isDark ? "#9CA3AF" : "#6B7280"}
              multiline
              value={newReviewComment}
              onChangeText={setNewReviewComment}
            />
            
            <TouchableOpacity
              onPress={submitReview}
              style={{ backgroundColor: "#22C55E", padding: 16, borderRadius: 12, alignItems: "center" }}
            >
              <Text style={{ color: "#FFFFFF", fontSize: 16, fontFamily: "Inter_600SemiBold" }}>Submit Review</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}