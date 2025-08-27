import {
  View,
  Text,
  Modal,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { X } from "lucide-react-native";
import CheckoutProgress from "./CheckoutProgress";
import CheckoutStep1 from "./CheckoutStep1";
import CheckoutStep2 from "./CheckoutStep2";
import CheckoutStep3 from "./CheckoutStep3";

export default function CheckoutModal({
  visible,
  onClose,
  cart,
}) {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const {
    checkoutItems,
    currentStep,
    setCurrentStep,
    updateCheckoutItemOrderType,
    updateCheckoutItemTiming,
    subtotal,
    tax,
    total,
    handlePlaceOrder,
  } = cart;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View
        style={{ flex: 1, backgroundColor: isDark ? "#121212" : "#F8FDF8" }}
      >
        <View
          style={{
            paddingTop: insets.top + 16,
            paddingHorizontal: 20,
            paddingBottom: 16,
            backgroundColor: isDark ? "#121212" : "#F8FDF8",
            borderBottomWidth: 1,
            borderBottomColor: isDark ? "#333333" : "#F0F0F0",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Text
            style={{
              fontSize: 24,
              fontFamily: "Inter_600SemiBold",
              color: isDark ? "#FFFFFF" : "#000000",
            }}
          >
            Checkout
          </Text>
          <TouchableOpacity
            onPress={onClose}
            style={{
              width: 32,
              height: 32,
              borderRadius: 16,
              backgroundColor: isDark ? "#2A2A2A" : "#F3F4F6",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <X size={16} color={isDark ? "#E5E7EB" : "#374151"} />
          </TouchableOpacity>
        </View>

        <CheckoutProgress currentStep={currentStep} isDark={isDark} />

        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingBottom: insets.bottom + 20,
          }}
          showsVerticalScrollIndicator={false}
        >
          {currentStep === 1 && (
            <CheckoutStep1
              isDark={isDark}
              checkoutItems={checkoutItems}
              onUpdateOrderType={updateCheckoutItemOrderType}
              onContinue={() => setCurrentStep(2)}
            />
          )}
          {currentStep === 2 && (
            <CheckoutStep2
              isDark={isDark}
              checkoutItems={checkoutItems}
              onUpdateTiming={updateCheckoutItemTiming}
              onContinue={() => setCurrentStep(3)}
              onBack={() => setCurrentStep(1)}
            />
          )}
          {currentStep === 3 && (
            <CheckoutStep3
              isDark={isDark}
              checkoutItems={checkoutItems}
              subtotal={subtotal}
              tax={tax}
              total={total}
              onPlaceOrder={handlePlaceOrder}
              onBack={() => setCurrentStep(2)}
            />
          )}
        </ScrollView>
      </View>
    </Modal>
  );
}
