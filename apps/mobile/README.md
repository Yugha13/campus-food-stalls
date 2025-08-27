# Mobile App

This is a React Native mobile application built with Expo.

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