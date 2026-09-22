import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Edit, Trash2, Plus, AlertTriangle, CheckCircle2, Package } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import SellerLayout from '../components/SellerLayout';
import Button from '../components/Button';
import Modal from '../components/Modal';

const SellerProducts = () => {
  const { user, products, deleteProduct } = useAppContext();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [deleteSuccess, setDeleteSuccess] = useState(false);

  if (!user || !user.sellerVerified || !user.farmerId) {
    return <Navigate to="/login" replace />;
  }

  const myProducts = products.filter(p => p.farmerId === user.farmerId);

  const confirmDelete = (product) => {
    setProductToDelete(product);
    setDeleteModalOpen(true);
  };

  const handleDelete = () => {
    if (productToDelete) {
      deleteProduct(productToDelete.id);
      setDeleteModalOpen(false);
      setProductToDelete(null);
      setDeleteSuccess(true);
      setTimeout(() => setDeleteSuccess(false), 3000);
    }
  };

  return (
    <SellerLayout title="My Products">
      
      {deleteSuccess && (
        <div className="bg-green-50 text-green-700 p-4 rounded-xl border border-green-200 flex items-center mb-6">
          <CheckCircle2 className="mr-2" />
          Product removed successfully.
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h2 className="text-lg font-bold text-gray-900">All Products</h2>
          <Link to="/seller/products/add">
            <Button size="sm">
              <Plus size={16} className="mr-1" /> Add Product
            </Button>
          </Link>
        </div>

        {myProducts.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-gray-50 text-gray-700 font-medium">
                <tr>
                  <th className="px-6 py-4">Product</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Price</th>
                  <th className="px-6 py-4">Available</th>
                  <th className="px-6 py-4">Harvest Date</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {myProducts.map(product => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 flex items-center">
                      <img src={product.image} alt={product.name} className="w-12 h-12 rounded-lg object-cover mr-3" />
                      <span className="font-bold text-gray-900">{product.name}</span>
                    </td>
                    <td className="px-6 py-4">{product.categoryName}</td>
                    <td className="px-6 py-4 font-medium text-gray-900">₹{product.price} / {product.unit}</td>
                    <td className="px-6 py-4">{product.availableQuantity} {product.unit}s</td>
                    <td className="px-6 py-4">{product.harvestDate}</td>
                    <td className="px-6 py-4">
                      {product.availableQuantity > 0 ? (
                        <span className="px-2.5 py-1 bg-green-50 text-green-700 rounded-full text-xs font-medium border border-green-100">
                          Active
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 bg-red-50 text-red-700 rounded-full text-xs font-medium border border-red-100">
                          Out of Stock
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end space-x-2">
                        <Link to={`/seller/products/${product.id}/edit`} className="p-2 text-gray-400 hover:text-primary-600 transition-colors rounded-lg hover:bg-primary-50">
                          <Edit size={16} />
                        </Link>
                        <button onClick={() => confirmDelete(product)} className="p-2 text-gray-400 hover:text-red-600 transition-colors rounded-lg hover:bg-red-50">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package size={32} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">No products listed yet.</h3>
            <p className="text-gray-500 mb-6">Start selling your fresh produce by adding your first product.</p>
            <Link to="/seller/products/add">
              <Button>
                <Plus size={16} className="mr-2" /> Add Your First Product
              </Button>
            </Link>
          </div>
        )}
      </div>

      <Modal 
        isOpen={deleteModalOpen} 
        onClose={() => setDeleteModalOpen(false)}
        title="Delete Product"
      >
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle size={32} />
          </div>
          <h4 className="text-xl font-bold text-gray-900 mb-2">Are you sure you want to remove this product?</h4>
          <p className="text-gray-600 mb-6">
            This will permanently delete <span className="font-bold text-gray-900">{productToDelete?.name}</span> from the marketplace. This action cannot be undone.
          </p>
          <div className="flex justify-center gap-4">
            <Button variant="outline" onClick={() => setDeleteModalOpen(false)}>
              Cancel
            </Button>
            <button
              onClick={handleDelete}
              className="px-6 py-3 border border-transparent text-white font-medium rounded-xl bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Delete Product
            </button>
          </div>
        </div>
      </Modal>

    </SellerLayout>
  );
};

export default SellerProducts;
