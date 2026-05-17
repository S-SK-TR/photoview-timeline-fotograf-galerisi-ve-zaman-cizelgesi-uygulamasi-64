import React, { createContext, useContext } from 'react';
import { createStore, useStore as useZustandStore } from 'zustand';

const StoreContext = createContext();

const useZustandStoreWrapper = (api) => {
  const store = useZustandStore(api);
  return store;
};

export const StoreProvider = ({ children }) => {
  const store = createStore((set) => ({
    // Initial state
    photos: [],
    loading: false,
    error: null,

    // Actions
    setPhotos: (photos) => set({ photos }),
    setLoading: (loading) => set({ loading }),
    setError: (error) => set({ error }),
  }));

  return (
    <StoreContext.Provider value={store}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const store = useContext(StoreContext);
  return useZustandStoreWrapper(store);
};
