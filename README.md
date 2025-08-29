# Tap2Eat - Campus Food Delivery Platform

🍕 **A comprehensive food ordering and delivery platform designed specifically for campus environments**

Tap2Eat is a modern, full-stack food delivery application featuring both mobile and web interfaces. Built with React Native (Expo) for mobile and Next.js for web, it provides a seamless food ordering experience for students and campus communities.

## 🚀 Key Features

### 📱 **Mobile Experience (React Native + Expo)**
- **Dual-Platform Support**: iOS and Android with native performance
- **Dark/Light Theme**: Automatic theme switching based on system preferences
- **Push Notifications**: Branded notifications with order updates and promotions
- **Offline Support**: Cart persistence and offline browsing capabilities

### 🛒 **Shopping & Ordering**
- **Smart Cart System**: Persistent shopping cart with session storage
- **Wishlist Management**: Save and organize favorite food items
- **Flexible Ordering**: 
  - Dine-in, Pickup, and Delivery options
  - Advanced timing system (5-minute intervals, custom scheduling)
  - Available ordering times from current time until 10 PM
- **Order Tracking**: Real-time order status updates with notifications

### 🔍 **Advanced Search & Discovery**
- **Dual-Mode Search**: Toggle between Food and Shop search modes
- **Smart Filtering**:
  - Location-based (BH1, BH6, BH4, Apartment, GH1, GH2, GH4, Library, Main Gate)
  - Price range filtering
  - Food type (Vegetarian/Non-Vegetarian)
  - Preparation time filters
- **Personalized Recommendations**: AI-powered food suggestions

### 🏪 **Shop & Food Management**
- **Production-Level Data**: 50+ shops with 1,500+ food items
- **High-Quality Images**: Professional Unsplash integration (600x400 shop, 400x300 food)
- **Comprehensive Profiles**: Shop ratings, locations, and detailed menus
- **Review System**: User reviews and ratings for shops and food items

### 👤 **User Experience**
- **Profile Management**: User profiles with order history and preferences
- **Order History**: Comprehensive tracking of past orders with reorder options
- **Review & Rating**: Rate and review food items and shops
- **Notification Center**: Centralized notification management

## 🏗️ **Architecture**

```
Tap2Eat/
├── apps/
│   ├── mobile/          # React Native (Expo) - Primary mobile app
│   │   ├── src/
│   │   │   ├── app/     # Expo Router file-based routing
│   │   │   ├── components/  # Reusable UI components
│   │   │   ├── data/    # Mock data and API integration
│   │   │   ├── utils/   # Utilities (cart, notifications, auth)
│   │   │   └── polyfills/  # Platform-specific polyfills
│   │   └── assets/      # Images, logos, and static assets
│   └── web/             # Next.js web application
│       ├── src/
│       │   └── app/     # Next.js 13+ app directory
│       └── public/      # Static web assets
└── shared/              # Shared utilities and types (future)
```

## 🛠️ **Technology Stack**

### Mobile (Primary Platform)
- **Framework**: React Native with Expo SDK 51+
- **Navigation**: Expo Router (file-based routing)
- **Styling**: React Native StyleSheet + Inter font family
- **State Management**: React Hooks + AsyncStorage
- **Notifications**: Expo Notifications with custom channels
- **Images**: Expo Image with Unsplash integration
- **Animations**: React Native Reanimated
- **Icons**: Lucide React Native

### Web (Complementary)
- **Framework**: Next.js 14+ with App Router
- **Styling**: Tailwind CSS
- **UI Components**: Chakra UI integration
- **State Management**: React Hooks

### Shared
- **Language**: TypeScript/JavaScript
- **Package Manager**: npm
- **Development**: Expo Dev Tools, Next.js Dev Server

## 🚀 **Quick Start**

### Prerequisites
- Node.js 18+ and npm
- Expo CLI (`npm install -g @expo/cli`)
- iOS Simulator (macOS) or Android Studio (for emulators)
- Expo Go app (for physical device testing)

### Mobile App Setup
```bash
# Navigate to mobile app
cd apps/mobile

# Install dependencies
npm install

# Start development server
npx expo start

# Options:
# - Scan QR code with Expo Go (Android) or Camera (iOS)
# - Press 'i' for iOS Simulator
# - Press 'a' for Android Emulator  
# - Press 'w' for web browser
```

### Web App Setup
```bash
# Navigate to web app
cd apps/web

# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:3000
```

## 📋 **Development Workflow**

### Project Standards
- **Code Style**: ESLint + Prettier configuration
- **Commit Convention**: Conventional Commits
- **Branch Strategy**: Feature branches with PR reviews
- **Testing**: Unit tests for critical functions

### Key Development Commands
```bash
# Mobile development
cd apps/mobile
npx expo start --clear          # Clear cache and start
npx expo install <package>      # Install Expo-compatible packages
npx expo build                  # Build for production

# Web development  
cd apps/web
npm run dev                     # Development server
npm run build                   # Production build
npm run start                   # Production server
```

## 🎨 **Design System**

### Color Palette
- **Primary Green**: `#22C55E` (success, CTAs)
- **Secondary**: `#16A34A` (accents)
- **Dark Theme**: `#121212` (background), `#1E1E1E` (cards)
- **Light Theme**: `#F8FDF8` (background), `#FFFFFF` (cards)

### Typography
- **Primary Font**: Inter (400, 500, 600 weights)
- **Mobile**: React Native StyleSheet with Inter
- **Web**: Tailwind CSS with system fonts

### Components
- **Mobile**: Custom React Native components
- **Web**: Tailwind + Chakra UI hybrid
- **Icons**: Lucide icon library for consistency

## 🔧 **Configuration & Deployment**

### Mobile App Configuration
- **App Name**: Tap2Eat
- **Bundle ID**: `xyz.create.CreateExpoEnvironment`
- **Icons**: Secondary logo (SVG/PNG)
- **Splash Screen**: Branded with secondary logo
- **Permissions**: Audio recording, notifications

### Environment Setup
```bash
# Development
EXPO_PUBLIC_API_URL=http://localhost:3000

# Production
EXPO_PUBLIC_API_URL=https://tap2eat.app
```

## 📱 **Platform-Specific Features**

### iOS
- Native navigation animations
- Haptic feedback integration
- iOS-style notifications
- Optimized for iPhone and iPad

### Android
- Material Design components
- Custom notification channels
- Android-specific permissions
- Adaptive icon support

### Web
- Responsive design (mobile-first)
- Progressive Web App capabilities
- SEO optimized with Next.js
- Cross-browser compatibility

## 🤝 **Contributing**

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Follow code standards**: Use ESLint and Prettier
4. **Test thoroughly**: Ensure mobile and web compatibility
5. **Commit changes**: Use conventional commit format
6. **Submit PR**: Include description and testing notes

### Code Standards
- Use TypeScript where possible
- Follow React Native and Next.js best practices
- Write meaningful component and function names
- Add comments for complex logic
- Ensure responsive design for web components

## 📄 **License & Support**

- **Support**: Create GitHub issues for bugs or feature requests
- **Documentation**: Check individual app READMEs for detailed setup

---

**Built with ❤️ for campus food delivery • Tap2Eat v1.0.0**
