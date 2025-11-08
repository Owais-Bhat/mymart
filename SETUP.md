# Quick Setup Guide (Expo + Redux)

## Prerequisites
- Node.js 18+ installed
- npm or yarn installed
- Expo Go app on your phone (optional, for testing)

## Installation Steps

### 1. Install Dependencies
```bash
npm install
```

### 2. Start the Development Server
```bash
npm start
```

This will:
- Start the Metro bundler
- Show a QR code
- Open Expo DevTools in your browser

### 3. Run on Device/Emulator

#### Option 1: Using Expo Go (Recommended for Testing)
1. Install Expo Go app on your phone
2. Scan the QR code from the terminal
3. The app will load on your device

#### Option 2: Using Emulator/Simulator
```bash
# Android
npm run android

# iOS (macOS only)
npm run ios
```

## Building APK

### Using EAS Build (Recommended)

1. Install EAS CLI:
```bash
npm install -g eas-cli
```

2. Login to Expo:
```bash
eas login
```

3. Configure the project:
```bash
eas build:configure
```

4. Build Android APK:
```bash
eas build --platform android --profile preview
```

5. Download the APK from the Expo dashboard

### Using Expo Build (Legacy - may be deprecated)

```bash
expo build:android -t apk
```

## Troubleshooting

### Common Issues

1. **Metro bundler issues**
   - Clear cache: `npm start -- --reset-cache`
   - Delete `node_modules` and reinstall: `rm -rf node_modules && npm install`

2. **Expo Go connection issues**
   - Make sure your phone and computer are on the same WiFi network
   - Try using tunnel mode: `npm start -- --tunnel`

3. **Redux state not updating**
   - Make sure you're using `useAppDispatch` and `useAppSelector` hooks
   - Check Redux DevTools for state changes

4. **Reanimated not working**
   - Make sure you've added the plugin to babel.config.js
   - Restart Metro bundler
   - Clear cache and restart

5. **Build errors**
   - Make sure all dependencies are installed
   - Check Expo SDK version compatibility
   - Clear Expo cache: `expo start -c`

## Project Structure

```
src/
├── store/              # Redux store configuration
│   ├── store.js        # Store setup
│   ├── hooks.js        # Typed hooks
│   └── slices/         # Redux slices
│       └── cartSlice.js
├── screens/            # App screens
│   ├── HomeScreen.js
│   ├── ProductDetailScreen.js
│   └── CartScreen.js
├── navigation/         # Navigation setup
│   └── AppNavigator.js
└── services/           # API services
    └── api.js
```

## Redux Usage

### Accessing State
```javascript
import {useAppSelector} from '../store/hooks';
import {selectCartItemCount} from '../store/slices/cartSlice';

const cartCount = useAppSelector(selectCartItemCount);
```

### Dispatching Actions
```javascript
import {useAppDispatch} from '../store/hooks';
import {addToCart} from '../store/slices/cartSlice';

const dispatch = useAppDispatch();
dispatch(addToCart(product));
```

## Notes

- The app uses Fake Store API (https://fakestoreapi.com) - no API key needed
- Animations require react-native-reanimated to be properly configured
- Make sure you have internet connection to fetch products
- Redux state is reset when the app is closed (not persisted)

## Development Tips

1. **Hot Reload**: Changes are automatically reflected in the app
2. **Debugging**: Use React Native Debugger or Chrome DevTools
3. **State Inspection**: Use Redux DevTools browser extension
4. **Performance**: Use React DevTools Profiler to identify performance issues

## Next Steps

1. Test the app on your device using Expo Go
2. Build an APK for distribution
3. Add more features (wishlist, user auth, etc.)
4. Deploy to app stores using EAS Build
