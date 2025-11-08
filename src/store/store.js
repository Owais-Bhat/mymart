import {configureStore} from '@reduxjs/toolkit';
import cartReducer from './slices/cartSlice';
import favoritesReducer from './slices/favoritesSlice';
import ordersReducer from './slices/ordersSlice';

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    favorites: favoritesReducer,
    orders: ordersReducer,
  },
});
