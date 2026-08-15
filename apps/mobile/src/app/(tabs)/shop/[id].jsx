import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
  Pressable,
  Platform,
  Alert,
  Dimensions,
  Animated,
  Modal,
  TextInput,
  StyleSheet
} from "react-native";
import { Image } from "expo-image";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useRouter, useLocalSearchParams, useFocusEffect } from "expo-router";
import { 
  ChevronLeft, 
  Star, 
  MapPin, 
  Plus, 
  Clock, 
  Phone, 
  Users, 
  Heart,
  Share2,
  FileText,
  X
} from "lucide-react-native";
import {
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold
} from "@expo-google-fonts/inter";
import React, { useState, useCallback, useRef } from "react";
import * as Haptics from 'expo-haptics';
import { addToCart, getCartItems } from '../../../utils/cartUtils';
import { allShops, getFoodsByShop } from '../../../data/mockData';
import ToastModal from '../../../components/ui/ToastModal';
import AsyncStorage from '@react-native-async-storage/async-storage';


const reviews = [
  { id: "1", name: "Rahul Singh", rating: 5, comment: "Amazing food quality and quick service. Highly recommended!", date: "2 days ago" },
  { id: "2", name: "Priya Sharma", rating: 4, comment: "Good taste but can improve packaging. Overall satisfied.", date: "1 week ago" },
];

export default function ShopScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const [activeTab, setActiveTab] = useState("Menu");
  
  const [cartItems, setCartItems] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [isLiked, setIsLiked] = useState(false);
  
  const [showMenuModal, setShowMenuModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [lastAddedItem, setLastAddedItem] = useState(null);

  const [shopReviews, setShopReviews] = useState(reviews);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewComment, setNewReviewComment] = useState("");

  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold
  });

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const loadData = async () => {
    try {
      const items = await getCartItems();
      setCartItems(items);
      
      const wData = await AsyncStorage.getItem('wishlistItems');
      if (wData) setWishlistItems(JSON.parse(wData));
      
      const wShopsData = await AsyncStorage.getItem('wishlistShops');
      if (wShopsData) {
        const shops = JSON.parse(wShopsData);
        setIsLiked(shops.includes(id));
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const toggleLikeShop = async () => {
    if (Platform.OS === 'ios') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    try {
      const wShopsData = await AsyncStorage.getItem('wishlistShops');
      let shops = wShopsData ? JSON.parse(wShopsData) : [];
      
      if (isLiked) {
        shops = shops.filter(shopId => shopId !== id);
      } else {
        shops.push(id);
      }
      
      await AsyncStorage.setItem('wishlistShops', JSON.stringify(shops));
      setIsLiked(!isLiked);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddToCart = async (menuItem) => {
    try {
      if (Platform.OS === 'ios') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      
      const foodItem = {
        id: menuItem.id,
        name: menuItem.name,
        image: menuItem.image,
        price: menuItem.price,
        shop: shop.name,
        rating: shop.rating || 4.0,
        description: menuItem.description
      };
      
      const updatedCart = await addToCart(foodItem, 1);
      setCartItems(updatedCart);
      
      setLastAddedItem(foodItem);
      setShowToast(true);
      
    } catch (error) {
      Alert.alert("Error", "Failed to add item to cart. Please try again.");
    }
  };

  if (!fontsLoaded) return null;

  const shop = allShops.find(s => s.id === id);
  const menuItems = getFoodsByShop(id);
  
  if (!shop) return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}><Text>Shop not found</Text></View>
  );

  const tabs = ["Menu", "About", "Reviews"];

  const renderMenuItem = (item) => (
    <TouchableOpacity
      key={item.id}
      onPress={() => router.push(`/(tabs)/food/${item.id}`)}
      style={{ backgroundColor: isDark ? "#1E1E1E" : "#FFFFFF", borderRadius: 20, marginBottom: 16, padding: 16, shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 3 }}
      activeOpacity={0.7}
    >
      <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
        <View style={{ position: "relative", marginRight: 16 }}>
          <Image source={{ uri: item.image }} style={{ width: 100, height: 100, borderRadius: 16 }} contentFit="cover" />
          <View style={{ position: 'absolute', bottom: -10, left: '50%', marginLeft: -30, width: 60, alignItems: 'center', backgroundColor: '#FFF', borderRadius: 100, paddingVertical: 2, shadowColor: '#000', shadowOffset:{width:0, height:2}, shadowOpacity: 0.1, shadowRadius: 4 }}>
             <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Star size={10} color="#F59E0B" fill="#F59E0B" style={{marginRight:2}} />
                <Text style={{ fontSize: 10, fontFamily: 'Inter_600SemiBold', color: '#000' }}>{item.rating}</Text>
             </View>
          </View>
        </View>
        
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 18, fontFamily: "Inter_600SemiBold", color: isDark ? "#FFFFFF" : "#000000", marginBottom: 4 }}>{item.name}</Text>
          <Text style={{ fontSize: 16, fontFamily: "Inter_700Bold", color: "#F59E0B", marginBottom: 8 }}>🪙 {item.price}</Text>
          <Text style={{ fontSize: 13, fontFamily: "Inter_400Regular", color: isDark ? "#D1D5DB" : "#64748B", marginBottom: 12 }} numberOfLines={2}>{item.description}</Text>
          
          <TouchableOpacity onPress={(e) => { e.stopPropagation(); handleAddToCart(item); }} style={{ backgroundColor: "rgba(16, 185, 129, 0.1)", paddingHorizontal: 20, paddingVertical: 8, borderRadius: 100, flexDirection: "row", alignItems: "center", alignSelf: "flex-start", borderWidth: 1, borderColor: '#10B981' }} activeOpacity={0.8}>
            <Plus size={14} color="#10B981" style={{ marginRight: 6 }} />
            <Text style={{ fontSize: 13, fontFamily: "Inter_600SemiBold", color: "#10B981" }}>Add to Cart</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case "Menu":
        return <View>{menuItems.map(renderMenuItem)}</View>;
      case "About":
        return (
          <View style={{ backgroundColor: isDark ? "#1E1E1E" : "#FFFFFF", borderRadius: 20, padding: 24, shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 3 }}>
            
            {/* View Menu Button */}
            <TouchableOpacity onPress={() => setShowMenuModal(true)} style={{ backgroundColor: '#10B981', borderRadius: 16, padding: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 24, shadowColor: '#10B981', shadowOffset: {width:0, height:4}, shadowOpacity: 0.3, shadowRadius: 8 }} activeOpacity={0.8}>
              <FileText size={20} color="#FFF" style={{ marginRight: 8 }} />
              <Text style={{ fontSize: 16, fontFamily: 'Inter_600SemiBold', color: '#FFF' }}>View Full Menu</Text>
            </TouchableOpacity>

            <Text style={{ fontSize: 15, fontFamily: "Inter_400Regular", color: isDark ? "#E5E7EB" : "#374151", lineHeight: 24, marginBottom: 24 }}>{shop.description}</Text>
            
            <View style={{ marginBottom: 16 }}>
              <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 8 }}>
                <Clock size={16} color={isDark ? "#9CA3AF" : "#6B7280"} />
                <Text style={{ fontSize: 14, fontFamily: "Inter_600SemiBold", color: isDark ? "#FFFFFF" : "#000000", marginLeft: 8 }}>Open Hours</Text>
              </View>
              <Text style={{ fontSize: 14, fontFamily: "Inter_500Medium", color: isDark ? "#E5E7EB" : "#64748B", marginLeft: 24 }}>{shop.openHours}</Text>
            </View>
            <View>
              <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 8 }}>
                <Phone size={16} color={isDark ? "#9CA3AF" : "#6B7280"} />
                <Text style={{ fontSize: 14, fontFamily: "Inter_600SemiBold", color: isDark ? "#FFFFFF" : "#000000", marginLeft: 8 }}>Contact</Text>
              </View>
              <Text style={{ fontSize: 14, fontFamily: "Inter_500Medium", color: isDark ? "#E5E7EB" : "#64748B", marginLeft: 24 }}>{shop.contact}</Text>
            </View>
          </View>
        );
      case "Reviews":
        return <View><Text>Reviews temporarily disabled in this view.</Text></View>;
      default: return null;
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: isDark ? "#000000" : "#F8FAFC" }}>
      <StatusBar style="light" />

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: insets.bottom + 20 }} showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <View style={{ position: "relative", height: 320 }}>
          <Image source={{ uri: shop.image }} style={{ width: "100%", height: 320 }} contentFit="cover" />
          <View style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0, 0, 0, 0.4)" }} />
          
          <View style={{ position: "absolute", top: insets.top + 16, left: 20, right: 20, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
            <TouchableOpacity onPress={() => router.back()} style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: "rgba(255, 255, 255, 0.2)", justifyContent: "center", alignItems: "center", borderWidth: 1, borderColor: "rgba(255,255,255,0.3)" }}>
              <ChevronLeft size={20} color="#FFFFFF" />
            </TouchableOpacity>
            
            <View style={{ flexDirection: "row", gap: 12 }}>
              <TouchableOpacity onPress={toggleLikeShop} style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: "rgba(255, 255, 255, 0.2)", justifyContent: "center", alignItems: "center", borderWidth: 1, borderColor: "rgba(255,255,255,0.3)" }}>
                <Heart size={18} color={isLiked ? "#EF4444" : "#FFFFFF"} fill={isLiked ? "#EF4444" : "none"} />
              </TouchableOpacity>
              <TouchableOpacity style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: "rgba(255, 255, 255, 0.2)", justifyContent: "center", alignItems: "center", borderWidth: 1, borderColor: "rgba(255,255,255,0.3)" }}>
                <Share2 size={18} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>
          
          <View style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: 24 }}>
            <Text style={{ fontSize: 32, fontFamily: "Inter_700Bold", color: "#FFFFFF", marginBottom: 12 }}>{shop.name}</Text>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <View style={{ flexDirection: "row", alignItems: "center", backgroundColor: "#10B981", paddingHorizontal: 10, paddingVertical: 6, borderRadius: 100, marginRight: 12 }}>
                <Star size={12} color="#FFFFFF" fill="#FFFFFF" />
                <Text style={{ fontSize: 13, fontFamily: "Inter_600SemiBold", color: "#FFFFFF", marginLeft: 4 }}>{shop.rating}</Text>
              </View>
              <View style={{ flexDirection: "row", alignItems: "center", backgroundColor: "rgba(255, 255, 255, 0.2)", paddingHorizontal: 10, paddingVertical: 6, borderRadius: 100 }}>
                <MapPin size={12} color="#FFFFFF" />
                <Text style={{ fontSize: 13, fontFamily: "Inter_500Medium", color: "#FFFFFF", marginLeft: 4 }}>{shop.location}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Content */}
        <View style={{ paddingHorizontal: 20, paddingTop: 24 }}>
          
          {/* Quick Stats */}
          <View style={{ flexDirection: "row", backgroundColor: isDark ? "#1E1E1E" : "#FFFFFF", borderRadius: 20, padding: 16, marginBottom: 24, shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 3 }}>
            <View style={{ flex: 1, alignItems: "center" }}>
              <Clock size={20} color="#10B981" />
              <Text style={{ fontSize: 13, fontFamily: "Inter_600SemiBold", color: "#10B981", marginTop: 6 }}>25-30 min</Text>
            </View>
            <View style={{ width: 1, backgroundColor: isDark ? "#374151" : "#E2E8F0" }} />
            <View style={{ flex: 1, alignItems: "center" }}>
               {shop.isNonVeg ? (
                 <>
                   <View style={{ width: 20, height: 20, borderRadius: 4, borderWidth: 1, borderColor: '#EF4444', justifyContent: 'center', alignItems: 'center' }}>
                     <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: '#EF4444' }} />
                   </View>
                   <Text style={{ fontSize: 13, fontFamily: "Inter_600SemiBold", color: "#EF4444", marginTop: 6 }}>Non-Veg</Text>
                 </>
               ) : (
                 <>
                   <View style={{ width: 20, height: 20, borderRadius: 4, borderWidth: 1, borderColor: '#10B981', justifyContent: 'center', alignItems: 'center' }}>
                     <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: '#10B981' }} />
                   </View>
                   <Text style={{ fontSize: 13, fontFamily: "Inter_600SemiBold", color: "#10B981", marginTop: 6 }}>Pure Veg</Text>
                 </>
               )}
            </View>
          </View>

          {/* Tabs */}
          <View style={{ flexDirection: "row", backgroundColor: isDark ? "#1E1E1E" : "#F1F5F9", borderRadius: 100, padding: 4, marginBottom: 20 }}>
            {tabs.map((tab) => (
              <TouchableOpacity key={tab} onPress={() => setActiveTab(tab)} style={{ flex: 1, paddingVertical: 12, borderRadius: 100, backgroundColor: activeTab === tab ? (isDark ? "#374151" : "#FFFFFF") : "transparent", alignItems: "center", shadowColor: activeTab === tab ? "#000" : "transparent", shadowOffset: {width:0, height:2}, shadowOpacity: activeTab === tab ? 0.05 : 0, shadowRadius: 4 }} activeOpacity={0.7}>
                <Text style={{ fontSize: 14, fontFamily: "Inter_600SemiBold", color: activeTab === tab ? (isDark ? "#FFFFFF" : "#000000") : (isDark ? "#9CA3AF" : "#64748B") }}>{tab}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {renderTabContent()}
        </View>
      </ScrollView>

      {/* Menu Modal */}
      <Modal visible={showMenuModal} transparent={true} animationType="fade" onRequestClose={() => setShowMenuModal(false)}>
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.9)', justifyContent: 'center', alignItems: 'center' }}>
          <TouchableOpacity style={{ position: 'absolute', top: insets.top + 20, right: 20, zIndex: 10, width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center' }} onPress={() => setShowMenuModal(false)}>
            <X size={24} color="#FFF" />
          </TouchableOpacity>
          <Image source={{ uri: shop.menuImage }} style={{ width: width, height: Dimensions.get('window').height * 0.7 }} contentFit="contain" />
        </View>
      </Modal>

      {/* Global Toast */}
      <ToastModal visible={showToast} item={lastAddedItem} onClose={() => setShowToast(false)} />
    </View>
  );
}