# Troubleshooting Guide

## React Native Reanimated Plugin Error

If you're getting the error:
```
TypeError: Cannot read properties of undefined (reading 'opts')
```

### Solution 1: Clear all caches and reinstall

```bash
# Remove node_modules and caches
rm -rf node_modules package-lock.json .expo node_modules/.cache

# Reinstall dependencies
npm install

# Clear Expo cache and start
npx expo start --clear
```

### Solution 2: Verify babel.config.js

Make sure `babel.config.js` has the Reanimated plugin as the LAST plugin:

```javascript
module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      'react-native-reanimated/plugin',  // MUST be last
    ],
  };
};
```

### Solution 3: Check Expo SDK compatibility

Make sure all packages are compatible with your Expo SDK version:

```bash
npx expo install --fix
```

This will automatically fix version mismatches.

### Solution 4: If using Expo SDK 51+

For Expo SDK 51+, you might need to use the plugin in `app.json` instead:

**app.json:**
```json
{
  "expo": {
    "plugins": [
      "react-native-reanimated/plugin"
    ]
  }
}
```

**babel.config.js:**
```javascript
module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
  };
};
```

### Solution 5: Downgrade to Expo SDK 50 (Most Stable)

If issues persist, use Expo SDK 50 which is more stable:

```bash
npx expo install expo@~50.0.0
npx expo install --fix
```

### Current Configuration

- **Expo SDK**: 51.0.0
- **React Native Reanimated**: ~3.10.1
- **Plugin Location**: babel.config.js (as last plugin)
- **app.json**: No plugin configuration (handled by babel.config.js)

## Common Issues

### Metro bundler cache issues
```bash
npx expo start --clear
```

### Node modules issues
```bash
rm -rf node_modules package-lock.json
npm install
```

### Expo cache issues
```bash
rm -rf .expo
npx expo start --clear
```

## Still Having Issues?

1. Check Expo documentation: https://docs.expo.dev/
2. Check React Native Reanimated docs: https://docs.swmansion.com/react-native-reanimated/
3. Verify your Node.js version (should be 18+)
4. Make sure you're using the latest npm/yarn

