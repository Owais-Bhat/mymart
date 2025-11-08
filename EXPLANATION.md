# Complete Code Explanation - MyMart App 📖

This document explains every part of the app in detail. Read this to understand how everything works!

## 🏗️ App Architecture

### How the App Starts

```
index.js → App.js → AppNavigator → Screens
```

1. **index.js** - Entry point, registers the app
2. **App.js** - Wraps app with Redux Provider
3. **AppNavigator.js** - Sets up navigation
4. **Screens** - Individual screens (Home, Cart, etc.)

---

## 📁 File by File Explanation

### 1. index.js
**Location**: `index.js`

**What it does:**
- This is the first file that runs
- Registers the app with React Native
- Uses Expo's `registerRootComponent` to start the app

**Code Breakdown:**
```javascript
import {registerRootComponent} from 'expo';
import App from './App';

registerRootComponent(App);
```

**In Simple Terms:**
- "Hey Expo, this is my app (App.js), please start it!"

---

### 2. App.js
**Location**: `App.js`

**What it does:**
- Sets up Redux Provider (makes Redux store available to all screens)
- Sets up Gesture Handler (for touch gestures)
- Configures Status Bar (the top bar on phone)

**Code Breakdown:**
```javascript
import {Provider} from 'react-redux';
import {store} from './src/store/store';

const App = () => {
  return (
    <Provider store={store}>
      {/* All screens can now use Redux */}
      <AppNavigator />
    </Provider>
  );
};
```

**In Simple Terms:**
- "I'm wrapping my app with Redux, so every screen can access the store"
- Think of Provider as a wrapper that gives all children access to Redux

---

### 3. AppNavigator.js
**Location**: `src/navigation/AppNavigator.js`

**What it does:**
- Sets up navigation between screens
- Defines all screens in the app
- Handles screen transitions

**Code Breakdown:**
```javascript
const Stack = createNativeStackNavigator();

<Stack.Navigator>
  <Stack.Screen name="Home" component={HomeScreen} />
  <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
  <Stack.Screen name="Cart" component={CartScreen} />
  {/* ... more screens */}
</Stack.Navigator>
```

**In Simple Terms:**
- "Here are all the screens in my app and how to navigate between them"
- Like a map of your app's pages

**Navigation Example:**
```javascript
// In any screen, you can navigate like this:
navigation.navigate('Cart');        // Go to cart
navigation.navigate('ProductDetail', {productId: 1}); // Go to product detail with data
navigation.goBack();                // Go back
```

---

## 🖥️ Screen Explanations

### 1. HomeScreen.js
**Location**: `src/screens/HomeScreen.js`

**What it does:**
- Shows all products in a grid
- Allows searching products
- Shows discount popup
- Has buttons for Favorites, Orders, and Cart

**Key Features:**

#### Product List
```javascript
const [products, setProducts] = useState([]);

useEffect(() => {
  loadProducts();  // Load products when screen opens
}, []);

const loadProducts = async () => {
  const data = await fetchProducts();  // Get from API
  setProducts(data);
};
```

**How it works:**
1. Screen loads → `useEffect` runs
2. Calls `loadProducts()` function
3. Fetches products from API
4. Updates `products` state
5. Products appear on screen

#### Search Functionality
```javascript
const [searchQuery, setSearchQuery] = useState('');

useEffect(() => {
  if (searchQuery === '') {
    setFilteredProducts(products);
  } else {
    // Filter products that match search
    const filtered = products.filter(
      (product) =>
        product.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredProducts(filtered);
  }
}, [searchQuery, products]);
```

**How it works:**
1. User types in search box
2. `searchQuery` state updates
3. `useEffect` watches `searchQuery`
4. Filters products that match
5. Shows only matching products

#### Discount Popup
```javascript
const [showDiscountPopup, setShowDiscountPopup] = useState(false);

useEffect(() => {
  // Show popup after 2 seconds
  const timer = setTimeout(() => {
    setShowDiscountPopup(true);
  }, 2000);
  return () => clearTimeout(timer);
}, []);
```

**How it works:**
1. Screen loads
2. After 2 seconds, popup appears
3. User can close it
4. Won't show again until app restarts

#### Favorite Button on Products
```javascript
const isFavorite = useAppSelector((state) => 
  selectIsFavorite(state, item.id)
);

const handleFavoritePress = (e) => {
  e.stopPropagation();  // Don't trigger product card press
  dispatch(toggleFavorite(item));
};
```

**How it works:**
1. Check if product is favorite using Redux selector
2. Show ❤️ if favorite, 🤍 if not
3. When tapped, toggle favorite status
4. `e.stopPropagation()` prevents opening product detail

---

### 2. ProductDetailScreen.js
**Location**: `src/screens/ProductDetailScreen.js`

**What it does:**
- Shows detailed product information
- Allows adding to cart
- Allows adding to favorites

**Key Features:**

#### Loading Product
```javascript
const {productId} = route.params;  // Get ID from navigation
const [product, setProduct] = useState(null);

useEffect(() => {
  loadProduct();
}, [productId]);

const loadProduct = async () => {
  const data = await fetchProductById(productId);
  setProduct(data);
};
```

**How it works:**
1. Get product ID from navigation params
2. Fetch product details from API
3. Store in state
4. Display on screen

#### Add to Cart
```javascript
const dispatch = useAppDispatch();

const handleAddToCart = () => {
  dispatch(addToCart(product));
  Alert.alert('Success', 'Product added to cart!');
};
```

**How it works:**
1. User taps "Add to Cart"
2. Dispatch `addToCart` action to Redux
3. Product added to cart in Redux store
4. Show success message
5. Cart badge updates automatically

#### Favorite Toggle
```javascript
const isFavorite = useAppSelector((state) =>
  selectIsFavorite(state, product.id)
);

const handleToggleFavorite = () => {
  dispatch(toggleFavorite(product));
};
```

**How it works:**
1. Check if product is favorite
2. Show appropriate heart icon
3. When tapped, toggle favorite
4. Icon updates immediately

---

### 3. CartScreen.js
**Location**: `src/screens/CartScreen.js`

**What it does:**
- Shows all cart items
- Allows updating quantities
- Allows removing items
- Shows total price
- Handles checkout

**Key Features:**

#### Displaying Cart Items
```javascript
const cartItems = useAppSelector(selectCartItems);

<FlatList
  data={cartItems}
  renderItem={({item}) => <CartItem item={item} />}
/>
```

**How it works:**
1. Get cart items from Redux store
2. Display each item in a list
3. If cart is empty, show empty state

#### Update Quantity
```javascript
const dispatch = useAppDispatch();

<TouchableOpacity
  onPress={() =>
    dispatch(updateQuantity({
      productId: item.id,
      quantity: item.quantity - 1
    }))
  }>
  <Text>-</Text>
</TouchableOpacity>
```

**How it works:**
1. User taps - or + button
2. Dispatch `updateQuantity` action
3. Redux updates quantity in store
4. Screen updates automatically
5. Total price recalculates

#### Checkout
```javascript
const handleCheckout = () => {
  // Create order
  dispatch(createOrder({
    items: cartItems,
    totalPrice: totalPrice
  }));
  
  // Clear cart
  dispatch(clearCart());
  
  // Show success message
  Alert.alert('Order Placed! 🎉');
};
```

**How it works:**
1. User taps "Checkout"
2. Create order in Redux store
3. Clear cart
4. Show success message
5. Navigate to orders or home

---

### 4. FavoritesScreen.js
**Location**: `src/screens/FavoritesScreen.js`

**What it does:**
- Shows all favorite products
- Allows removing favorites
- Allows viewing product details

**Key Features:**

#### Displaying Favorites
```javascript
const favorites = useAppSelector(selectFavorites);

<FlatList
  data={favorites}
  renderItem={({item}) => <FavoriteItem item={item} />}
/>
```

**How it works:**
1. Get favorites from Redux store
2. Display in a list
3. If empty, show empty state

#### Removing Favorites
```javascript
const handleRemove = () => {
  dispatch(removeFromFavorites(item.id));
};
```

**How it works:**
1. User taps heart icon
2. Dispatch `removeFromFavorites` action
3. Item removed from Redux store
4. Item disappears with animation
5. List updates automatically

---

### 5. OrdersScreen.js
**Location**: `src/screens/OrdersScreen.js`

**What it does:**
- Shows all orders
- Displays order status
- Allows tracking orders

**Key Features:**

#### Displaying Orders
```javascript
const orders = useAppSelector(selectOrders);

<FlatList
  data={orders}
  renderItem={({item}) => <OrderCard item={item} />}
/>
```

**How it works:**
1. Get orders from Redux store
2. Display each order in a card
3. Show status, date, items count, total

#### Order Status Colors
```javascript
const getStatusColor = (status) => {
  switch (status) {
    case 'pending': return '#f59e0b';    // Orange
    case 'confirmed': return '#3b82f6';  // Blue
    case 'shipped': return '#6366f1';    // Purple
    case 'delivered': return '#10b981';  // Green
    case 'cancelled': return '#ef4444';  // Red
  }
};
```

**How it works:**
1. Each status has a different color
2. Status badge shows with colored background
3. Easy to see order status at a glance

---

### 6. OrderTrackingScreen.js
**Location**: `src/screens/OrderTrackingScreen.js`

**What it does:**
- Shows order tracking steps
- Updates status in real-time (demo)
- Shows order details

**Key Features:**

#### Tracking Steps
```javascript
{order.tracking.steps.map((step, index) => (
  <TrackingStep
    step={step}
    isCompleted={step.completed}
    isCurrent={step.id === order.tracking.current}
  />
))}
```

**How it works:**
1. Get order from Redux store
2. Display each tracking step
3. Show checkmark if completed
4. Highlight current step

#### Demo Auto-Update
```javascript
useEffect(() => {
  const statuses = ['confirmed', 'processing', 'shipped', ...];
  let currentIndex = order.tracking.steps.findIndex((s) => s.completed);

  const interval = setInterval(() => {
    if (currentIndex < statuses.length - 1) {
      currentIndex++;
      dispatch(updateOrderStatus({
        orderId: order.id,
        status: statuses[currentIndex],
      }));
    }
  }, 5000);  // Update every 5 seconds

  return () => clearInterval(interval);
}, [order]);
```

**How it works:**
1. Set up interval (runs every 5 seconds)
2. Progress through statuses
3. Update order status in Redux
4. Screen updates automatically
5. This is for demo - in real app, status comes from server

---

## 🧩 Component Explanations

### DiscountPopup.js
**Location**: `src/components/DiscountPopup.js`

**What it does:**
- Shows discount popup with animation
- Displays discount code
- Allows copying code

**Key Features:**

#### Modal Display
```javascript
<Modal
  transparent
  visible={visible}
  animationType="none"
>
  <View style={styles.overlay}>
    {/* Popup content */}
  </View>
</Modal>
```

**How it works:**
1. Uses React Native Modal component
2. Shows overlay (semi-transparent background)
3. Popup appears on top
4. User can close by tapping buttons

#### Animations
```javascript
<AnimatedView
  entering={ZoomIn.springify().damping(15)}
  exiting={ZoomOut.duration(200)}
>
  {/* Popup content */}
</AnimatedView>
```

**How it works:**
1. Uses React Native Reanimated
2. Zoom in animation when appearing
3. Zoom out animation when closing
4. Spring animation for smooth effect

---

## 🔌 Service Explanations

### api.js
**Location**: `src/services/api.js`

**What it does:**
- Handles all API calls
- Fetches products from Fake Store API

**Code Breakdown:**
```javascript
const API_BASE_URL = 'https://fakestoreapi.com';

export const fetchProducts = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/products`);
    return response.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};
```

**How it works:**
1. Uses Axios to make HTTP requests
2. Fetches from Fake Store API
3. Returns product data
4. Handles errors

**API Endpoints Used:**
- `GET /products` - Get all products
- `GET /products/:id` - Get single product

---

## 🎨 Styling Explanation

### StyleSheet.create()
All screens use `StyleSheet.create()` for styling:

```javascript
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    padding: 20,
    backgroundColor: '#ffffff',
  },
});
```

**Why StyleSheet.create():**
- Better performance
- Validates styles
- Organizes styles

### Common Styles

#### Colors
```javascript
Primary: '#6366f1'      // Purple
Background: '#f9fafb'   // Light gray
White: '#ffffff'        // White
Text: '#111827'         // Dark gray
Secondary: '#6b7280'    // Medium gray
```

#### Spacing
```javascript
padding: 20           // Standard padding
margin: 15            // Standard margin
borderRadius: 16      // Rounded corners
```

#### Shadows
```javascript
shadowColor: '#000',
shadowOffset: {width: 0, height: 2},
shadowOpacity: 0.1,
shadowRadius: 4,
elevation: 3,  // For Android
```

---

## 🎭 Animation Explanation

### React Native Reanimated

We use `react-native-reanimated` for animations:

```javascript
import {FadeIn, FadeInDown} from 'react-native-reanimated';

<AnimatedView entering={FadeIn.duration(500)}>
  {/* Content */}
</AnimatedView>
```

**Available Animations:**
- `FadeIn` - Fade in
- `FadeOut` - Fade out
- `FadeInDown` - Fade in from top
- `FadeInUp` - Fade in from bottom
- `FadeInRight` - Fade in from left
- `FadeInLeft` - Fade in from right
- `ZoomIn` - Zoom in
- `ZoomOut` - Zoom out

**Animation Options:**
```javascript
FadeIn.delay(100).duration(600)  // Delay 100ms, duration 600ms
ZoomIn.springify().damping(15)   // Spring animation
```

---

## 🔄 State Management Flow

### Local State (useState)
For screen-specific data:

```javascript
const [products, setProducts] = useState([]);
const [loading, setLoading] = useState(true);
```

**When to use:**
- Data only used in one screen
- Temporary data
- UI state (loading, errors)

### Global State (Redux)
For app-wide data:

```javascript
const cartItems = useAppSelector(selectCartItems);
const favorites = useAppSelector(selectFavorites);
```

**When to use:**
- Data used in multiple screens
- Persistent data
- Shared state

---

## 🚀 Data Flow Example

### Adding Product to Cart

```
1. User taps "Add to Cart" button
   ↓
2. ProductDetailScreen.handleAddToCart() called
   ↓
3. dispatch(addToCart(product)) sends action
   ↓
4. Redux cartSlice.addToCart reducer processes
   ↓
5. Redux store updates with new cart item
   ↓
6. All components using cart data re-render:
   - HomeScreen cart badge updates
   - CartScreen shows new item
   - Any other screen using cart data
```

---

## 🎯 Key React Concepts Used

### 1. useState
```javascript
const [state, setState] = useState(initialValue);
```
- Manages component state
- Returns current value and setter function

### 2. useEffect
```javascript
useEffect(() => {
  // Code to run
}, [dependencies]);
```
- Runs code when component mounts or dependencies change
- Used for API calls, subscriptions, etc.

### 3. useNavigation
```javascript
const navigation = useNavigation();
navigation.navigate('ScreenName');
```
- Access navigation object
- Navigate between screens

### 4. useRoute
```javascript
const route = useRoute();
const {productId} = route.params;
```
- Access route parameters
- Get data passed during navigation

---

## 📱 Navigation Flow

```
HomeScreen
  ├─→ ProductDetailScreen (tap product)
  │     ├─→ Cart (add to cart, then navigate)
  │     └─→ Back to Home
  │
  ├─→ FavoritesScreen (tap heart icon)
  │     └─→ ProductDetailScreen (tap product)
  │
  ├─→ OrdersScreen (tap orders icon)
  │     └─→ OrderTrackingScreen (tap order)
  │
  └─→ CartScreen (tap cart icon)
        └─→ OrdersScreen (after checkout)
```

---

## 🐛 Common Issues & Solutions

### Issue 1: Products not loading
**Cause:** API error or no internet
**Solution:** Check internet connection, check API endpoint

### Issue 2: Cart not updating
**Cause:** Redux not connected properly
**Solution:** Check if Provider wraps app, check dispatch calls

### Issue 3: Navigation not working
**Cause:** Screen not registered in navigator
**Solution:** Check AppNavigator.js, ensure screen is added

### Issue 4: Animations not working
**Cause:** Reanimated not configured
**Solution:** Check babel.config.js, restart app

---

## 💡 Tips & Best Practices

1. **Always use selectors** - Don't access Redux state directly
2. **Handle loading states** - Show loading indicators
3. **Handle errors** - Show error messages
4. **Use TypeScript** - For type safety (optional)
5. **Test your code** - Write tests for important functions
6. **Keep components small** - One component, one responsibility
7. **Use meaningful names** - Clear variable and function names
8. **Comment complex logic** - Explain what code does

---

## 🎓 Learning Path

1. **Start with basics** - Understand React Native components
2. **Learn state management** - Understand useState and useEffect
3. **Learn Redux** - Understand Redux basics (read REDUX_GUIDE.md)
4. **Learn navigation** - Understand React Navigation
5. **Practice** - Modify the code, add features
6. **Build** - Create your own app

---

## 📚 Additional Resources

- **React Native Docs**: https://reactnative.dev/docs/getting-started
- **Expo Docs**: https://docs.expo.dev/
- **Redux Toolkit Docs**: https://redux-toolkit.js.org/
- **React Navigation**: https://reactnavigation.org/

---

**Remember**: Understanding code takes time. Start small, build gradually, and don't be afraid to experiment! 🚀

