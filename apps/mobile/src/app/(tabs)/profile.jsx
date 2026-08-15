import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
  Platform,
  Switch,
  StyleSheet,
  Dimensions,
} from "react-native";
import { Image } from "expo-image";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { LinearGradient } from 'expo-linear-gradient';
import {
  ShoppingBag,
  Heart,
  Settings,
  HelpCircle,
  MapPin,
  ChevronRight,
  LogOut,
  Camera,
  Bell,
  Wallet,
  Sparkles,
  QrCode,
  ShieldCheck,
} from "lucide-react-native";
import {
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from "@expo-google-fonts/inter";
import * as Haptics from 'expo-haptics';
import * as ImagePicker from "expo-image-picker";

const { width } = Dimensions.get('window');

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const [profileImage, setProfileImage] = useState("https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop");
  const [pushEnabled, setPushEnabled] = useState(true);
  const [aiEnabled, setAiEnabled] = useState(true);

  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  if (!fontsLoaded) return null;

  const themeColors = {
    bg: isDark ? "#09090B" : "#F8FAFC",
    cardBg: isDark ? "#18181B" : "#FFFFFF",
    textPrimary: isDark ? "#FAFAFA" : "#0F172A",
    textSecondary: isDark ? "#A1A1AA" : "#64748B",
    primary: "#10B981", 
    border: isDark ? "#27272A" : "#E2E8F0",
  };

  const handleImagePicker = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (!result.canceled && result.assets[0]) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const toggleSwitch = (setter, value) => {
    if (Platform.OS === 'ios') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setter(!value);
  };

  const ActionCard = ({ icon: Icon, label, color, onPress }) => (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={{
        width: (width - 48 - 16) / 2,
        backgroundColor: themeColors.cardBg,
        padding: 16,
        borderRadius: 24,
        borderWidth: 1,
        borderColor: themeColors.border,
        shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2,
        marginBottom: 16,
      }}
    >
      <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: `${color}15`, justifyContent: 'center', alignItems: 'center', marginBottom: 12 }}>
        <Icon size={24} color={color} />
      </View>
      <Text style={{ fontSize: 16, fontFamily: "Inter_600SemiBold", color: themeColors.textPrimary }}>{label}</Text>
    </TouchableOpacity>
  );

  const SettingRow = ({ icon: Icon, label, color, onToggle, showArrow = false, onPress, noBorder = false }) => (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      disabled={!onPress && !onToggle}
      style={{
        flexDirection: 'row', alignItems: 'center', paddingVertical: 16,
        borderBottomWidth: noBorder ? 0 : 1, borderBottomColor: themeColors.border,
      }}
    >
      <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: `${color}15`, justifyContent: 'center', alignItems: 'center', marginRight: 16 }}>
        <Icon size={20} color={color} />
      </View>
      <Text style={{ flex: 1, fontSize: 16, fontFamily: "Inter_500Medium", color: themeColors.textPrimary }}>{label}</Text>
      
      {onToggle && (
        <Switch
          trackColor={{ false: isDark ? "#374151" : "#D1D5DB", true: themeColors.primary }}
          thumbColor="#FFFFFF"
          ios_backgroundColor={isDark ? "#374151" : "#D1D5DB"}
          onValueChange={() => toggleSwitch(onToggle.setter, onToggle.value)}
          value={onToggle.value}
        />
      )}
      {showArrow && <ChevronRight size={20} color={themeColors.textSecondary} />}
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1, backgroundColor: themeColors.bg }}>
      <StatusBar style="light" />

      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        
        {/* Premium Header Profile Section */}
        <View style={{ paddingBottom: 24 }}>
          {/* Background Gradient */}
          <View style={{ height: 220, borderBottomLeftRadius: 40, borderBottomRightRadius: 40, overflow: 'hidden' }}>
            <LinearGradient colors={['#10B981', '#059669', '#047857']} style={StyleSheet.absoluteFillObject} />
            <View style={{ position: 'absolute', top: -50, right: -50, width: 200, height: 200, borderRadius: 100, backgroundColor: 'rgba(255,255,255,0.1)' }} />
            <View style={{ position: 'absolute', bottom: -50, left: -20, width: 150, height: 150, borderRadius: 75, backgroundColor: 'rgba(255,255,255,0.1)' }} />
            
            {/* Nav Title */}
            <View style={{ paddingTop: insets.top + 16, paddingHorizontal: 24, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={{ fontSize: 24, fontFamily: "Inter_600SemiBold", color: "#FFF" }}>Profile</Text>
              <TouchableOpacity onPress={() => router.push('/settings')} style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center' }}>
                <Settings size={20} color="#FFF" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Overlapping Profile Card */}
          <View style={{ marginTop: -80, paddingHorizontal: 24 }}>
            <View style={{
              backgroundColor: themeColors.cardBg,
              borderRadius: 32,
              padding: 24,
              alignItems: 'center',
              shadowColor: "#000", shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.1, shadowRadius: 20, elevation: 10,
              borderWidth: 1, borderColor: themeColors.border
            }}>
              
              <View style={{ position: 'relative', marginTop: -50, marginBottom: 16 }}>
                <View style={{ width: 100, height: 100, borderRadius: 50, backgroundColor: themeColors.cardBg, padding: 4 }}>
                  <Image source={{ uri: profileImage }} style={{ width: '100%', height: '100%', borderRadius: 50 }} contentFit="cover" />
                </View>
                <TouchableOpacity onPress={handleImagePicker} style={{ position: 'absolute', bottom: 4, right: 4, width: 32, height: 32, borderRadius: 16, backgroundColor: themeColors.primary, justifyContent: 'center', alignItems: 'center', borderWidth: 3, borderColor: themeColors.cardBg }}>
                  <Camera size={14} color="#FFF" />
                </TouchableOpacity>
              </View>

              <Text style={{ fontSize: 24, fontFamily: "Inter_700Bold", color: themeColors.textPrimary, marginBottom: 4 }}>John Doe</Text>
              <Text style={{ fontSize: 14, fontFamily: "Inter_500Medium", color: themeColors.textSecondary, marginBottom: 16 }}>B.Tech CSE • LPU</Text>

              {/* Stats */}
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%', borderTopWidth: 1, borderTopColor: themeColors.border, paddingTop: 16 }}>
                <View style={{ alignItems: 'center', flex: 1 }}>
                  <Text style={{ fontSize: 20, fontFamily: "Inter_700Bold", color: themeColors.textPrimary }}>42</Text>
                  <Text style={{ fontSize: 12, fontFamily: "Inter_500Medium", color: themeColors.textSecondary }}>Orders</Text>
                </View>
                <View style={{ width: 1, backgroundColor: themeColors.border }} />
                <View style={{ alignItems: 'center', flex: 1 }}>
                  <Text style={{ fontSize: 20, fontFamily: "Inter_700Bold", color: themeColors.primary }}>850</Text>
                  <Text style={{ fontSize: 12, fontFamily: "Inter_500Medium", color: themeColors.textSecondary }}>Points</Text>
                </View>
                <View style={{ width: 1, backgroundColor: themeColors.border }} />
                <View style={{ alignItems: 'center', flex: 1 }}>
                  <Text style={{ fontSize: 20, fontFamily: "Inter_700Bold", color: themeColors.textPrimary }}>12</Text>
                  <Text style={{ fontSize: 12, fontFamily: "Inter_500Medium", color: themeColors.textSecondary }}>Reviews</Text>
                </View>
              </View>

            </View>
          </View>
        </View>

        {/* LPU Student ID Glass Card */}
        <View style={{ paddingHorizontal: 24, marginBottom: 32 }}>
          <View style={{ borderRadius: 24, overflow: 'hidden', backgroundColor: isDark ? '#1E293B' : '#F1F5F9', borderWidth: 1, borderColor: isDark ? '#334155' : '#E2E8F0' }}>
            <LinearGradient colors={isDark ? ['#1E293B', '#0F172A'] : ['#F8FAFC', '#E2E8F0']} style={StyleSheet.absoluteFillObject} />
            <View style={{ padding: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <View>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                  <ShieldCheck size={16} color={themeColors.primary} style={{ marginRight: 6 }} />
                  <Text style={{ fontSize: 13, fontFamily: "Inter_600SemiBold", color: themeColors.primary, letterSpacing: 1 }}>VERIFIED STUDENT</Text>
                </View>
                <Text style={{ fontSize: 18, fontFamily: "Inter_700Bold", color: themeColors.textPrimary, marginBottom: 4 }}>1190XXXX</Text>
                <Text style={{ fontSize: 13, fontFamily: "Inter_500Medium", color: themeColors.textSecondary }}>Valid till May 2027</Text>
              </View>
              <View style={{ width: 50, height: 50, backgroundColor: isDark ? '#334155' : '#CBD5E1', borderRadius: 12, justifyContent: 'center', alignItems: 'center' }}>
                <QrCode size={30} color={isDark ? '#94A3B8' : '#64748B'} />
              </View>
            </View>
          </View>
        </View>

        {/* Actions Grid */}
        <View style={{ paddingHorizontal: 24, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 16 }}>
          <ActionCard icon={ShoppingBag} label="Orders" color="#3B82F6" onPress={() => router.push('/order-history')} />
          <ActionCard icon={Wallet} label="Payments" color="#F59E0B" onPress={() => console.log('Payments')} />
          <ActionCard icon={MapPin} label="Addresses" color="#8B5CF6" onPress={() => console.log('Addresses')} />
          <ActionCard icon={Heart} label="Favorites" color="#EC4899" onPress={() => router.push('/wishlist')} />
        </View>

        {/* Preferences Section */}
        <View style={{ paddingHorizontal: 24, marginBottom: 32 }}>
          <Text style={{ fontSize: 18, fontFamily: "Inter_600SemiBold", color: themeColors.textPrimary, marginBottom: 16 }}>Preferences</Text>
          
          <View style={{ backgroundColor: themeColors.cardBg, borderRadius: 24, paddingHorizontal: 20, borderWidth: 1, borderColor: themeColors.border }}>
            <SettingRow 
              icon={Sparkles} label="Campus AI Assistant" color="#8B5CF6" 
              onToggle={{ value: aiEnabled, setter: setAiEnabled }} 
            />
            <SettingRow 
              icon={Bell} label="Push Notifications" color="#3B82F6" 
              onToggle={{ value: pushEnabled, setter: setPushEnabled }} 
            />
            <SettingRow 
              icon={HelpCircle} label="Help & Support" color="#10B981" 
              showArrow onPress={() => console.log('Help')}
            />
            <SettingRow 
              icon={LogOut} label="Log Out" color="#EF4444" 
              showArrow onPress={() => console.log('Logout')} 
              noBorder
            />
          </View>
        </View>
        
        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}