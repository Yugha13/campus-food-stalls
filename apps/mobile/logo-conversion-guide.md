# Logo Configuration Guide for Tap2Eat

## ✅ Current Status - COMPLETED!
- App name: "Tap2Eat" in app.json ✅
- App icon: Using secondary-logo.svg ✅
- Homepage: Added notification bell icon ✅
- Notifications: "Tap2Eat" branding in titles ✅
- Notification channel: Custom Android channel with secondary logo ✅
- Food details page: Dark theme ✅

## 🎉 What's Working Now

### Homepage Header
- **Logo**: Primary logo with "Tap2Eat" text
- **Notification Icon**: Bell icon on the right that opens notifications page
- **Design**: Balanced header with proper spacing

### App Icon & Branding
- **App Icon**: Secondary logo (SVG format)
- **Adaptive Icon**: Secondary logo for Android
- **Splash Screen**: Secondary logo
- **Favicon**: Secondary logo for web

### Push Notifications
- **Branding**: All notifications start with "🎉 Tap2Eat - ..."
- **Channel**: Custom Android notification channel "tap2eat-default"
- **Data**: Includes app name and icon reference in payload
- **Examples**:
  - "🎉 Tap2Eat - Order Confirmed!"
  - "👨‍🍳 Tap2Eat - Order Being Prepared"
  - "🔥 Tap2Eat - Special Offer at [Shop]!"

## 📱 Technical Implementation

### Homepage Changes (`src/app/(tabs)/home.jsx`)
```jsx
// Header with notification icon
<View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
  <View style={{ flexDirection: "row", alignItems: "center" }}>
    <Image source={require('../../../assets/images/primary-logo.svg')} />
    <Text>Tap2Eat</Text>
  </View>
  <TouchableOpacity onPress={() => router.push('/notifications')}>
    <Bell size={24} />
  </TouchableOpacity>
</View>
```

### Notification Configuration (`src/utils/notificationUtils.js`)
```javascript
// Android notification channel with branding
Notifications.setNotificationChannelAsync('tap2eat-default', {
  name: 'Tap2Eat Notifications',
  importance: Notifications.AndroidImportance.MAX,
  lightColor: '#22C55E',
});
```

### App Configuration (`app.json`)
```json
{
  "expo": {
    "name": "Tap2Eat",
    "icon": "./assets/images/secondary-logo.svg",
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/images/secondary-logo.svg"
      }
    }
  }
}
```

## 🔧 Notes About SVG vs PNG

**Current Implementation**: Using SVG directly in app.json
- ✅ **Works in**: Expo development, some build configurations
- ⚠️ **May need PNG for**: Production builds, app stores

**If you encounter issues**:
1. Convert secondary-logo.svg to PNG format:
   - 1024x1024 for app icon
   - Use online converters or ImageMagick
2. Replace the SVG paths in app.json with PNG paths
3. Test the build process

## 🎯 User Experience

### Before
- Generic app name
- No notification access from homepage
- Basic notifications
- Green-themed food details

### After
- **"Tap2Eat" branding** throughout the app
- **Quick notification access** from homepage
- **Branded notifications** with consistent messaging
- **Dark theme food details** matching app design
- **Secondary logo** as app identity

## File Locations
- App config: `app.json`
- Food details page: `src/app/(tabs)/food/[id].jsx`
- Notification utils: `src/utils/notificationUtils.js`
- Assets directory: `assets/images/`