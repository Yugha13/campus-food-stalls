import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
  Platform,
  StyleSheet,
  Dimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { LinearGradient } from 'expo-linear-gradient';
import {
  ArrowLeft,
  Wallet,
  Plus,
  ArrowUpRight,
  ArrowDownLeft,
  CreditCard,
  ShieldCheck,
  CheckCircle2
} from "lucide-react-native";
import {
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from "@expo-google-fonts/inter";
import * as Haptics from 'expo-haptics';

const { width } = Dimensions.get('window');

const PACKAGES = [
  { id: 1, coins: 100, price: 100 },
  { id: 2, coins: 500, price: 500, popular: true },
  { id: 3, coins: 1000, price: 1000 },
  { id: 4, coins: 2000, price: 2000, bonus: "+100 Free" },
];

const TRANSACTIONS = [
  { id: 1, type: 'spent', title: 'Cafe Beans', date: 'Today, 10:30 AM', amount: 110 },
  { id: 2, type: 'added', title: 'Added via UPI', date: 'Yesterday, 04:15 PM', amount: 500 },
  { id: 3, type: 'spent', title: 'Desi Dhaba', date: 'Aug 12, 01:20 PM', amount: 240 },
  { id: 4, type: 'spent', title: 'Momos Point', date: 'Aug 10, 06:45 PM', amount: 80 },
];

export default function WalletScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const [selectedPackage, setSelectedPackage] = useState(2);

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
    primary: "#F59E0B", // Gold for coins
    primaryDark: "#D97706",
    border: isDark ? "#27272A" : "#E2E8F0",
  };

  const handlePurchase = () => {
    if (Platform.OS === 'ios') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    alert('Prototype: Purchase Successful!');
  };

  return (
    <View style={{ flex: 1, backgroundColor: themeColors.bg }}>
      <StatusBar style={isDark ? "light" : "dark"} />

      {/* Header */}
      <View style={{
        paddingTop: insets.top + 16,
        paddingHorizontal: 24,
        paddingBottom: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: themeColors.bg,
      }}>
        <TouchableOpacity 
          onPress={() => router.back()}
          style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: themeColors.cardBg, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: themeColors.border }}
        >
          <ArrowLeft size={20} color={themeColors.textPrimary} />
        </TouchableOpacity>
        <Text style={{ fontSize: 18, fontFamily: "Inter_600SemiBold", color: themeColors.textPrimary }}>LPU Wallet</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        
        {/* Balance Card */}
        <View style={{ paddingHorizontal: 24, marginBottom: 32 }}>
          <View style={{ borderRadius: 32, overflow: 'hidden', backgroundColor: themeColors.cardBg, borderWidth: 1, borderColor: themeColors.primary, elevation: 10, shadowColor: themeColors.primary, shadowOpacity: 0.2, shadowRadius: 20, shadowOffset: {width:0, height:10} }}>
            <LinearGradient colors={isDark ? ['#382405', '#18181B'] : ['#FEF3C7', '#FFFFFF']} start={{x:0, y:0}} end={{x:1, y:1}} style={StyleSheet.absoluteFillObject} />
            <View style={{ position: 'absolute', top: -50, right: -20, width: 150, height: 150, borderRadius: 75, backgroundColor: themeColors.primary, opacity: 0.1 }} />
            
            <View style={{ padding: 24 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
                <Wallet size={18} color={themeColors.primary} style={{ marginRight: 8 }} />
                <Text style={{ fontSize: 14, fontFamily: "Inter_600SemiBold", color: themeColors.primary, textTransform: 'uppercase', letterSpacing: 1 }}>Available Balance</Text>
              </View>
              
              <View style={{ flexDirection: 'row', alignItems: 'baseline', marginBottom: 4 }}>
                <Text style={{ fontSize: 48, fontFamily: "Inter_700Bold", color: themeColors.textPrimary }}>🪙 850</Text>
              </View>
              <Text style={{ fontSize: 14, fontFamily: "Inter_500Medium", color: themeColors.textSecondary }}>≈ ₹850 (1 Coin = 1 Rupee)</Text>
            </View>
            
            <View style={{ paddingHorizontal: 24, paddingVertical: 16, backgroundColor: isDark ? 'rgba(0,0,0,0.2)' : 'rgba(245, 158, 11, 0.1)', borderTopWidth: 1, borderTopColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(245, 158, 11, 0.2)', flexDirection: 'row', alignItems: 'center' }}>
              <ShieldCheck size={16} color={themeColors.primaryDark} style={{ marginRight: 6 }} />
              <Text style={{ fontSize: 13, fontFamily: "Inter_500Medium", color: themeColors.primaryDark }}>Secure LPU Closed-Loop Wallet</Text>
            </View>
          </View>
        </View>

        {/* Top Up Section */}
        <View style={{ paddingHorizontal: 24, marginBottom: 32 }}>
          <Text style={{ fontSize: 18, fontFamily: "Inter_600SemiBold", color: themeColors.textPrimary, marginBottom: 16 }}>Top Up Coins</Text>
          
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
            {PACKAGES.map((pkg) => {
              const isSelected = selectedPackage === pkg.id;
              return (
                <TouchableOpacity
                  key={pkg.id}
                  activeOpacity={0.8}
                  onPress={() => {
                    if (Platform.OS === 'ios') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setSelectedPackage(pkg.id);
                  }}
                  style={{
                    width: (width - 48 - 16) / 2,
                    backgroundColor: isSelected ? (isDark ? '#382405' : '#FEF3C7') : themeColors.cardBg,
                    borderWidth: 2,
                    borderColor: isSelected ? themeColors.primary : themeColors.border,
                    borderRadius: 20,
                    padding: 16,
                    marginBottom: 16,
                    alignItems: 'center',
                    position: 'relative'
                  }}
                >
                  {pkg.popular && (
                    <View style={{ position: 'absolute', top: -10, backgroundColor: '#10B981', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 100, zIndex: 10 }}>
                      <Text style={{ fontSize: 10, fontFamily: "Inter_700Bold", color: '#FFF' }}>POPULAR</Text>
                    </View>
                  )}
                  {pkg.bonus && (
                    <View style={{ position: 'absolute', top: -10, backgroundColor: '#8B5CF6', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 100, zIndex: 10 }}>
                      <Text style={{ fontSize: 10, fontFamily: "Inter_700Bold", color: '#FFF' }}>{pkg.bonus}</Text>
                    </View>
                  )}
                  <Text style={{ fontSize: 24, fontFamily: "Inter_700Bold", color: themeColors.textPrimary, marginBottom: 4 }}>🪙 {pkg.coins}</Text>
                  <Text style={{ fontSize: 14, fontFamily: "Inter_500Medium", color: themeColors.textSecondary }}>Pay ₹{pkg.price}</Text>
                </TouchableOpacity>
              )
            })}
          </View>

          <TouchableOpacity
            activeOpacity={0.9}
            onPress={handlePurchase}
            style={{
              backgroundColor: themeColors.textPrimary,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              paddingVertical: 18,
              borderRadius: 100,
              marginTop: 8,
              shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 10, elevation: 5
            }}
          >
            <CreditCard size={20} color={themeColors.bg} style={{ marginRight: 8 }} />
            <Text style={{ fontSize: 16, fontFamily: "Inter_600SemiBold", color: themeColors.bg }}>
              Pay ₹{PACKAGES.find(p => p.id === selectedPackage)?.price}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Transactions */}
        <View style={{ paddingHorizontal: 24, marginBottom: 40 }}>
          <Text style={{ fontSize: 18, fontFamily: "Inter_600SemiBold", color: themeColors.textPrimary, marginBottom: 16 }}>Recent Activity</Text>
          
          <View style={{ backgroundColor: themeColors.cardBg, borderRadius: 24, padding: 8, borderWidth: 1, borderColor: themeColors.border }}>
            {TRANSACTIONS.map((tx, index) => (
              <View key={tx.id} style={{
                flexDirection: 'row', alignItems: 'center', padding: 16,
                borderBottomWidth: index < TRANSACTIONS.length - 1 ? 1 : 0,
                borderBottomColor: themeColors.border
              }}>
                <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: tx.type === 'added' ? '#10B98115' : '#EF444415', justifyContent: 'center', alignItems: 'center', marginRight: 16 }}>
                  {tx.type === 'added' ? (
                    <ArrowDownLeft size={20} color="#10B981" />
                  ) : (
                    <ArrowUpRight size={20} color="#EF4444" />
                  )}
                </View>
                
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 16, fontFamily: "Inter_600SemiBold", color: themeColors.textPrimary, marginBottom: 2 }}>{tx.title}</Text>
                  <Text style={{ fontSize: 13, fontFamily: "Inter_400Regular", color: themeColors.textSecondary }}>{tx.date}</Text>
                </View>
                
                <Text style={{ fontSize: 16, fontFamily: "Inter_600SemiBold", color: tx.type === 'added' ? '#10B981' : themeColors.textPrimary }}>
                  {tx.type === 'added' ? '+' : '-'}🪙 {tx.amount}
                </Text>
              </View>
            ))}
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}
