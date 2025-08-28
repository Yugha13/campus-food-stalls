# 3P-LPU Project

This is a monorepo containing both mobile and web applications with a focus on food ordering and delivery.

## Project Structure

```
├── apps/
│   ├── mobile/  # React Native mobile app using Expo
│   └── web/     # React web application
```

## Key Features

### Shopping & Ordering
- Shopping cart with persistent session storage
- Wishlist functionality for saving favorite items
- Advanced order timing system with flexible delivery scheduling

### User Experience
- Redesigned home page with featured food and store sections
- Enhanced shop details pages with improved UI
- Comprehensive user profiles with order history and reviews
- Redesigned food details pages with prominent reviews

### Search & Discovery
- Dual-mode search (Food/Shop) with toggle functionality
- Advanced filtering by location, price range, and more
- Improved search results UI

## Mobile App

### Setup

1. Install dependencies:
   ```bash
   cd apps/mobile
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

## Web App

### Setup

1. Install dependencies:
   ```bash
   cd apps/web
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

## Development Guidelines

- Keep the codebase clean by following the established patterns
- Run tests before committing changes
- Follow the Git workflow for contributions

## Git Guidelines

- Keep commits small and focused
- Write meaningful commit messages
- Use feature branches for new features
- Create pull requests for code reviews# 3p-lpu
