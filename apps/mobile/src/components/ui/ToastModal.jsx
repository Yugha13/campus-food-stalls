import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Animated, Dimensions, Platform, StyleSheet } from 'react-native';
import { CheckCircle, ShoppingCart } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

export default function ToastModal({ visible, item, onClose }) {
  const router = useRouter();
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.9)).current;
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(scale, {
          toValue: 1,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        })
      ]).start();
      
      // Auto close after 3 seconds if not interacted
      const timer = setTimeout(() => {
        handleClose();
      }, 3000);
      return () => clearTimeout(timer);
    } else {
      opacity.setValue(0);
      scale.setValue(0.9);
    }
  }, [visible]);

  const handleClose = () => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 0.9,
        duration: 200,
        useNativeDriver: true,
      })
    ]).start(() => onClose());
  };

  if (!visible) return null;

  return (
    <Animated.View style={[StyleSheet.absoluteFill, { opacity, zIndex: 9999, justifyContent: 'center', alignItems: 'center' }]}>
      {/* Background Overlay */}
      <BlurView intensity={Platform.OS === 'ios' ? 40 : 100} tint="dark" style={StyleSheet.absoluteFill}>
        <TouchableOpacity style={StyleSheet.absoluteFill} activeOpacity={1} onPress={handleClose} />
      </BlurView>

      {/* Modal Content */}
      <Animated.View style={{
        transform: [{ scale }],
        width: width * 0.85,
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        padding: 24,
        alignItems: 'center',
        shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.3, shadowRadius: 20, elevation: 15
      }}>
        
        <View style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: '#10B98115', justifyContent: 'center', alignItems: 'center', marginBottom: 16 }}>
          <CheckCircle size={32} color="#10B981" />
        </View>

        <Text style={{ fontSize: 24, fontFamily: 'Inter_700Bold', color: '#0F172A', marginBottom: 8 }}>Added to Cart!</Text>
        
        {item && (
          <Text style={{ fontSize: 16, fontFamily: 'Inter_500Medium', color: '#64748B', textAlign: 'center', marginBottom: 24 }}>
            1 {item.name} added successfully
          </Text>
        )}

        <View style={{ flexDirection: 'row', width: '100%', gap: 12 }}>
          <TouchableOpacity
            onPress={handleClose}
            style={{ flex: 1, paddingVertical: 14, borderRadius: 100, backgroundColor: '#F1F5F9', alignItems: 'center' }}
            activeOpacity={0.8}
          >
            <Text style={{ fontSize: 14, fontFamily: 'Inter_600SemiBold', color: '#64748B' }}>CONTINUE</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            onPress={() => {
              handleClose();
              router.push('/cart');
            }}
            style={{ flex: 1, paddingVertical: 14, borderRadius: 100, backgroundColor: '#10B981', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', shadowColor: '#10B981', shadowOffset: {width:0, height:4}, shadowOpacity: 0.3, shadowRadius: 8 }}
            activeOpacity={0.8}
          >
            <ShoppingCart size={16} color="#FFF" style={{ marginRight: 6 }} />
            <Text style={{ fontSize: 14, fontFamily: 'Inter_600SemiBold', color: '#FFFFFF' }}>VIEW CART</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </Animated.View>
  );
}
