import { Tabs } from "expo-router";
import { useColorScheme } from "react-native";
import { Home, Search, ShoppingBag, User } from "lucide-react-native";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: isDark ? "#1E1E1E" : "#FFFFFF",
          borderTopWidth: 1,
          borderTopColor: isDark ? "#333333" : "#E8F5E8",
          paddingTop: 8,
          height: 85,
        },
        tabBarActiveTintColor: "#22C55E",
        tabBarInactiveTintColor: isDark ? "#9CA3AF" : "#9B9B9B",
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "500",
          marginBottom: 8,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => <Home color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: "Search",
          tabBarIcon: ({ color, size }) => <Search color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="orders"
        options={{
          title: "Orders",
          tabBarIcon: ({ color, size }) => <ShoppingBag color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => <User color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="shop/[id]"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="food/[id]"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}