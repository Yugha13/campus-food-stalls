import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
  Pressable,
} from "react-native";
import { Image } from "expo-image";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useRouter, useLocalSearchParams } from "expo-router";
import { ChevronLeft, Star, MapPin, Plus, Clock, Phone, Users } from "lucide-react-native";
import {
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
} from "@expo-google-fonts/inter";
import { useState } from "react";

// Dummy data
const shopsData = {
  "1": {
    id: "1",
    name: "Cafe Beans",
    image: "https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=600&h=400&fit=crop",
    rating: 4.5,
    location: "Block A, LPU Campus",
    description: "A cozy cafe serving freshly brewed coffee and light snacks. Perfect spot for students to study and relax.",
    openHours: "7:00 AM - 9:00 PM",
    contact: "+91 9876543210",
    menu: [
      {
        id: "1",
        name: "Cold Coffee",
        image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&h=300&fit=crop",
        price: 120,
        description: "Refreshing cold coffee with ice cream",
      },
      {
        id: "2",
        name: "Cappuccino",
        image: "https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400&h=300&fit=crop",
        price: 100,
        description: "Classic cappuccino with frothy milk",
      },
      {
        id: "3",
        name: "Sandwich",
        image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400&h=300&fit=crop",
        price: 80,
        description: "Grilled sandwich with fresh vegetables",
      },
    ]
  },
  "2": {
    id: "2",
    name: "Pizza Corner",
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&h=400&fit=crop",
    rating: 4.3,
    location: "Food Court, LPU Campus",
    description: "Authentic Italian pizzas made with fresh ingredients. Wide variety of toppings available.",
    openHours: "11:00 AM - 10:00 PM",
    contact: "+91 9876543211",
    menu: [
      {
        id: "4",
        name: "Margherita Pizza",
        image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=300&fit=crop",
        price: 180,
        description: "Classic pizza with tomato sauce and mozzarella",
      },
      {
        id: "5",
        name: "Pepperoni Pizza",
        image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop",
        price: 250,
        description: "Spicy pepperoni with cheese and herbs",
      },
    ]
  },
  "3": {
    id: "3",
    name: "Burger Hub",
    image: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=600&h=400&fit=crop",
    rating: 4.7,
    location: "Block B, LPU Campus",
    description: "Juicy burgers made with fresh ingredients. Variety of options for both veg and non-veg lovers.",
    openHours: "10:00 AM - 11:00 PM",
    contact: "+91 9876543212",
    menu: [
      {
        id: "6",
        name: "Crispy Burger",
        image: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400&h=300&fit=crop",
        price: 150,
        description: "Crispy chicken patty with lettuce and mayo",
      },
      {
        id: "7",
        name: "Cheese Burger",
        image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop",
        price: 120,
        description: "Juicy beef patty with melted cheese",
      },
    ]
  },
  "4": {
    id: "4",
    name: "Momos Point",
    image: "https://images.unsplash.com/photo-1496412705862-e0088f16f791?w=600&h=400&fit=crop",
    rating: 4.4,
    location: "Main Gate, LPU Campus",
    description: "Steamed and fried momos with authentic Tibetan flavors. Variety of fillings available.",
    openHours: "12:00 PM - 9:00 PM",
    contact: "+91 9876543213",
    menu: [
      {
        id: "8",
        name: "Chicken Momos",
        image: "https://images.unsplash.com/photo-1496412705862-e0088f16f791?w=400&h=300&fit=crop",
        price: 80,
        description: "Steamed chicken momos with spicy sauce",
      },
      {
        id: "9",
        name: "Veg Momos",
        image: "https://images.unsplash.com/photo-1496412705862-e0088f16f791?w=400&h=300&fit=crop",
        price: 60,
        description: "Fresh vegetable momos with herbs",
      },
    ]
  },
};

const reviews = [
  {
    id: "1",
    name: "Rahul Singh",
    rating: 5,
    comment: "Amazing food quality and quick service. Highly recommended!",
    date: "2 days ago",
  },
  {
    id: "2",
    name: "Priya Sharma",
    rating: 4,
    comment: "Good taste but can improve packaging. Overall satisfied.",
    date: "1 week ago",
  },
  {
    id: "3",
    name: "Amit Kumar",
    rating: 4,
    comment: "Nice ambiance and friendly staff. Will visit again.",
    date: "2 weeks ago",
  },
];

export default function ShopScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const [activeTab, setActiveTab] = useState("Menu");
  const [orderType, setOrderType] = useState("Pickup");

  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
  });

  if (!fontsLoaded) {
    return null;
  }

  const shop = shopsData[id];
  
  if (!shop) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Shop not found</Text>
      </View>
    );
  }

  const tabs = ["Menu", "About", "Reviews"];

  const renderMenuItem = (item) => (
    <TouchableOpacity
      key={item.id}
      onPress={() => router.push(`/(tabs)/food/${item.id}`)}
      style={{
        flexDirection: "row",
        backgroundColor: isDark ? "#1E1E1E" : "#FFFFFF",
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
      }}
      activeOpacity={0.7}
    >
      <Image
        source={{ uri: item.image }}
        style={{
          width: 80,
          height: 80,
          borderRadius: 12,
          marginRight: 16,
        }}
        contentFit="cover"
      />
      <View style={{ flex: 1 }}>
        <Text
          style={{
            fontSize: 16,
            fontFamily: "Inter_600SemiBold",
            color: isDark ? "#FFFFFF" : "#000000",
            marginBottom: 4,
          }}
        >
          {item.name}
        </Text>
        <Text
          style={{
            fontSize: 14,
            fontFamily: "Inter_500Medium",
            color: "#22C55E",
            marginBottom: 4,
          }}
        >
          ₹{item.price}
        </Text>
        <Text
          style={{
            fontSize: 12,
            fontFamily: "Inter_400Regular",
            color: isDark ? "#9CA3AF" : "#6B7280",
            lineHeight: 16,
          }}
        >
          {item.description}
        </Text>
      </View>
      <TouchableOpacity
        style={{
          backgroundColor: "#22C55E",
          borderRadius: 12,
          paddingVertical: 8,
          paddingHorizontal: 12,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          alignSelf: "center",
        }}
        activeOpacity={0.8}
      >
        <Plus size={16} color="#FFFFFF" />
        <Text
          style={{
            fontSize: 12,
            fontFamily: "Inter_600SemiBold",
            color: "#FFFFFF",
            marginLeft: 4,
          }}
        >
          Add
        </Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const renderReview = (review) => (
    <View
      key={review.id}
      style={{
        backgroundColor: isDark ? "#1E1E1E" : "#FFFFFF",
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 8 }}>
        <View
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: "#22C55E",
            justifyContent: "center",
            alignItems: "center",
            marginRight: 12,
          }}
        >
          <Text
            style={{
              fontSize: 16,
              fontFamily: "Inter_600SemiBold",
              color: "#FFFFFF",
            }}
          >
            {review.name.charAt(0)}
          </Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text
            style={{
              fontSize: 14,
              fontFamily: "Inter_600SemiBold",
              color: isDark ? "#FFFFFF" : "#000000",
              marginBottom: 2,
            }}
          >
            {review.name}
          </Text>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={12}
                color={i < review.rating ? "#F59E0B" : "#D1D5DB"}
                fill={i < review.rating ? "#F59E0B" : "none"}
              />
            ))}
            <Text
              style={{
                fontSize: 12,
                fontFamily: "Inter_400Regular",
                color: isDark ? "#9CA3AF" : "#6B7280",
                marginLeft: 8,
              }}
            >
              {review.date}
            </Text>
          </View>
        </View>
      </View>
      <Text
        style={{
          fontSize: 14,
          fontFamily: "Inter_400Regular",
          color: isDark ? "#E5E7EB" : "#374151",
          lineHeight: 20,
        }}
      >
        {review.comment}
      </Text>
    </View>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case "Menu":
        return (
          <View>
            {shop.menu.map(renderMenuItem)}
          </View>
        );
      case "About":
        return (
          <View
            style={{
              backgroundColor: isDark ? "#1E1E1E" : "#FFFFFF",
              borderRadius: 16,
              padding: 20,
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
                fontFamily: "Inter_400Regular",
                color: isDark ? "#E5E7EB" : "#374151",
                lineHeight: 24,
                marginBottom: 20,
              }}
            >
              {shop.description}
            </Text>
            
            <View style={{ marginBottom: 16 }}>
              <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 8 }}>
                <Clock size={16} color={isDark ? "#9CA3AF" : "#6B7280"} />
                <Text
                  style={{
                    fontSize: 14,
                    fontFamily: "Inter_600SemiBold",
                    color: isDark ? "#FFFFFF" : "#000000",
                    marginLeft: 8,
                  }}
                >
                  Open Hours
                </Text>
              </View>
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: "Inter_400Regular",
                  color: isDark ? "#E5E7EB" : "#374151",
                  marginLeft: 24,
                }}
              >
                {shop.openHours}
              </Text>
            </View>

            <View>
              <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 8 }}>
                <Phone size={16} color={isDark ? "#9CA3AF" : "#6B7280"} />
                <Text
                  style={{
                    fontSize: 14,
                    fontFamily: "Inter_600SemiBold",
                    color: isDark ? "#FFFFFF" : "#000000",
                    marginLeft: 8,
                  }}
                >
                  Contact
                </Text>
              </View>
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: "Inter_400Regular",
                  color: isDark ? "#E5E7EB" : "#374151",
                  marginLeft: 24,
                }}
              >
                {shop.contact}
              </Text>
            </View>
          </View>
        );
      case "Reviews":
        return (
          <View>
            {reviews.map(renderReview)}
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: isDark ? "#121212" : "#F8FDF8" }}>
      <StatusBar style={isDark ? "light" : "dark"} />

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingBottom: insets.bottom + 20,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Image */}
        <View style={{ position: "relative" }}>
          <Image
            source={{ uri: shop.image }}
            style={{
              width: "100%",
              height: 250,
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

        {/* Shop Info */}
        <View style={{ paddingHorizontal: 20, paddingTop: 20 }}>
          <Text
            style={{
              fontSize: 24,
              fontFamily: "Inter_600SemiBold",
              color: isDark ? "#FFFFFF" : "#000000",
              marginBottom: 8,
            }}
          >
            {shop.name}
          </Text>
          
          <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 4 }}>
            <Star size={16} color="#F59E0B" fill="#F59E0B" />
            <Text
              style={{
                fontSize: 16,
                fontFamily: "Inter_500Medium",
                color: isDark ? "#E5E7EB" : "#374151",
                marginLeft: 6,
              }}
            >
              {shop.rating}
            </Text>
          </View>
          
          <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 20 }}>
            <MapPin size={14} color={isDark ? "#9CA3AF" : "#6B7280"} />
            <Text
              style={{
                fontSize: 14,
                fontFamily: "Inter_400Regular",
                color: isDark ? "#9CA3AF" : "#6B7280",
                marginLeft: 6,
              }}
            >
              {shop.location}
            </Text>
          </View>

          {/* Order Type Toggle */}
          <View
            style={{
              backgroundColor: isDark ? "#1E1E1E" : "#F3F4F6",
              borderRadius: 16,
              padding: 4,
              flexDirection: "row",
              marginBottom: 24,
            }}
          >
            {["Pickup", "Dine-in"].map((type) => (
              <TouchableOpacity
                key={type}
                onPress={() => setOrderType(type)}
                style={{
                  flex: 1,
                  paddingVertical: 12,
                  paddingHorizontal: 16,
                  borderRadius: 12,
                  backgroundColor: orderType === type 
                    ? "#22C55E" 
                    : "transparent",
                  alignItems: "center",
                }}
                activeOpacity={0.7}
              >
                <Text
                  style={{
                    fontSize: 14,
                    fontFamily: "Inter_600SemiBold",
                    color: orderType === type 
                      ? "#FFFFFF" 
                      : isDark ? "#9CA3AF" : "#6B7280",
                  }}
                >
                  {type}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Tabs */}
          <View
            style={{
              flexDirection: "row",
              backgroundColor: isDark ? "#1E1E1E" : "#F3F4F6",
              borderRadius: 16,
              padding: 4,
              marginBottom: 20,
            }}
          >
            {tabs.map((tab) => (
              <TouchableOpacity
                key={tab}
                onPress={() => setActiveTab(tab)}
                style={{
                  flex: 1,
                  paddingVertical: 12,
                  paddingHorizontal: 16,
                  borderRadius: 12,
                  backgroundColor: activeTab === tab 
                    ? isDark ? "#FFFFFF" : "#FFFFFF"
                    : "transparent",
                  alignItems: "center",
                }}
                activeOpacity={0.7}
              >
                <Text
                  style={{
                    fontSize: 14,
                    fontFamily: "Inter_600SemiBold",
                    color: activeTab === tab 
                      ? "#000000"
                      : isDark ? "#9CA3AF" : "#6B7280",
                  }}
                >
                  {tab}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Tab Content */}
          {renderTabContent()}
        </View>
      </ScrollView>
    </View>
  );
}