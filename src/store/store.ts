import { configureStore } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage'; // for React Native
import authReducer from './slices/auth/authSlice';
import themeReducer from './slices/theme/themeSlice';
import attendanceReducer from './slices/attendance/attendanceSlice';
import dropdownReducer from './slices/dropdown/dropdownSlice';
import ajaxReducer from './slices/ajax/ajaxSlice';
import pageReducer from './slices/page/pageSlice';
import syncLocationReducer from './slices/location/syncLocationSlice';

// Persist config only for auth
const authPersistConfig = {
  key: 'auth',
  storage: AsyncStorage,
  whitelist: ['token', 'isPinLoaded', 'isAuthenticated', 'user'], 
};

const persistedAuthReducer = persistReducer(authPersistConfig, authReducer);

export const store = configureStore({
  reducer: {
    auth: persistedAuthReducer, // use persisted version
    theme: themeReducer,
    attendance: attendanceReducer,
    dropdown: dropdownReducer,
    ajax: ajaxReducer,
    page: pageReducer,
    syncLocation: syncLocationReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
