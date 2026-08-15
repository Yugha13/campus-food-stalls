import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  Platform,
  Alert,
  FlatList,
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
  Store,
  ArrowUpRight
} from "lucide-react-native";
import {
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
} from "@expo-google-fonts/inter";
import { useState, useEffect, useRef, useCallback } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';

import { allShops, allFoods } from './../data/mockData';

// Get trending foods from centralized data with safety check
const trendingFoods = (allFoods && allFoods.length > 0) 
  ? allFoods.slice(0, 5).map(food => ({
      id: food.id,
      name: food.name,
      image: food.image,
      orders: `${Math.floor(Math.random() * 50) + 20}+ orders today`
    }))
  : [];

// Get trending shops from centralized data with safety check
const trendingShops = (allShops && allShops.length > 0)
  ? allShops.slice(0, 4).map(shop => ({
      id: shop.id,
      name: shop.name,
      image: shop.image,
      orders: `${Math.floor(Math.random() * 150) + 50}+ orders today`,
      location: shop.location
    }))
  : [];

export default function SearchPage() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { mode } = useLocalSearchParams();
  
  const [searchText, setSearchText] = useState("");
  const [searchHistory, setSearchHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Smart suggestions state
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const debounceRef = useRef(null);
  
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
  });

  // Load search history from AsyncStorage
  useEffect(() => {
    loadSearchHistory();
  }, []);

  // Debounced search suggestions - Mode specific
  const generateSuggestions = useCallback((query) => {
    if (!query.trim()) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const searchLower = query.toLowerCase();
    let suggestionsArray = [];

    if (mode === 'shop') {
      // Only shop suggestions when in shop mode
      if (allShops && allShops.length > 0) {
        const shopSuggestions = allShops
          .filter(shop => 
            shop.name.toLowerCase().includes(searchLower) ||
            shop.location.toLowerCase().includes(searchLower)
          )
          .map(shop => ({
            id: `shop-${shop.id}`,
            type: 'shop',
            text: shop.name,
            subtitle: `Shop • ${shop.location}`,
            image: shop.image,
            data: shop
          }));
        suggestionsArray = shopSuggestions;
      }
    } else {
      // Only food suggestions when in food mode (default)
      if (allFoods && allFoods.length > 0) {
        const foodSuggestions = allFoods
          .filter(food => 
            food.name.toLowerCase().includes(searchLower) ||
            food.shop.toLowerCase().includes(searchLower)
          )
          .map(food => ({
            id: `food-${food.id}`,
            type: 'food',
            text: food.name,
            subtitle: `${food.shop} • 🪙 ${food.price}`,
            image: food.image,
            data: food
          }));
        suggestionsArray = foodSuggestions;
      }
    }

    // Limit to 6 suggestions
    suggestionsArray = suggestionsArray.slice(0, 6);
    
    setSuggestions(suggestionsArray);
    setShowSuggestions(suggestionsArray.length > 0);
  }, [mode]);

  // Debounced search effect
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    
    debounceRef.current = setTimeout(() => {
      generateSuggestions(searchText);
    }, 300);
    
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [searchText, generateSuggestions]);

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

  const handleSearch = async (query = searchText) => {
    if (query.trim()) {
      await addToSearchHistory(query);
      setShowSuggestions(false);
      // Navigate to search results page
      router.push({
        pathname: "/search-results",
        params: { 
          q: query.trim(),
          mode: mode || 'food'
        }
      });
    }
  };

  const handleSuggestionSelect = async (suggestion) => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    setSearchText(suggestion.text);
    setShowSuggestions(false);
    await handleSearch(suggestion.text);
  };

  const handleInputChange = (text) => {
    setSearchText(text);
    if (!text.trim()) {
      setShowSuggestions(false);
    }
  };

  const handleHistoryItemPress = async (query) => {
    await addToSearchHistory(query);
    router.push({
      pathname: "/search-results",
      params: { 
        q: query,
        mode: mode || 'food'
      }
    });
  };

  const handleTrendingItemPress = async (name) => {
    await addToSearchHistory(name);
    router.push({
      pathname: "/search-results",
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
            onChangeText={handleInputChange}
            onSubmitEditing={() => handleSearch()}
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

      {/* Smart Suggestions Overlay */}
      {showSuggestions && suggestions.length > 0 && (
        <View style={{
          position: 'absolute',
          top: insets.top + 120, // Below header
          left: 20,
          right: 20,
          backgroundColor: isDark ? "#1E1E1E" : "#FFFFFF",
          borderRadius: 16,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.15,
          shadowRadius: 12,
          elevation: 8,
          zIndex: 1000,
          maxHeight: 300,
        }}>
          <FlatList
            data={suggestions}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            renderItem={({ item, index }) => (
              <TouchableOpacity
                onPress={() => handleSuggestionSelect(item)}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  paddingVertical: 12,
                  paddingHorizontal: 16,
                  borderBottomWidth: index < suggestions.length - 1 ? 1 : 0,
                  borderBottomColor: isDark ? "#2D3748" : "#F3F4F6",
                }}
                activeOpacity={0.7}
              >
                <Image
                  source={{ uri: item.image }}
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 8,
                    marginRight: 12,
                  }}
                  contentFit="cover"
                />
                
                <View style={{ flex: 1 }}>
                  <Text style={{
                    fontSize: 16,
                    fontFamily: "Inter_500Medium",
                    color: isDark ? "#FFFFFF" : "#000000",
                    marginBottom: 2,
                  }}>
                    {item.text}
                  </Text>
                  <Text style={{
                    fontSize: 14,
                    fontFamily: "Inter_400Regular",
                    color: isDark ? "#9CA3AF" : "#6B7280",
                  }}>
                    {item.subtitle}
                  </Text>
                </View>
                
                <ArrowUpRight size={16} color={isDark ? "#9CA3AF" : "#6B7280"} />
              </TouchableOpacity>
            )}
          />
        </View>
      )}

      <ScrollView 
        style={{ flex: 1 }}
        contentContainerStyle={{ 
          paddingHorizontal: 20,
          paddingBottom: insets.bottom + 20 
        }}
        showsVerticalScrollIndicator={false}
        onScrollBeginDrag={() => setShowSuggestions(false)} // Hide suggestions when scrolling
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