# MyMart - E-Commerce App 🛍️

A beautiful shopping app built with React Native, Expo, and Redux. Browse products, add to cart, favorite items, and track your orders - all in one place!

## 🌟 What This App Does

This is a complete e-commerce mobile app where you can:
- **Browse Products** - See all products in a beautiful grid layout
- **Search** - Find products by name or category
- **Add to Favorites** - Save your favorite products with a heart ❤️
- **Shopping Cart** - Add items, adjust quantities, and checkout
- **Place Orders** - Complete purchases and see order history
- **Track Orders** - Watch your orders progress from placement to delivery
- **Discount Popup** - Get special discount codes when you open the app

## 🚀 Quick Start

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Start the App
```bash
npm start
```

### Step 3: Run on Your Device
- **Android**: Press `a` or scan the QR code with Expo Go app
- **iOS**: Press `i` or scan the QR code with Camera app (iPhone)

That's it! The app will open on your device. 🎉

## 📱 App Features

### 🏠 Home Screen
- View all products in a beautiful 2-column grid
- Search for products by name or category
- Tap the heart ❤️ icon to add products to favorites
- Tap any product to see details
- See cart count badge on the cart icon
- Discount popup appears automatically (you can close it)

### ❤️ Favorites Screen
- See all your favorite products in one place
- Tap any product to view details
- Remove favorites by tapping the heart icon
- Beautiful animations when adding/removing

### 🛒 Cart Screen
- See all items you've added to cart
- Increase or decrease quantities
- Remove items you don't want
- See total price
- Checkout to place an order

### 📦 Orders Screen
- View all your past orders
- See order status (Pending, Confirmed, Shipped, Delivered, etc.)
- Tap any order to track it
- See order date and total amount

### 📍 Order Tracking Screen
- Watch your order progress in real-time
- See each step: Order Placed → Confirmed → Processing → Shipped → Out for Delivery → Delivered
- View order details and items
- See estimated delivery date
- **Demo Mode**: Order status updates automatically every 5 seconds (for demonstration)

### 🎯 Product Detail Screen
- See full product image, title, price, and description
- View product rating and reviews
- Add to favorites
- Add to cart
- Beautiful animations

## 🎨 Design Features

- **Smooth Animations** - Fade in, fade out, and slide animations throughout
- **Modern UI** - Clean, beautiful design with shadows and rounded corners
- **Responsive** - Works on all screen sizes
- **Color Scheme** - Beautiful purple theme (#6366f1)
- **Easy Navigation** - Smooth transitions between screens

## 📂 Project Structure

```
test/
├── App.js                    # Main app file (sets up Redux)
├── index.js                  # App entry point
├── src/
│   ├── store/                # Redux store (state management)
│   │   ├── store.js          # Main store configuration
│   │   ├── hooks.js          # Helper hooks for Redux
│   │   └── slices/           # Redux slices (cart, favorites, orders)
│   ├── screens/              # All app screens
│   │   ├── HomeScreen.js     # Product listing
│   │   ├── ProductDetailScreen.js
│   │   ├── CartScreen.js
│   │   ├── FavoritesScreen.js
│   │   ├── OrdersScreen.js
│   │   └── OrderTrackingScreen.js
│   ├── components/           # Reusable components
│   │   └── DiscountPopup.js
│   ├── navigation/           # Navigation setup
│   │   └── AppNavigator.js
│   └── services/             # API calls
│       └── api.js
```

## 🛠️ Technologies Used

- **React Native** - Build mobile apps
- **Expo** - Easy development and deployment
- **Redux Toolkit** - Manage app state (cart, favorites, orders)
- **React Navigation** - Navigate between screens
- **React Native Reanimated** - Smooth animations
- **Axios** - Fetch data from API

## 📚 How It Works

### State Management (Redux)
The app uses Redux to manage:
- **Cart** - Items you add to cart
- **Favorites** - Products you favorite
- **Orders** - Orders you place

All this data is stored in one central place (Redux store), so any screen can access it.

### Data Flow
1. You open the app → Fetches products from API
2. You add to cart → Updates Redux store
3. You checkout → Creates order in Redux store
4. You view orders → Reads from Redux store

### API
The app uses [Fake Store API](https://fakestoreapi.com) to get product data. No login required!

## 🎓 Learning Resources

If you want to understand how everything works in detail, check out:
- **REDUX_GUIDE.md** - Complete explanation of Redux and how it works in this app
- **EXPLANATION.md** - Detailed breakdown of every part of the app

## 🐛 Troubleshooting

### App won't start?
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm start -- --clear
```

### Can't see products?
- Make sure you have internet connection
- The app fetches products from an online API

### Animations not working?
- Make sure react-native-reanimated is properly installed
- Restart the app

## 📝 Notes

- **Cart and Favorites**: Data is saved only during the app session. If you close the app, it will reset.
- **Orders**: Orders are stored in Redux state. They persist until you close the app.
- **Demo Mode**: Order tracking updates automatically every 5 seconds for demonstration purposes.

## 🎯 Future Improvements

- Save data permanently (using AsyncStorage)
- User login and accounts
- Payment integration
- Push notifications for order updates
- Product reviews and ratings
- Wishlist sharing

## 🙏 Credits

- **Products**: [Fake Store API](https://fakestoreapi.com)
- **Built with**: React Native, Expo, Redux Toolkit
- **Design**: Custom modern UI

---

**Happy Shopping! 🛍️✨**
