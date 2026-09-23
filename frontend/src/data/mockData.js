export const categories = [
  { id: 'c1', name: 'Vegetables', icon: 'Carrot', color: 'bg-orange-100 text-orange-600' },
  { id: 'c2', name: 'Fruits', icon: 'Apple', color: 'bg-red-100 text-red-600' },
  { id: 'c3', name: 'Grains', icon: 'Wheat', color: 'bg-yellow-100 text-yellow-700' },
  { id: 'c4', name: 'Pulses', icon: 'Bean', color: 'bg-amber-100 text-amber-700' },
  { id: 'c5', name: 'Spices', icon: 'Flame', color: 'bg-red-50 text-red-500' },
  { id: 'c6', name: 'Other Produce', icon: 'Leaf', color: 'bg-green-100 text-green-600' }
];

export const farmers = [
  {
    id: 'f1',
    name: 'Rajesh Kumar',
    location: 'Indore, Madhya Pradesh',
    verified: true,
    experience: '15 Years',
    image: 'https://plus.unsplash.com/premium_photo-1682092016074-b136e1acb26e?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    description: 'Specializes in organic vegetables and wheat. Uses traditional farming methods combined with modern drip irrigation.',
    farmSize: '5 Acres',
    rating: 4.8,
    reviews: 124,
    joinedDate: '2023-01-15'
  },
  {
    id: 'f2',
    name: 'Suresh Patil',
    location: 'Nashik, Maharashtra',
    verified: true,
    experience: '20 Years',
    image: 'https://images.unsplash.com/photo-1608876537010-ac56d8731614?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    description: 'Renowned for high-quality grapes and onions. Certified organic farmer.',
    farmSize: '12 Acres',
    rating: 4.9,
    reviews: 312,
    joinedDate: '2022-11-04'
  },
  {
    id: 'f3',
    name: 'Anil Sharma',
    location: 'Ujjain, Madhya Pradesh',
    verified: true,
    experience: '8 Years',
    image: 'https://images.unsplash.com/photo-1696371269645-7297d31dd4d6?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    description: 'Focuses on pulses and spices. Employs sustainable farming practices.',
    farmSize: '3 Acres',
    rating: 4.5,
    reviews: 56,
    joinedDate: '2024-02-20'
  },
  {
    id: 'f4',
    name: 'Meena Devi',
    location: 'Bhopal, Madhya Pradesh',
    verified: true,
    experience: '12 Years',
    image: 'https://images.unsplash.com/photo-1628477116196-48afe0d209e0?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    description: 'Grows seasonal fruits and vegetables. Expert in multi-cropping.',
    farmSize: '4 Acres',
    rating: 4.7,
    reviews: 89,
    joinedDate: '2023-05-10'
  },
  {
    id: 'f5',
    name: 'Vikram Singh',
    location: 'Sehore, Madhya Pradesh',
    verified: false,
    experience: '5 Years',
    image: 'https://images.unsplash.com/photo-1722925407220-b22e1ced9ee9?q=80&w=765&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    description: 'Young progressive farmer focusing on exotic vegetables and herbs.',
    farmSize: '2 Acres',
    rating: 4.2,
    reviews: 15,
    joinedDate: '2024-08-01'
  }
];

export const products = [
  {
    id: 'p1',
    name: 'Fresh Red Tomatoes',
    categoryId: 'c1',
    categoryName: 'Vegetables',
    price: 40,
    unit: 'kg',
    farmerId: 'f1',
    image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&q=80&w=600',
    description: 'Farm-fresh, organically grown red tomatoes. Hand-picked daily for maximum freshness.',
    harvestDate: '2026-09-20',
    availableQuantity: 50,
    rating: 4.8
  },
  {
    id: 'p2',
    name: 'Organic Potatoes',
    categoryId: 'c1',
    categoryName: 'Vegetables',
    price: 30,
    unit: 'kg',
    farmerId: 'f1',
    image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&q=80&w=600',
    description: 'High-quality potatoes, perfect for everyday cooking. Grown without synthetic pesticides.',
    harvestDate: '2026-09-15',
    availableQuantity: 100,
    rating: 4.5
  },
  {
    id: 'p3',
    name: 'Nashik Red Onions',
    categoryId: 'c1',
    categoryName: 'Vegetables',
    price: 35,
    unit: 'kg',
    farmerId: 'f2',
    image: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&q=80&w=600',
    description: 'Premium quality red onions from Nashik. Long shelf life and sharp flavor.',
    harvestDate: '2026-09-18',
    availableQuantity: 200,
    rating: 4.9
  },
  {
    id: 'p4',
    name: 'Sharbati Wheat',
    categoryId: 'c3',
    categoryName: 'Grains',
    price: 45,
    unit: 'kg',
    farmerId: 'f1',
    image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&q=80&w=600',
    description: 'Premium MP Sharbati wheat. Known for making the softest chapatis.',
    harvestDate: '2026-04-10',
    availableQuantity: 500,
    rating: 4.8
  },
  {
    id: 'p5',
    name: 'Alphonso Mangoes',
    categoryId: 'c2',
    categoryName: 'Fruits',
    price: 600,
    unit: 'dozen',
    farmerId: 'f2',
    image: 'https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&q=80&w=600',
    description: 'Export quality Alphonso mangoes. Naturally ripened.',
    harvestDate: '2026-05-15',
    availableQuantity: 20,
    rating: 5.0
  },
  {
    id: 'p6',
    name: 'Toor Dal (Pigeon Pea)',
    categoryId: 'c4',
    categoryName: 'Pulses',
    price: 120,
    unit: 'kg',
    farmerId: 'f3',
    image: 'https://images.unsplash.com/photo-1612869538502-b5baa439abd7?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    description: 'Unpolished Toor Dal. Rich in protein and essential nutrients.',
    harvestDate: '2026-02-20',
    availableQuantity: 150,
    rating: 4.6
  },
  {
    id: 'p7',
    name: 'Fresh Green Coriander',
    categoryId: 'c1',
    categoryName: 'Vegetables',
    price: 20,
    unit: 'bunch',
    farmerId: 'f4',
    image: 'https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&q=80&w=600',
    description: 'Aromatic green coriander leaves. Harvested same day as delivery.',
    harvestDate: '2026-09-21',
    availableQuantity: 30,
    rating: 4.7
  },
  {
    id: 'p8',
    name: 'Salem Turmeric Powder',
    categoryId: 'c5',
    categoryName: 'Spices',
    price: 250,
    unit: 'kg',
    farmerId: 'f3',
    image: 'https://images.unsplash.com/photo-1702041295331-840d4d9aa7c9?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    description: 'High curcumin content turmeric powder. Ground from sun-dried turmeric fingers.',
    harvestDate: '2026-01-10',
    availableQuantity: 40,
    rating: 4.8
  },
  {
    id: 'p9',
    name: 'Guava',
    categoryId: 'c2',
    categoryName: 'Fruits',
    price: 60,
    unit: 'kg',
    farmerId: 'f4',
    image: 'https://images.unsplash.com/photo-1689996647327-5d263fbbc79d?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    description: 'Sweet and crunchy guavas. Rich in Vitamin C.',
    harvestDate: '2026-09-19',
    availableQuantity: 40,
    rating: 4.4
  },
  {
    id: 'p10',
    name: 'Broccoli',
    categoryId: 'c1',
    categoryName: 'Vegetables',
    price: 80,
    unit: 'piece',
    farmerId: 'f5',
    image: 'https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?auto=format&fit=crop&q=80&w=600',
    description: 'Fresh organic broccoli. Grown in controlled environments.',
    harvestDate: '2026-09-21',
    availableQuantity: 25,
    rating: 4.3
  }
];

// Helper to attach farmer info to products
export const productsWithFarmers = products.map(product => {
  const farmer = farmers.find(f => f.id === product.farmerId);
  return { ...product, farmer };
});
