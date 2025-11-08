import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  items: [],
};

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    addToFavorites: (state, action) => {
      const product = action.payload;
      const exists = state.items.find((item) => item.id === product.id);
      if (!exists) {
        state.items.push(product);
      }
    },
    removeFromFavorites: (state, action) => {
      const productId = action.payload;
      state.items = state.items.filter((item) => item.id !== productId);
    },
    toggleFavorite: (state, action) => {
      const product = action.payload;
      const index = state.items.findIndex((item) => item.id === product.id);
      if (index >= 0) {
        state.items.splice(index, 1);
      } else {
        state.items.push(product);
      }
    },
  },
});

export const {addToFavorites, removeFromFavorites, toggleFavorite} =
  favoritesSlice.actions;

// Selectors
export const selectFavorites = (state) => state.favorites.items;

export const selectIsFavorite = (state, productId) => {
  return state.favorites.items.some((item) => item.id === productId);
};

export default favoritesSlice.reducer;

