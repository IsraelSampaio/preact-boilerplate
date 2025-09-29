import { configureStore } from '@reduxjs/toolkit';

// Importações das features
import { authSlice } from '../features/auth/store/authSlice.js';
import { pokemonSlice } from '../features/pokemon/store/pokemonSlice.js';
import { favoritesSlice } from '../features/pokemon/store/favoritesSlice.js';
import { comparisonSlice } from '../features/pokemon/store/comparisonSlice.js';

// Importações compartilhadas
import { uiSlice } from '../features/shared/store/uiSlice.js';

export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    pokemon: pokemonSlice.reducer,
    ui: uiSlice.reducer,
    favorites: favoritesSlice.reducer,
    comparison: comparisonSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

// Tipos para hooks já estão definidos em shared/hooks
// export { useAppDispatch, useAppSelector } from '../shared/hooks/index.js';
