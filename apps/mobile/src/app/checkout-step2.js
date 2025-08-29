import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  useColorScheme,
  Platform,
  ScrollView,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useRouter, useLocalSearchParams } from "expo-router";
import { 
  ArrowLeft, 
  Clock,
  Calendar,
  ChevronRight,
  Zap
} from "lucide-react-native";
import {
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
} from "@expo-google-fonts/inter";
import { useState } from "react";
import * as Haptics from 'expo-haptics';

export default function CheckoutStep2() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { orderType } = useLocalSearchParams();
  
  const [selectedTimeOption, setSelectedTimeOption] = useState("now"); // Default to 'now'
  const [selectedTime, setSelectedTime] = useState("");
  
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
  });

  if (!fontsLoaded) {
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

  // Generate time slots between 9am and 10pm
  const generateTimeSlots = () => {
    const slots = [];
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinutes = now.getMinutes();
    
    for (let hour = 9; hour < 22; hour++) {
      for (let minutes = 0; minutes < 60; minutes += 30) {
        const timeSlot = new Date();
        timeSlot.setHours(hour, minutes, 0, 0);
        
        // Only show future time slots (at least 15 minutes from now)
        const slotTime = hour * 60 + minutes;
        const currentTime = currentHour * 60 + currentMinutes;
        
        if (slotTime > currentTime + 15) {
          const timeString = timeSlot.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
          });
          
          slots.push({
            value: timeString,
            label: timeString,
            isAvailable: true
          });
        }
      }
    }
    
    return slots.slice(0, 12); // Limit to 12 slots
  };

  const timeSlots = generateTimeSlots();

  const handleTimeOptionSelect = (option) => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setSelectedTimeOption(option);
    if (option === "now") {
      setSelectedTime("");
    }
  };

  const handleTimeSlotSelect = (time) => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setSelectedTime(time);
    setSelectedTimeOption("scheduled");
  };

  const handleContinue = () => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    
    const finalTime = selectedTimeOption === "now" ? "ASAP" : selectedTime;
    
    // Navigate to step 3
    router.push({
      pathname: '/checkout-step3',
      params: { 
        orderType: orderType,
        orderTime: finalTime
      }
    });
  };

  const isReadyToContinue = selectedTimeOption === "now" || (selectedTimeOption === "scheduled" && selectedTime);

  return (
    <View style={{ 
      flex: 1, 
      backgroundColor: isDark ? "#121212" : "#F8FDF8",
    }}>
      <StatusBar style={isDark ? "light" : "dark"} />

      {/* Header */}
      <View style={{
        paddingTop: insets.top + 16,
        paddingHorizontal: 20,
        paddingBottom: 16,
        backgroundColor: isDark ? "#121212" : "#F8FDF8",
        borderBottomWidth: 1,
        borderBottomColor: isDark ? "#1E1E1E" : "#E5E7EB",
      }}>
        <View style={{ 
          flexDirection: "row", 
          alignItems: "center",
          justifyContent: "space-between"
        }}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
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
            }}>
              Order Timing
            </Text>
          </View>
          
          <View style={{
            backgroundColor: isDark ? "#1E1E1E" : "#F3F4F6",
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: 12,
          }}>
            <Text style={{
              fontSize: 14,
              fontFamily: "Inter_500Medium",
              color: isDark ? "#9CA3AF" : "#6B7280",
            }}>
              Step 2 of 3
            </Text>
          </View>
        </View>
      </View>

      {/* Progress Bar */}
      <View style={{
        paddingHorizontal: 20,
        paddingVertical: 16,
      }}>
        <View style={{
          height: 4,
          backgroundColor: isDark ? "#1E1E1E" : "#E5E7EB",
          borderRadius: 2,
          overflow: 'hidden',
        }}>
          <View style={{
            height: '100%',
            width: '66.66%',
            backgroundColor: "#22C55E",
            borderRadius: 2,
          }} />
        </View>
      </View>

      <ScrollView 
        style={{ flex: 1 }}
        contentContainerStyle={{ 
          paddingHorizontal: 20, 
          paddingTop: 20,
          paddingBottom: 120
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Order Type Summary */}
        <View style={{
          backgroundColor: isDark ? "#1E1E1E" : "#F3F4F6",
          borderRadius: 12,
          padding: 16,
          marginBottom: 24,
        }}>
          <Text style={{
            fontSize: 14,
            fontFamily: "Inter_500Medium",
            color: isDark ? "#9CA3AF" : "#6B7280",
            marginBottom: 4,
          }}>
            Order Type
          </Text>
          <Text style={{
            fontSize: 16,
            fontFamily: "Inter_600SemiBold",
            color: isDark ? "#FFFFFF" : "#000000",
          }}>
            {orderType}
          </Text>
        </View>

        <Text style={{
          fontSize: 16,
          fontFamily: "Inter_400Regular",
          color: isDark ? "#9CA3AF" : "#6B7280",
          marginBottom: 24,
          lineHeight: 24,
        }}>
          When would you like your order? 'Now' is selected for fastest service.
        </Text>

        {/* Time Options */}
        <View style={{ gap: 16, marginBottom: 24 }}>
          {/* Now Option */}
          <TouchableOpacity
            onPress={() => handleTimeOptionSelect("now")}
            style={{
              backgroundColor: isDark ? "#1E1E1E" : "#FFFFFF",
              borderRadius: 16,
              padding: 20,
              borderWidth: 2,
              borderColor: selectedTimeOption === "now" ? "#22C55E" : (isDark ? "#374151" : "#E5E7EB"),
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: selectedTimeOption === "now" ? 0.1 : 0.05,
              shadowRadius: 8,
              elevation: selectedTimeOption === "now" ? 4 : 2,
            }}
            activeOpacity={0.7}
          >
            <View style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}>
              <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
                <View style={{
                  width: 48,
                  height: 48,
                  borderRadius: 24,
                  backgroundColor: `#22C55E${selectedTimeOption === "now" ? 'FF' : '20'}`,
                  justifyContent: "center",
                  alignItems: "center",
                  marginRight: 16,
                }}>
                  <Zap 
                    size={24} 
                    color={selectedTimeOption === "now" ? "#FFFFFF" : "#22C55E"} 
                  />
                </View>
                
                <View style={{ flex: 1 }}>
                  <Text style={{
                    fontSize: 18,
                    fontFamily: "Inter_600SemiBold",
                    color: isDark ? "#FFFFFF" : "#000000",
                    marginBottom: 4,
                  }}>
                    Now (ASAP)
                  </Text>
                  <Text style={{
                    fontSize: 14,
                    fontFamily: "Inter_400Regular",
                    color: isDark ? "#9CA3AF" : "#6B7280",
                  }}>
                    Ready in 15-20 minutes
                  </Text>
                </View>
              </View>
              
              {selectedTimeOption === "now" && (
                <View style={{
                  width: 24,
                  height: 24,
                  borderRadius: 12,
                  backgroundColor: "#22C55E",
                  justifyContent: "center",
                  alignItems: "center",
                }}>
                  <View style={{
                    width: 8,
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: "#FFFFFF",
                  }} />
                </View>
              )}
            </View>
            
            <View style={{
              marginTop: 12,
              paddingTop: 12,
              borderTopWidth: 1,
              borderTopColor: isDark ? "#374151" : "#E5E7EB",
            }}>
              <Text style={{
                fontSize: 12,
                fontFamily: "Inter_500Medium",
                color: "#22C55E",
              }}>
                ⚡ Fastest Option • Recommended
              </Text>
            </View>
          </TouchableOpacity>

          {/* Schedule Option */}
          <TouchableOpacity
            onPress={() => handleTimeOptionSelect("scheduled")}
            style={{
              backgroundColor: isDark ? "#1E1E1E" : "#FFFFFF",
              borderRadius: 16,
              padding: 20,
              borderWidth: 2,
              borderColor: selectedTimeOption === "scheduled" ? "#3B82F6" : (isDark ? "#374151" : "#E5E7EB"),
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: selectedTimeOption === "scheduled" ? 0.1 : 0.05,
              shadowRadius: 8,
              elevation: selectedTimeOption === "scheduled" ? 4 : 2,
            }}
            activeOpacity={0.7}
          >
            <View style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}>
              <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
                <View style={{
                  width: 48,
                  height: 48,
                  borderRadius: 24,
                  backgroundColor: `#3B82F6${selectedTimeOption === "scheduled" ? 'FF' : '20'}`,
                  justifyContent: "center",
                  alignItems: "center",
                  marginRight: 16,
                }}>
                  <Clock 
                    size={24} 
                    color={selectedTimeOption === "scheduled" ? "#FFFFFF" : "#3B82F6"} 
                  />
                </View>
                
                <View style={{ flex: 1 }}>
                  <Text style={{
                    fontSize: 18,
                    fontFamily: "Inter_600SemiBold",
                    color: isDark ? "#FFFFFF" : "#000000",
                    marginBottom: 4,
                  }}>
                    Schedule for Later
                  </Text>
                  <Text style={{
                    fontSize: 14,
                    fontFamily: "Inter_400Regular",
                    color: isDark ? "#9CA3AF" : "#6B7280",
                  }}>
                    Choose a specific time
                  </Text>
                </View>
              </View>
              
              {selectedTimeOption === "scheduled" && (
                <View style={{
                  width: 24,
                  height: 24,
                  borderRadius: 12,
                  backgroundColor: "#3B82F6",
                  justifyContent: "center",
                  alignItems: "center",
                }}>
                  <View style={{
                    width: 8,
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: "#FFFFFF",
                  }} />
                </View>
              )}
            </View>
          </TouchableOpacity>
        </View>

        {/* Time Slots - Only show when scheduled is selected */}
        {selectedTimeOption === "scheduled" && (
          <View>
            <Text style={{
              fontSize: 16,
              fontFamily: "Inter_600SemiBold",
              color: isDark ? "#FFFFFF" : "#000000",
              marginBottom: 16,
            }}>
              Available Time Slots
            </Text>
            
            <View style={{
              flexDirection: "row",
              flexWrap: "wrap",
              gap: 12,
            }}>
              {timeSlots.map((slot, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => handleTimeSlotSelect(slot.value)}
                  style={{
                    backgroundColor: selectedTime === slot.value 
                      ? "#3B82F6" 
                      : (isDark ? "#1E1E1E" : "#FFFFFF"),
                    borderWidth: 1,
                    borderColor: selectedTime === slot.value 
                      ? "#3B82F6" 
                      : (isDark ? "#374151" : "#E5E7EB"),
                    borderRadius: 12,
                    paddingHorizontal: 16,
                    paddingVertical: 12,
                    minWidth: 100,
                    alignItems: "center",
                  }}
                  activeOpacity={0.7}
                >
                  <Text style={{
                    fontSize: 14,
                    fontFamily: "Inter_500Medium",
                    color: selectedTime === slot.value 
                      ? "#FFFFFF" 
                      : (isDark ? "#FFFFFF" : "#000000"),
                  }}>
                    {slot.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            
            {timeSlots.length === 0 && (
              <Text style={{
                fontSize: 14,
                fontFamily: "Inter_400Regular",
                color: isDark ? "#9CA3AF" : "#6B7280",
                textAlign: "center",
                marginTop: 16,
              }}>
                No more time slots available today. Please select 'Now' or try tomorrow.
              </Text>
            )}
          </View>
        )}
      </ScrollView>

      {/* Continue Button */}
      <View style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        paddingHorizontal: 20,
        paddingBottom: insets.bottom + 20,
        paddingTop: 20,
        backgroundColor: isDark ? "#121212" : "#F8FDF8",
        borderTopWidth: 1,
        borderTopColor: isDark ? "#1E1E1E" : "#E5E7EB",
      }}>
        <TouchableOpacity
          onPress={handleContinue}
          disabled={!isReadyToContinue}
          style={{
            backgroundColor: isReadyToContinue ? "#22C55E" : (isDark ? "#374151" : "#E5E7EB"),
            borderRadius: 16,
            paddingVertical: 16,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            shadowColor: "#22C55E",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: isReadyToContinue ? 0.3 : 0,
            shadowRadius: 8,
            elevation: isReadyToContinue ? 8 : 0,
          }}
          activeOpacity={0.8}
        >
          <Text style={{
            fontSize: 16,
            fontFamily: "Inter_600SemiBold",
            color: isReadyToContinue ? "#FFFFFF" : (isDark ? "#6B7280" : "#9CA3AF"),
            marginRight: 8,
          }}>
            Continue to Payment
          </Text>
          <ChevronRight 
            size={20} 
            color={isReadyToContinue ? "#FFFFFF" : (isDark ? "#6B7280" : "#9CA3AF")} 
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}