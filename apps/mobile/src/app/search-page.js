import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  Platform,
  Alert,
} from "react-native";
import { Image } from "expo-image";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useRouter, useLocalSearchParams } from "expo-router";
import { 
  Search, 
  ArrowLeft, 
  Clock, 
  X, 
  TrendingUp,
  Coffee,
  Store
} from "lucide-react-native";
import {
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
} from "@expo-google-fonts/inter";
import { useState, useEffect } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';

// Dummy trending foods data
const trendingFoods = [
  {
    id: "t1",
    name: "Butter Chicken",
    image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=200&h=200&fit=crop",
    orders: "125+ orders today"
  },
  {
    id: "t2",
    name: "Margherita Pizza",
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=200&h=200&fit=crop",
    orders: "98+ orders today"
  },
  {
    id: "t3",
    name: "Cold Coffee",
    image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=200&h=200&fit=crop",
    orders: "87+ orders today"
  },
  {
    id: "t4",
    name: "Chicken Biryani",
    image: "https://images.unsplash.com/photo-1563379091339-03246963d29b?w=200&h=200&fit=crop",
    orders: "76+ orders today"
  },
  {
    id: "t5",
    name: "Veg Momos",
    image: "https://images.unsplash.com/photo-1496412705862-e0088f16f791?w=200&h=200&fit=crop",
    orders: "65+ orders today"
  },
];

// Dummy trending shops data
const trendingShops = [
  {
    id: "ts1",
    name: "Cafe Beans",
    image: "https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=200&h=200&fit=crop",
    orders: "200+ orders today",
    location: "Block A"
  },
  {
    id: "ts2",
    name: "Pizza Corner",
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=200&h=200&fit=crop",
    orders: "180+ orders today",
    location: "Food Court"
  },
  {
    id: "ts3",
    name: "Burger Hub",
    image: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=200&h=200&fit=crop",
    orders: "150+ orders today",
    location: "Block B"
  },
  {
    id: "ts4",
    name: "Momos Point",
    image: "https://images.unsplash.com/photo-1496412705862-e0088f16f791?w=200&h=200&fit=crop",
    orders: "120+ orders today",
    location: "BH1"
  },
];

export default function SearchPage() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { mode } = useLocalSearchParams();
  
  const [searchText, setSearchText] = useState("");
  const [searchHistory, setSearchHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
  });

  // Load search history from AsyncStorage
  useEffect(() => {
    loadSearchHistory();
  }, []);

  const loadSearchHistory = async () => {
    try {
      const history = await AsyncStorage.getItem('searchHistory');
      if (history) {
        const parsedHistory = JSON.parse(history);
        setSearchHistory(parsedHistory);
      }
    } catch (error) {
      console.error('Error loading search history:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveSearchHistory = async (newHistory) => {
    try {
      await AsyncStorage.setItem('searchHistory', JSON.stringify(newHistory));
    } catch (error) {
      console.error('Error saving search history:', error);
    }
  };

  const addToSearchHistory = async (query) => {
    if (!query.trim()) return;
    
    const newEntry = {
      id: Date.now().toString(),
      query: query.trim(),
      mode: mode || 'food',
      timestamp: new Date().toISOString(),
    };
    
    // Remove duplicate if exists and add to beginning
    const filteredHistory = searchHistory.filter(item => 
      item.query.toLowerCase() !== query.toLowerCase().trim()
    );
    
    const newHistory = [newEntry, ...filteredHistory].slice(0, 10); // Keep only last 10
    setSearchHistory(newHistory);
    await saveSearchHistory(newHistory);
  };

  const removeFromHistory = async (id) => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    const newHistory = searchHistory.filter(item => item.id !== id);
    setSearchHistory(newHistory);
    await saveSearchHistory(newHistory);
  };

  const clearAllHistory = () => {
    Alert.alert(
      "Clear Search History",
      "Are you sure you want to clear all search history?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Clear",
          style: "destructive",
          onPress: async () => {
            setSearchHistory([]);
            await saveSearchHistory([]);
            if (Platform.OS === 'ios') {
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            }
          }
        }
      ]
    );
  };

  const handleSearch = async () => {
    if (searchText.trim()) {
      await addToSearchHistory(searchText);
      // Navigate back to search tab with the query
      router.push({
        pathname: "/(tabs)/search",
        params: { 
          q: searchText.trim(),
          mode: mode || 'food'
        }
      });
    }
  };

  const handleHistoryItemPress = async (query) => {
    await addToSearchHistory(query);
    router.push({
      pathname: "/(tabs)/search",
      params: { 
        q: query,
        mode: mode || 'food'
      }
    });
  };

  const handleTrendingItemPress = async (name) => {
    await addToSearchHistory(name);
    router.push({
      pathname: "/(tabs)/search",
      params: { 
        q: name,
        mode: mode || 'food'
      }
    });
  };

  if (!fontsLoaded || isLoading) {
    return (
      <View style={{ 
        flex: 1, 
        backgroundColor: isDark ? "#121212" : "#F8FDF8",
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <Text style={{ color: isDark ? "#FFFFFF" : "#000000" }}>Loading...</Text>
      </View>
    );
  }

  const currentTrending = mode === 'shop' ? trendingShops : trendingFoods;
  const hasHistory = searchHistory.length > 0;

  return (
    <View style={{ 
      flex: 1, 
      backgroundColor: isDark ? "#121212" : "#F8FDF8",
    }}>
      <StatusBar style={isDark ? "light" : "dark"} />

      {/* Header */}
      <View
        style={{
          paddingTop: insets.top + 16,
          paddingHorizontal: 20,
          paddingBottom: 16,
          backgroundColor: isDark ? "#121212" : "#F8FDF8",
          borderBottomWidth: 1,
          borderBottomColor: isDark ? "#1E1E1E" : "#E5E7EB",
        }}
      >
        {/* Header with back button */}
        <View style={{ 
          flexDirection: "row", 
          alignItems: "center", 
          marginBottom: 16 
        }}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={{
              padding: 8,
              marginRight: 8,
              borderRadius: 12,
            }}
            activeOpacity={0.7}
          >
            <ArrowLeft size={24} color={isDark ? "#FFFFFF" : "#000000"} />
          </TouchableOpacity>
          
          <Text style={{
            fontSize: 20,
            fontFamily: "Inter_600SemiBold",
            color: isDark ? "#FFFFFF" : "#000000",
            flex: 1,
          }}>
            Search {mode === 'shop' ? 'Shops' : 'Food'}
          </Text>
        </View>

        {/* Search Input */}
        <View style={{
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: isDark ? "#1E1E1E" : "#FFFFFF",
          borderRadius: 16,
          paddingHorizontal: 16,
          paddingVertical: 12,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 3,
        }}>
          <Search size={20} color={isDark ? "#9CA3AF" : "#6B7280"} />
          <TextInput
            style={{
              flex: 1,
              marginLeft: 12,
              fontSize: 16,
              fontFamily: "Inter_400Regular",
              color: isDark ? "#FFFFFF" : "#000000",
            }}
            placeholder={mode === 'shop' ? "Search for shops..." : "Search for food items..."}
            placeholderTextColor={isDark ? "#9CA3AF" : "#6B7280"}
            value={searchText}
            onChangeText={setSearchText}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
            autoFocus={true}
          />
          {searchText.length > 0 && (
            <TouchableOpacity
              onPress={() => setSearchText("")}
              style={{ padding: 4 }}
            >
              <X size={16} color={isDark ? "#9CA3AF" : "#6B7280"} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView 
        style={{ flex: 1 }}
        contentContainerStyle={{ 
          paddingHorizontal: 20,
          paddingBottom: insets.bottom + 20 
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Past Searches Section */}
        {hasHistory ? (
          <View style={{ marginTop: 24 }}>
            <View style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 16,
            }}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Clock size={20} color={isDark ? "#9CA3AF" : "#6B7280"} />
                <Text style={{
                  fontSize: 18,
                  fontFamily: "Inter_600SemiBold",
                  color: isDark ? "#FFFFFF" : "#000000",
                  marginLeft: 8,
                }}>
                  Past Searches
                </Text>
              </View>
              
              <TouchableOpacity
                onPress={clearAllHistory}
                style={{
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  borderRadius: 8,
                }}
                activeOpacity={0.7}
              >
                <Text style={{
                  fontSize: 14,
                  fontFamily: "Inter_500Medium",
                  color: isDark ? "#9CA3AF" : "#6B7280",
                }}>
                  Clear All
                </Text>
              </TouchableOpacity>
            </View>

            {/* Search History List */}
            {searchHistory.map((item) => (
              <TouchableOpacity
                key={item.id}
                onPress={() => handleHistoryItemPress(item.query)}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  paddingVertical: 12,
                  paddingHorizontal: 16,
                  backgroundColor: isDark ? "#1E1E1E" : "#FFFFFF",
                  borderRadius: 12,
                  marginBottom: 8,
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.05,
                  shadowRadius: 4,
                  elevation: 2,
                }}
                activeOpacity={0.7}
              >
                <Clock size={16} color={isDark ? "#9CA3AF" : "#6B7280"} />
                <Text style={{
                  flex: 1,
                  marginLeft: 12,
                  fontSize: 16,
                  fontFamily: "Inter_400Regular",
                  color: isDark ? "#FFFFFF" : "#000000",
                }}>
                  {item.query}
                </Text>
                
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  {item.mode === 'shop' ? (
                    <Store size={14} color={isDark ? "#9CA3AF" : "#6B7280"} style={{ marginRight: 8 }} />
                  ) : (
                    <Coffee size={14} color={isDark ? "#9CA3AF" : "#6B7280"} style={{ marginRight: 8 }} />
                  )}
                  
                  <TouchableOpacity
                    onPress={() => removeFromHistory(item.id)}
                    style={{
                      padding: 4,
                      borderRadius: 4,
                    }}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  >
                    <X size={16} color={isDark ? "#9CA3AF" : "#6B7280"} />
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          /* Most Ordered on Campus Section (when no history) */
          <View style={{ marginTop: 24 }}>
            <View style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 16,
            }}>
              <TrendingUp size={20} color={"#22C55E"} />
              <Text style={{
                fontSize: 18,
                fontFamily: "Inter_600SemiBold",
                color: isDark ? "#FFFFFF" : "#000000",
                marginLeft: 8,
              }}>
                Most Ordered on Campus
              </Text>
            </View>

            {/* Trending Items List */}
            {currentTrending.map((item) => (
              <TouchableOpacity
                key={item.id}
                onPress={() => handleTrendingItemPress(item.name)}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  paddingVertical: 12,
                  paddingHorizontal: 16,
                  backgroundColor: isDark ? "#1E1E1E" : "#FFFFFF",
                  borderRadius: 12,
                  marginBottom: 12,
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
                    width: 50,
                    height: 50,
                    borderRadius: 8,
                    marginRight: 12,
                  }}
                  contentFit="cover"
                />
                
                <View style={{ flex: 1 }}>
                  <Text style={{
                    fontSize: 16,
                    fontFamily: "Inter_600SemiBold",
                    color: isDark ? "#FFFFFF" : "#000000",
                    marginBottom: 2,
                  }}>
                    {item.name}
                  </Text>
                  
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <TrendingUp size={12} color={"#22C55E"} style={{ marginRight: 4 }} />
                    <Text style={{
                      fontSize: 14,
                      fontFamily: "Inter_400Regular",
                      color: "#22C55E",
                      marginRight: 8,
                    }}>
                      {item.orders}
                    </Text>
                    
                    {item.location && (
                      <Text style={{
                        fontSize: 14,
                        fontFamily: "Inter_400Regular",
                        color: isDark ? "#9CA3AF" : "#6B7280",
                      }}>
                        • {item.location}
                      </Text>
                    )}
                  </View>
                </View>
                
                {mode === 'shop' ? (
                  <Store size={16} color={isDark ? "#9CA3AF" : "#6B7280"} />
                ) : (
                  <Coffee size={16} color={isDark ? "#9CA3AF" : "#6B7280"} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}