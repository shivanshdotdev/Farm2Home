import { products as initialProducts, farmers as initialFarmers } from '../data/mockData';

// --- FARMERS ---

export const getAllFarmers = () => {
  return initialFarmers.map(farmer => {
    const stored = localStorage.getItem(`farm2home_farmer_profile_${farmer.id}`);
    return stored ? JSON.parse(stored) : farmer;
  });
};

export const getFarmerProfile = (farmerId) => {
  const stored = localStorage.getItem(`farm2home_farmer_profile_${farmerId}`);
  if (stored) {
    return JSON.parse(stored);
  }
  return initialFarmers.find(f => f.id === farmerId);
};

export const saveFarmerProfile = (farmerId, profile) => {
  localStorage.setItem(`farm2home_farmer_profile_${farmerId}`, JSON.stringify(profile));
};

// --- PRODUCTS ---

export const getProducts = () => {
  const stored = localStorage.getItem('farm2home_products');
  if (stored) {
    return JSON.parse(stored);
  }
  return [...initialProducts]; // Return a copy of initial products
};

export const saveProducts = (products) => {
  localStorage.setItem('farm2home_products', JSON.stringify(products));
};

export const addProduct = (product) => {
  const products = getProducts();
  const newProduct = {
    ...product,
    id: `p${Date.now()}` // Use timestamp for unique ID
  };
  products.unshift(newProduct);
  saveProducts(products);
  return products;
};

export const updateProduct = (productId, updatedData) => {
  const products = getProducts();
  const updatedProducts = products.map(p => 
    p.id === productId ? { ...p, ...updatedData } : p
  );
  saveProducts(updatedProducts);
  return updatedProducts;
};

export const deleteProduct = (productId) => {
  const products = getProducts();
  const filteredProducts = products.filter(p => p.id !== productId);
  saveProducts(filteredProducts);
  return filteredProducts;
};
