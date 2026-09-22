import React, { createContext, useContext, useState, useMemo } from 'react';
import { 
  getAllFarmers, 
  getProducts, 
  saveFarmerProfile, 
  addProduct as storageAddProduct, 
  updateProduct as storageUpdateProduct, 
  deleteProduct as storageDeleteProduct 
} from '../services/storage';

const AppContext = createContext();

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null); // { id, name, email, mobile, identityVerified, authMethod, sellerVerified, farmerId }
  const [cart, setCart] = useState([]);
  
  // Load initial state from our storage service
  const [farmers, setFarmers] = useState(() => getAllFarmers());
  const [rawProducts, setRawProducts] = useState(() => getProducts());

  // Dynamically attach the latest farmer profile to each product
  const products = useMemo(() => {
    return rawProducts.map(product => {
      const farmer = farmers.find(f => f.id === product.farmerId);
      return { ...product, farmer };
    });
  }, [rawProducts, farmers]);

  const login = (userData) => {
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
  };

  const addToCart = (product, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
  };

  const removeFromCart = (productId) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const updateCartQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => setCart([]);

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + item.product.price * item.quantity, 0);
  };

  // -- Persistence Methods --

  const updateFarmer = (farmerId, updatedData) => {
    const existingFarmer = farmers.find(f => f.id === farmerId) || {};
    const updatedFarmer = { ...existingFarmer, ...updatedData };
    
    // Save to local storage
    saveFarmerProfile(farmerId, updatedFarmer);
    
    // Update react state
    setFarmers(getAllFarmers());
  };

  const addProduct = (newProduct) => {
    const productData = {
      ...newProduct,
      farmerId: user.farmerId
    };
    
    // Save to local storage
    const updatedProducts = storageAddProduct(productData);
    
    // Update react state
    setRawProducts(updatedProducts);
  };

  const updateProduct = (productId, updatedData) => {
    const updatedProducts = storageUpdateProduct(productId, updatedData);
    setRawProducts(updatedProducts);
  };

  const deleteProduct = (productId) => {
    const updatedProducts = storageDeleteProduct(productId);
    setRawProducts(updatedProducts);
  };

  return (
    <AppContext.Provider
      value={{
        user,
        login,
        logout,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        getCartTotal,
        products,
        farmers,
        addProduct,
        updateProduct,
        deleteProduct,
        updateFarmer
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
