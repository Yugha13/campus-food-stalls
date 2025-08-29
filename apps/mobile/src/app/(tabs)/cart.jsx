import {
  View,
  ScrollView,
  useColorScheme,
  Text,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import {
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
} from "@expo-google-fonts/inter";
import { useCart } from "../../utils/useCart";
import OrdersHeader from "../../components/orders/OrdersHeader";
import EmptyCart from "../../components/orders/EmptyCart";
import CartItem from "../../components/orders/CartItem";
import CheckoutFooter from "../../components/orders/CheckoutFooter";
import CheckoutModal from "../../components/orders/CheckoutModal";

export default function OrdersScreen() {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const cart = useCart();
  const {
    items,
    handleQuantityChange,
    handleRemoveItem,
    subtotal,
    tax,
    total,
    handleCheckout,
    showCheckoutModal,
    setShowCheckoutModal
  } = cart;

  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
  });

  if (!fontsLoaded) {
    return null;
  }

  if (items.length === 0) {
    return (
      <View style={{ flex: 1 }}>
        <StatusBar style={isDark ? "light" : "dark"} />
        <OrdersHeader isDark={isDark} />
        <EmptyCart isDark={isDark} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: isDark ? "#121212" : "#F8FDF8" }}>
      <StatusBar style={isDark ? "light" : "dark"} />
      <OrdersHeader isDark={isDark} />

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 20,
          paddingBottom: insets.bottom + 100, // Extra space for fixed checkout section
        }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ marginBottom: 24 }}>
          <Text
            style={{
              fontSize: 18,
              fontFamily: "Inter_600SemiBold",
              color: isDark ? "#FFFFFF" : "#000000",
              marginBottom: 16,
            }}
          >
            Cart Items ({items.length})
          </Text>
          {items.map((item) => (
            <CartItem
              key={item.id}
              item={item}
              isDark={isDark}
              onQuantityChange={handleQuantityChange}
              onRemoveItem={handleRemoveItem}
            />
          ))}
        </View>
      </ScrollView>

      <CheckoutFooter
        isDark={isDark}
        subtotal={subtotal}
        tax={tax}
        total={total}
        onCheckout={handleCheckout}
      />

      <CheckoutModal
        visible={showCheckoutModal}
        onClose={() => setShowCheckoutModal(false)}
        cart={cart}
      />
    </View>
  );
}
