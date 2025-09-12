import { configureStore } from '@reduxjs/toolkit';
import { authSlice } from './slices/authSlice.js';
import { pokemonSlice } from './slices/pokemonSlice.js';
import { uiSlice } from './slices/uiSlice.js';

export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    pokemon: pokemonSlice.reducer,
    ui: uiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

// Expthertther tipthe fther usthe in hooks
export const useAppDispatch = () => store.dispatch;
export const useAppSelector = (selector) => selector(store.getState());
