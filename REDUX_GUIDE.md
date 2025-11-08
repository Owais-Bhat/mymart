# Complete Redux Guide for Beginners 📚

This guide explains Redux in simple terms and how it's used in this app. Don't worry if you're a beginner - we'll explain everything step by step!

## 🤔 What is Redux?

Think of Redux as a **global storage box** for your app. Instead of passing data around between screens, you put everything in one central place (the Redux store), and any screen can access it whenever needed.

### Real-World Analogy

Imagine you're at a grocery store:
- **Without Redux**: You have to carry your shopping list, wallet, and cart everywhere. If you forget something, you have to go back.
- **With Redux**: There's a central desk that holds everything. You can access your list, wallet, and cart from anywhere in the store, and everything stays in sync.

## 🏗️ Redux Architecture

Redux has three main parts:

1. **Store** - The central storage (like a big box)
2. **Actions** - Commands to change data (like "add to cart")
3. **Reducers** - Functions that actually change the data (like workers who update the box)

Let's see how this works in our app:

## 📦 The Redux Store

The store is like a big object that holds all your app's data. In our app, it looks like this:

```javascript
{
  cart: {
    items: []  // Products in cart
  },
  favorites: {
    items: []  // Favorite products
  },
  orders: {
    orders: []  // All orders
  }
}
```

### Where is the Store?

**File**: `src/store/store.js`

```javascript
import {configureStore} from '@reduxjs/toolkit';
import cartReducer from './slices/cartSlice';
import favoritesReducer from './slices/favoritesSlice';
import ordersReducer from './slices/ordersSlice';

export const store = configureStore({
  reducer: {
    cart: cartReducer,        // Manages cart data
    favorites: favoritesReducer,  // Manages favorites
    orders: ordersReducer,    // Manages orders
  },
});
```

**What this does:**
- Creates a store with three sections: cart, favorites, and orders
- Each section has its own reducer (function that manages that data)

## 🎯 Redux Slices

A "slice" is a piece of the Redux store. Think of it like a drawer in a filing cabinet - each drawer (slice) holds related information.

### 1. Cart Slice 📝

**File**: `src/store/slices/cartSlice.js`

**What it stores:**
- List of items in the cart
- Quantity of each item

**What you can do:**
- Add items to cart
- Remove items from cart
- Update quantities
- Clear the entire cart
- Get total price
- Get item count

**How it works:**

```javascript
// Initial state (empty cart)
const initialState = {
  items: []
};

// Actions (things you can do)
addToCart(product)        // Add a product to cart
removeFromCart(productId) // Remove a product
updateQuantity(productId, quantity) // Change quantity
clearCart()              // Empty the cart

// Selectors (get data from store)
selectCartItems          // Get all cart items
selectCartItemCount      // Get total number of items
selectTotalPrice         // Get total price
```

**Example: Adding to Cart**

```javascript
// When user clicks "Add to Cart"
dispatch(addToCart(product));

// What happens:
// 1. Redux calls the addToCart reducer
// 2. Reducer checks if product already exists
// 3. If exists: increase quantity by 1
// 4. If not: add new item with quantity 1
// 5. Store is updated
// 6. All screens using cart data automatically update!
```

### 2. Favorites Slice ❤️

**File**: `src/store/slices/favoritesSlice.js`

**What it stores:**
- List of favorite products

**What you can do:**
- Add to favorites
- Remove from favorites
- Toggle favorite (add if not favorite, remove if favorite)
- Check if a product is favorite

**How it works:**

```javascript
// Initial state (no favorites)
const initialState = {
  items: []
};

// Actions
addToFavorites(product)      // Add to favorites
removeFromFavorites(productId) // Remove from favorites
toggleFavorite(product)      // Toggle favorite status

// Selectors
selectFavorites              // Get all favorites
selectIsFavorite(productId)  // Check if product is favorite
```

**Example: Toggling Favorite**

```javascript
// When user taps heart icon
dispatch(toggleFavorite(product));

// What happens:
// 1. Redux checks if product is in favorites
// 2. If in favorites: remove it
// 3. If not in favorites: add it
// 4. Heart icon updates automatically (❤️ or 🤍)
```

### 3. Orders Slice 📦

**File**: `src/store/slices/ordersSlice.js`

**What it stores:**
- List of all orders
- Each order has: items, total price, status, tracking info

**What you can do:**
- Create a new order (when checkout)
- Update order status
- Cancel an order
- Get all orders
- Get order by ID

**How it works:**

```javascript
// Initial state (no orders)
const initialState = {
  orders: []
};

// Actions
createOrder({items, totalPrice})  // Create new order
updateOrderStatus({orderId, status}) // Update order status
cancelOrder(orderId)              // Cancel an order

// Selectors
selectOrders                      // Get all orders
selectOrderById(orderId)          // Get specific order
```

**Example: Creating an Order**

```javascript
// When user clicks "Checkout"
dispatch(createOrder({
  items: cartItems,
  totalPrice: 99.99
}));

// What happens:
// 1. Redux generates a unique order ID
// 2. Creates order object with:
//    - Items from cart
//    - Total price
//    - Status: "pending"
//    - Tracking steps (all uncompleted except "Order Placed")
//    - Created date
//    - Estimated delivery date
// 3. Adds order to orders array
// 4. Order appears in Orders screen!
```

## 🔄 How Redux Works: Step by Step

Let's trace what happens when you add a product to cart:

### Step 1: User Action
```javascript
// In ProductDetailScreen.js
const handleAddToCart = () => {
  dispatch(addToCart(product));
};
```

### Step 2: Dispatch Action
```javascript
// dispatch() sends the action to Redux store
dispatch(addToCart(product));
// This is like saying: "Hey Redux, add this product to cart!"
```

### Step 3: Reducer Processes Action
```javascript
// In cartSlice.js
addToCart: (state, action) => {
  const product = action.payload;  // The product we're adding
  const existingItem = state.items.find((item) => item.id === product.id);

  if (existingItem) {
    // Product already in cart: increase quantity
    existingItem.quantity += 1;
  } else {
    // New product: add to cart with quantity 1
    state.items.push({...product, quantity: 1});
  }
}
```

### Step 4: Store Updates
```javascript
// Redux automatically updates the store
// Before: { cart: { items: [] } }
// After:  { cart: { items: [{id: 1, title: "Product", quantity: 1}] } }
```

### Step 5: Components Re-render
```javascript
// Any component using cart data automatically updates!
// In HomeScreen.js
const cartItemCount = useAppSelector(selectCartItemCount);
// This automatically gets the new count and updates the badge!
```

## 🎣 Redux Hooks

Hooks are special functions that let components interact with Redux.

### useAppDispatch()
**What it does:** Gets the dispatch function to send actions

```javascript
const dispatch = useAppDispatch();

// Now you can dispatch actions
dispatch(addToCart(product));
dispatch(removeFromCart(productId));
```

### useAppSelector()
**What it does:** Gets data from the Redux store

```javascript
// Get cart items
const cartItems = useAppSelector(selectCartItems);

// Get cart count
const cartCount = useAppSelector(selectCartItemCount);

// Get total price
const totalPrice = useAppSelector(selectTotalPrice);

// Get favorites
const favorites = useAppSelector(selectFavorites);

// Check if product is favorite
const isFavorite = useAppSelector((state) => 
  selectIsFavorite(state, productId)
);
```

## 📊 Data Flow Diagram

```
User clicks "Add to Cart"
         ↓
Component calls dispatch(addToCart(product))
         ↓
Action sent to Redux Store
         ↓
Reducer (cartSlice) processes action
         ↓
Store state updates
         ↓
All components using cart data automatically re-render
         ↓
Cart badge updates, Cart screen updates, etc.
```

## 🎯 Real Examples from Our App

### Example 1: Adding to Cart

**In ProductDetailScreen.js:**
```javascript
const dispatch = useAppDispatch();

const handleAddToCart = () => {
  dispatch(addToCart(product));  // Send action to Redux
};
```

**What happens:**
1. User taps "Add to Cart" button
2. `dispatch(addToCart(product))` is called
3. Redux reducer adds product to cart
4. Cart badge in header updates automatically
5. Cart screen shows the new item

### Example 2: Viewing Cart Count

**In HomeScreen.js:**
```javascript
const cartItemCount = useAppSelector(selectCartItemCount);

// In the header:
<Text>{cartItemCount}</Text>  // Shows current count
```

**What happens:**
1. Component reads cart count from Redux store
2. If cart changes, count automatically updates
3. Badge shows new number without any extra code!

### Example 3: Creating an Order

**In CartScreen.js:**
```javascript
const dispatch = useAppDispatch();
const cartItems = useAppSelector(selectCartItems);
const totalPrice = useAppSelector(selectTotalPrice);

const handleCheckout = () => {
  // Create order from cart items
  dispatch(createOrder({
    items: cartItems,
    totalPrice: totalPrice
  }));
  
  // Clear cart
  dispatch(clearCart());
};
```

**What happens:**
1. User clicks "Checkout"
2. Order is created in Redux store
3. Cart is cleared
4. Order appears in Orders screen
5. User can track the order

## 🔍 Understanding Redux Toolkit

We use **Redux Toolkit** (RTK), which is the modern way to use Redux. It makes things simpler!

### Traditional Redux vs Redux Toolkit

**Traditional Redux (Complex):**
```javascript
// Lots of boilerplate code
// Actions, action creators, reducers separate
// More code to write
```

**Redux Toolkit (Simple):**
```javascript
// Everything in one place
// Less code
// Easier to understand
// Built-in best practices
```

### createSlice() - The Magic Function

`createSlice` automatically creates:
- Actions (from reducer names)
- Action creators (functions to dispatch)
- Reducer (function that updates state)

```javascript
const cartSlice = createSlice({
  name: 'cart',
  initialState: { items: [] },
  reducers: {
    addToCart: (state, action) => {
      // This automatically creates:
      // - Action: { type: 'cart/addToCart', payload: ... }
      // - Action creator: addToCart()
      state.items.push(action.payload);
    }
  }
});

// Automatically exports:
export const { addToCart } = cartSlice.actions;
export default cartSlice.reducer;
```

## 🎓 Key Concepts

### 1. Immutability
Redux doesn't change the old state - it creates a new state. This is called "immutability."

```javascript
// ❌ Wrong (mutating state)
state.items.push(newItem);

// ✅ Right (creating new state)
state.items = [...state.items, newItem];
```

But with Redux Toolkit, you can write like the first way - it handles immutability for you!

### 2. Pure Functions
Reducers are "pure functions" - they always return the same output for the same input.

```javascript
// ✅ Pure function
const add = (a, b) => a + b;
add(2, 3); // Always returns 5

// ❌ Not pure (depends on external state)
let counter = 0;
const add = (a) => counter + a; // Different result each time!
```

### 3. Single Source of Truth
All app data is in one place (the Redux store). This makes it easier to:
- Debug issues
- Track changes
- Share data between screens

## 🚀 Benefits of Redux

1. **Centralized State** - All data in one place
2. **Predictable** - Same input always gives same output
3. **Debuggable** - Easy to see what changed and when
4. **Testable** - Easy to test reducers and actions
5. **Scalable** - Works great for large apps

## 📝 Common Patterns

### Pattern 1: Reading Data
```javascript
// Get data from store
const data = useAppSelector(selectData);

// Use in component
<Text>{data.length} items</Text>
```

### Pattern 2: Updating Data
```javascript
// Get dispatch function
const dispatch = useAppDispatch();

// Dispatch action
dispatch(updateData(newData));
```

### Pattern 3: Conditional Rendering
```javascript
// Check if item exists
const isFavorite = useAppSelector((state) => 
  selectIsFavorite(state, productId)
);

// Use in component
{isFavorite ? <Text>❤️</Text> : <Text>🤍</Text>}
```

## 🎯 Summary

**Redux in 3 sentences:**
1. Redux is a global storage box for your app's data
2. You use `dispatch()` to change data and `useAppSelector()` to read data
3. When data changes, all components using that data automatically update

**Key Files:**
- `src/store/store.js` - Store configuration
- `src/store/slices/cartSlice.js` - Cart logic
- `src/store/slices/favoritesSlice.js` - Favorites logic
- `src/store/slices/ordersSlice.js` - Orders logic
- `src/store/hooks.js` - Helper hooks

**Key Functions:**
- `dispatch(action)` - Change data
- `useAppSelector(selector)` - Read data
- `useAppDispatch()` - Get dispatch function

## 💡 Tips for Beginners

1. **Start Small** - Don't put everything in Redux. Only global state needs Redux.
2. **Use Selectors** - Always use selectors to read data (don't access state directly)
3. **Name Clearly** - Use clear names for actions and selectors
4. **Keep Reducers Simple** - Each reducer should do one thing
5. **Test Your Actions** - Make sure actions work as expected

## 🎓 Next Steps

1. Open `src/store/slices/cartSlice.js` and read through it
2. Try adding a new action (like `increaseQuantity`)
3. Use Redux DevTools to see state changes in real-time
4. Practice by modifying the cart logic

---

**Remember**: Redux is just a way to manage data. Don't overthink it! Start with the basics and build from there. 🚀

