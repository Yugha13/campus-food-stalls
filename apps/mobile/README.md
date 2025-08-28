# Mobile App

This is a React Native mobile application built with Expo for food ordering and delivery services.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npx expo start
   ```

3. View on your device:
   - Scan the QR code with Expo Go (Android) or Camera app (iOS)
   - Press 'i' to open in iOS simulator
   - Press 'a' to open in Android emulator
   - Press 'w' to open in web browser

## Project Structure

- `src/` - Application source code
- `assets/` - Static assets like images and fonts
- `__create/` - Build and configuration utilities
- `polyfills/` - Platform-specific polyfills

## Features

### Home Page
- Redesigned UI with consistent color scheme
- "Best Ordered Food Today" featured section
- "Best Food Store of the Week" featured section
- Shop listings with icons and names
- Improved shop details page with enhanced UI

### Shopping Experience
- Seamless add-to-cart functionality with session persistence
- Wishlist for saving favorite items
- Order timing system with:
  - Default time intervals (5-20 minutes)
  - Custom time selection (hour first, then minutes in 5-minute increments)
  - Available times from current time until 10PM
  - Pickup/dine options available only at checkout

### User Profile
- Enhanced profile UI
- Order history with review options
- Wishlist items display

### Food Details
- Redesigned page for better user experience
- Prominent display of all reviews

### Search Functionality
- Toggle between "Food" (default) and "Shop" modes
- Mode-specific search results
- Advanced filters:
  - Location (BH1, BH6, BH4, Apartment, GH1, GH2, GH4, Library, Main Gate)
  - Price range
  - Other relevant filters
- Improved search results UI

## Dependencies

This project uses:
- Expo SDK
- React Navigation
- React Query
- Reanimated for animations
- And various Expo modules for device functionality

## Troubleshooting

If you encounter issues with the Metro bundler:
1. Clear the Metro cache: `npx expo start --clear`
2. Ensure all dependencies are installed correctly
3. Check for any errors in the console output