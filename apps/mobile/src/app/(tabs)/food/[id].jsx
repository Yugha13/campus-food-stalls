import {
  View,
  Text,
  TouchableOpacity,
  useColorScheme,
  Platform,
  Alert,
  Animated,
  Modal,
  TextInput,
  Dimensions,
  StyleSheet,
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
  Heart,
  Clock,
  MapPin,
  FlameKindling,
  Leaf
} from "lucide-react-native";
import {
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
} from "@expo-google-fonts/inter";
import { useState, useEffect, useRef } from "react";
import * as Haptics from 'expo-haptics';
import { BlurView } from 'expo-blur';
import { addToCart, getCartItems } from '../../../utils/cartUtils';
import { getFoodById, getShopById } from '../../../data/mockData';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const HEADER_HEIGHT = screenHeight * 0.45;

export default function FoodScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  
  const [quantity, setQuantity] = useState(1);
  const [cartItems, setCartItems] = useState([]);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  
  const scrollY = useRef(new Animated.Value(0)).current;

  // Review states
  const [foodReviews, setFoodReviews] = useState([
    { id: "1", name: "Rohit Verma", rating: 5, comment: "Absolutely delicious! The best I've had on campus.", date: "1 day ago" },
    { id: "2", name: "Sneha Patel", rating: 4, comment: "Great taste, but portion size could be a bit larger.", date: "3 days ago" }
  ]);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewComment, setNewReviewComment] = useState("");

  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
  });

  useEffect(() => { loadCartItems(); }, []);

  const loadCartItems = async () => {
    try {
      const items = await getCartItems();
      setCartItems(items);
    } catch (error) {
      console.error(error);
    }
  };

  if (!fontsLoaded) return null;

  const food = getFoodById(id);
  const shop = food ? getShopById(food.shopId) : null;
  
  if (!food) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: isDark ? "#09090B" : "#FAFAFA" }}>
        <Text style={{ color: isDark ? "#FFFFFF" : "#000000" }}>Food item not found</Text>
      </View>
    );
  }

  const handleQuantityChange = (type) => {
    if (Platform.OS === 'ios') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (type === 'increase') setQuantity(prev => prev + 1);
    else if (type === 'decrease' && quantity > 1) setQuantity(prev => prev - 1);
  };

  const handleAddToCart = async () => {
    if (isAddingToCart) return;
    setIsAddingToCart(true);
    try {
      if (Platform.OS === 'ios') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      const updatedCart = await addToCart(food, quantity);
      setCartItems(updatedCart);
      if (Platform.OS === 'ios') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert("Added to Cart!", `${quantity} ${food.name} added successfully`, [
        { text: "Continue", style: "cancel" },
        { text: "View Cart", onPress: () => router.push('/cart') }
      ]);
    } catch (error) {
      Alert.alert("Error", "Failed to add item to cart.");
    } finally {
      setIsAddingToCart(false);
    }
  };

  const submitReview = () => {
    if (!newReviewComment.trim()) {
      Alert.alert("Error", "Please enter a comment");
      return;
    }
    const newReview = { id: Date.now().toString(), name: "Current User", rating: newReviewRating, comment: newReviewComment, date: "Just now" };
    setFoodReviews([newReview, ...foodReviews]);
    setShowReviewForm(false);
    setNewReviewComment("");
    setNewReviewRating(5);
    if (Platform.OS === 'ios') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  // Animations
  const imageScale = scrollY.interpolate({
    inputRange: [-100, 0],
    outputRange: [1.5, 1],
    extrapolateRight: 'clamp',
  });
  
  const headerTranslateY = scrollY.interpolate({
    inputRange: [0, HEADER_HEIGHT],
    outputRange: [0, -HEADER_HEIGHT / 2],
    extrapolate: 'clamp',
  });

  const topBarBgOpacity = scrollY.interpolate({
    inputRange: [HEADER_HEIGHT - 100, HEADER_HEIGHT],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const themeColors = {
    bg: isDark ? "#09090B" : "#F8FAFC",
    cardBg: isDark ? "#18181B" : "#FFFFFF",
    textPrimary: isDark ? "#FAFAFA" : "#0F172A",
    textSecondary: isDark ? "#A1A1AA" : "#64748B",
    primary: "#10B981", // Emerald 500
    primaryLight: isDark ? "rgba(16, 185, 129, 0.2)" : "#D1FAE5",
    border: isDark ? "#27272A" : "#F1F5F9",
  };

  return (
    <View style={{ flex: 1, backgroundColor: themeColors.bg }}>
      <StatusBar style="light" translucent={true} />

      {/* Parallax Image Header */}
      <Animated.View style={{ 
        position: 'absolute', 
        top: 0, left: 0, right: 0, 
        height: HEADER_HEIGHT, 
        transform: [{ translateY: headerTranslateY }, { scale: imageScale }] 
      }}>
        <Image source={{ uri: food.image }} style={{ width: '100%', height: '100%' }} contentFit="cover" />
        <LinearGradient
          colors={['rgba(0,0,0,0.5)', 'transparent', themeColors.bg]}
          locations={[0, 0.5, 1]}
          style={StyleSheet.absoluteFillObject}
        />
      </Animated.View>

      {/* Floating Top Navigation */}
      <View style={{
        position: 'absolute',
        top: 0, left: 0, right: 0,
        zIndex: 100,
      }}>
        <Animated.View style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: isDark ? 'rgba(9,9,11,0.9)' : 'rgba(255,255,255,0.9)',
          opacity: topBarBgOpacity,
        }} />
        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingHorizontal: 20,
          paddingTop: insets.top + 10,
          paddingBottom: 10,
        }}>
          <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
            <BlurView intensity={40} tint="dark" style={styles.blurIcon}>
              <ChevronLeft size={24} color="#FFFFFF" />
            </BlurView>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {
            setIsLiked(!isLiked);
            if (Platform.OS === 'ios') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          }} style={styles.iconButton}>
            <BlurView intensity={40} tint="dark" style={styles.blurIcon}>
              <Heart size={22} color={isLiked ? "#EF4444" : "#FFFFFF"} fill={isLiked ? "#EF4444" : "none"} />
            </BlurView>
          </TouchableOpacity>
        </View>
      </View>

      {/* Main Content */}
      <Animated.ScrollView
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: true })}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: HEADER_HEIGHT - 60, paddingBottom: insets.bottom + 120 }}
      >
        <View style={{
          backgroundColor: themeColors.bg,
          borderTopLeftRadius: 40,
          borderTopRightRadius: 40,
          paddingHorizontal: 24,
          paddingTop: 32,
          minHeight: screenHeight - HEADER_HEIGHT + 60,
        }}>
          
          {/* Header Info */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
            <View style={{ flex: 1, paddingRight: 16 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12, gap: 8 }}>
                <View style={{ backgroundColor: themeColors.primaryLight, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 }}>
                  <Text style={{ color: themeColors.primary, fontFamily: "Inter_600SemiBold", fontSize: 12 }}>
                    {food.type === 'veg' ? 'Vegetarian' : 'Non-Veg'}
                  </Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: isDark ? '#27272A' : '#F1F5F9', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 12 }}>
                  <Star size={12} color="#F59E0B" fill="#F59E0B" />
                  <Text style={{ color: themeColors.textPrimary, fontFamily: "Inter_600SemiBold", fontSize: 12, marginLeft: 4 }}>{food.rating}</Text>
                </View>
              </View>
              <Text style={{ fontSize: 24, fontFamily: "Inter_600SemiBold", color: themeColors.textPrimary, lineHeight: 30 }}>
                {food.name}
              </Text>
            </View>
            <Text style={{ fontSize: 24, fontFamily: "Inter_600SemiBold", color: themeColors.primary, paddingTop: 36 }}>
              ₹{food.price}
            </Text>
          </View>

          {/* Quick Stats Grid */}
          <View style={{ flexDirection: 'row', gap: 12, marginBottom: 32 }}>
            <View style={[styles.statBox, { backgroundColor: themeColors.cardBg, borderColor: themeColors.border }]}>
              <Clock size={22} color={themeColors.primary} />
              <Text style={[styles.statValue, { color: themeColors.textPrimary }]}>15-20</Text>
              <Text style={[styles.statLabel, { color: themeColors.textSecondary }]}>Mins</Text>
            </View>
            <View style={[styles.statBox, { backgroundColor: themeColors.cardBg, borderColor: themeColors.border }]}>
              <FlameKindling size={22} color="#EF4444" />
              <Text style={[styles.statValue, { color: themeColors.textPrimary }]}>320</Text>
              <Text style={[styles.statLabel, { color: themeColors.textSecondary }]}>Kcal</Text>
            </View>
            <View style={[styles.statBox, { backgroundColor: themeColors.cardBg, borderColor: themeColors.border }]}>
              <Leaf size={22} color="#10B981" />
              <Text style={[styles.statValue, { color: themeColors.textPrimary }]}>Fresh</Text>
              <Text style={[styles.statLabel, { color: themeColors.textSecondary }]}>Made</Text>
            </View>
          </View>

          {/* Description */}
          <Text style={{ fontSize: 20, fontFamily: "Inter_600SemiBold", color: themeColors.textPrimary, marginBottom: 12 }}>About</Text>
          <Text style={{ fontSize: 15, fontFamily: "Inter_400Regular", color: themeColors.textSecondary, lineHeight: 24, marginBottom: 32 }}>
            {food.description || `The ${food.name.toLowerCase()} is crafted with fresh ingredients directly from our kitchen. Experience the perfect blend of spices and authentic flavors.`}
          </Text>

          {/* Shop Card */}
          <TouchableOpacity 
            activeOpacity={0.8}
            onPress={() => router.push(`/(tabs)/shop/${food.shopId}`)}
            style={{
              backgroundColor: themeColors.cardBg,
              borderRadius: 24,
              padding: 16,
              flexDirection: 'row',
              alignItems: 'center',
              borderWidth: 1,
              borderColor: themeColors.border,
              marginBottom: 32,
              shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 12, elevation: 2
            }}
          >
            <View style={{ width: 56, height: 56, borderRadius: 28, backgroundColor: themeColors.primaryLight, justifyContent: 'center', alignItems: 'center', marginRight: 16 }}>
              <Store size={28} color={themeColors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 18, fontFamily: "Inter_600SemiBold", color: themeColors.textPrimary, marginBottom: 4 }}>{food.shop}</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <MapPin size={14} color={themeColors.textSecondary} />
                <Text style={{ fontSize: 14, fontFamily: "Inter_400Regular", color: themeColors.textSecondary, marginLeft: 4 }}>{shop?.location || "Campus"}</Text>
              </View>
            </View>
            <ChevronLeft size={20} color={themeColors.textSecondary} style={{ transform: [{ rotate: '180deg' }] }} />
          </TouchableOpacity>

          {/* Reviews Section */}
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <Text style={{ fontSize: 20, fontFamily: "Inter_600SemiBold", color: themeColors.textPrimary }}>Reviews</Text>
            <TouchableOpacity onPress={() => setShowReviewForm(true)} style={{ backgroundColor: themeColors.primaryLight, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 }}>
              <Text style={{ color: themeColors.primary, fontFamily: "Inter_600SemiBold", fontSize: 14 }}>Write Review</Text>
            </TouchableOpacity>
          </View>
          
          {foodReviews.map((review) => (
            <View key={review.id} style={{
              backgroundColor: themeColors.cardBg,
              borderRadius: 20,
              padding: 20,
              marginBottom: 16,
              borderWidth: 1,
              borderColor: themeColors.border,
            }}>
              <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}>
                <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: themeColors.primary, justifyContent: "center", alignItems: "center", marginRight: 12 }}>
                  <Text style={{ fontSize: 18, fontFamily: "Inter_600SemiBold", color: "#FFFFFF" }}>{review.name.charAt(0)}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 16, fontFamily: "Inter_600SemiBold", color: themeColors.textPrimary, marginBottom: 4 }}>{review.name}</Text>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={14} color={i < review.rating ? "#F59E0B" : "#D1D5DB"} fill={i < review.rating ? "#F59E0B" : "none"} />
                    ))}
                    <Text style={{ fontSize: 13, fontFamily: "Inter_400Regular", color: themeColors.textSecondary, marginLeft: 8 }}>{review.date}</Text>
                  </View>
                </View>
              </View>
              <Text style={{ fontSize: 15, fontFamily: "Inter_400Regular", color: themeColors.textSecondary, lineHeight: 24 }}>{review.comment}</Text>
            </View>
          ))}
        </View>
      </Animated.ScrollView>

      {/* Floating Bottom Action Bar */}
      <View style={{
        position: 'absolute',
        bottom: insets.bottom > 0 ? insets.bottom : 20,
        left: 20,
        right: 20,
        shadowColor: "#000", shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.15, shadowRadius: 20, elevation: 10,
      }}>
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: isDark ? 'rgba(24, 24, 27, 0.7)' : 'rgba(255, 255, 255, 0.8)',
          borderRadius: 100,
          padding: 8,
          overflow: 'hidden',
        }}>
          <BlurView intensity={isDark ? 40 : 80} tint={isDark ? "dark" : "light"} style={StyleSheet.absoluteFillObject} />
          
          {/* Quantity */}
          <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: isDark ? '#18181B' : '#F1F5F9', borderRadius: 100, padding: 4 }}>
            <TouchableOpacity onPress={() => handleQuantityChange('decrease')} style={styles.qtyBtn}>
              <Minus size={18} color={themeColors.textPrimary} />
            </TouchableOpacity>
            <Text style={{ fontSize: 18, fontFamily: "Inter_600SemiBold", color: themeColors.textPrimary, minWidth: 32, textAlign: 'center' }}>
              {quantity}
            </Text>
            <TouchableOpacity onPress={() => handleQuantityChange('increase')} style={styles.qtyBtn}>
              <Plus size={18} color={themeColors.textPrimary} />
            </TouchableOpacity>
          </View>

          {/* Add to Cart */}
          <TouchableOpacity 
            activeOpacity={0.8}
            onPress={handleAddToCart}
            style={{
              flex: 1,
              backgroundColor: themeColors.primary,
              borderRadius: 100,
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              paddingVertical: 18,
              marginLeft: 12,
            }}
          >
            <Text style={{ fontSize: 15, fontFamily: "Inter_600SemiBold", color: "#FFF", marginRight: 8 }}>
              {isAddingToCart ? 'Adding...' : 'Add to Cart'}
            </Text>
            <Text style={{ fontSize: 15, fontFamily: "Inter_600SemiBold", color: "#FFF" }}>
              ₹{food.price * quantity}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Review Modal */}
      <Modal visible={showReviewForm} animationType="slide" transparent={true} onRequestClose={() => setShowReviewForm(false)}>
        <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.6)", justifyContent: "flex-end" }}>
          <View style={{ backgroundColor: themeColors.cardBg, borderTopLeftRadius: 32, borderTopRightRadius: 32, padding: 24, paddingBottom: insets.bottom + 24 }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <Text style={{ fontSize: 20, fontFamily: "Inter_600SemiBold", color: themeColors.textPrimary }}>Write Review</Text>
              <TouchableOpacity onPress={() => setShowReviewForm(false)} style={{ backgroundColor: isDark ? '#27272A' : '#F1F5F9', padding: 10, borderRadius: 100 }}>
                <Text style={{ fontSize: 14, color: themeColors.textPrimary, fontFamily: "Inter_600SemiBold" }}>Close</Text>
              </TouchableOpacity>
            </View>
            
            <View style={{ alignItems: 'center', marginBottom: 24 }}>
              <Text style={{ fontSize: 16, fontFamily: "Inter_500Medium", color: themeColors.textSecondary, marginBottom: 12 }}>How was the food?</Text>
              <View style={{ flexDirection: "row", gap: 12 }}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <TouchableOpacity key={star} onPress={() => setNewReviewRating(star)}>
                    <Star size={40} color={star <= newReviewRating ? "#F59E0B" : themeColors.border} fill={star <= newReviewRating ? "#F59E0B" : "none"} />
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            
            <TextInput
              style={{
                backgroundColor: isDark ? "#27272A" : "#F8FAFC",
                borderWidth: 1, borderColor: themeColors.border,
                borderRadius: 16, padding: 20, color: themeColors.textPrimary,
                fontFamily: "Inter_400Regular", fontSize: 16, minHeight: 120, textAlignVertical: "top", marginBottom: 24
              }}
              placeholder="Tell us what you loved..."
              placeholderTextColor={themeColors.textSecondary}
              multiline
              value={newReviewComment}
              onChangeText={setNewReviewComment}
            />
            
            <TouchableOpacity onPress={submitReview} style={{ backgroundColor: themeColors.primary, padding: 20, borderRadius: 100, alignItems: "center" }}>
              <Text style={{ color: "#FFFFFF", fontSize: 18, fontFamily: "Inter_600SemiBold" }}>Submit Review</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    overflow: 'hidden',
  },
  blurIcon: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statBox: {
    flex: 1,
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 16,
    fontFamily: "Inter_600SemiBold",
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: "Inter_500Medium",
  },
  qtyBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  }
});