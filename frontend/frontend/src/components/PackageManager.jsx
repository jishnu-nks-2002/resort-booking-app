import { useState, useEffect } from 'react';
import { packageAPI } from '../utils/api';
import { toast } from 'react-toastify';
import {
  Plus,
  Edit,
  Trash2,
  X,
  Save,
  Eye,
  EyeOff,
  Package as PackageIcon,
  Minus,
  Upload,
  Image as ImageIcon,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

const PackageManager = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPackage, setEditingPackage] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    type: 'budget',
    description: '',
    features: [''],
    items: [],
    discountPercent: 0,
    image: '',
  });

  // ✨ NEW: Image-related states
  const [images, setImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [packageCarouselIndices, setPackageCarouselIndices] = useState({});

  const [currentItem, setCurrentItem] = useState({
    itemType: 'accommodation',
    name: '',
    description: '',
    quantity: 1,
    price: 0,
  });

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      const response = await packageAPI.getAll();
      setPackages(response.data.packages);
      
      // ✨ NEW: Initialize carousel indices
      const indices = {};
      response.data.packages.forEach(pkg => {
        indices[pkg._id] = 0;
      });
      setPackageCarouselIndices(indices);
    } catch (error) {
      toast.error('Failed to load packages');
      console.error('Error fetching packages:', error);
    } finally {
      setLoading(false);
    }
  };

  // ✨ NEW: Carousel navigation
  const handlePackageImageNext = (packageId, imagesLength) => {
    setPackageCarouselIndices(prev => ({
      ...prev,
      [packageId]: (prev[packageId] + 1) % imagesLength
    }));
  };

  const handlePackageImagePrev = (packageId, imagesLength) => {
    setPackageCarouselIndices(prev => ({
      ...prev,
      [packageId]: (prev[packageId] - 1 + imagesLength) % imagesLength
    }));
  };

  const openCreateModal = () => {
    setEditingPackage(null);
    setFormData({
      name: '',
      type: 'budget',
      description: '',
      features: [''],
      items: [],
      discountPercent: 0,
      image: '',
    });
    setCurrentItem({
      itemType: 'accommodation',
      name: '',
      description: '',
      quantity: 1,
      price: 0,
    });
    // ✨ NEW: Clear images
    setImages([]);
    setExistingImages([]);
    setImagePreviews([]);
    setShowModal(true);
  };

  const openEditModal = (pkg) => {
    setEditingPackage(pkg);
    setFormData({
      name: pkg.name,
      type: pkg.type,
      description: pkg.description,
      features: pkg.features.length > 0 ? pkg.features : [''],
      items: pkg.items,
      discountPercent: pkg.discountPercent || 0,
      image: pkg.image || '',
    });
    setCurrentItem({
      itemType: 'accommodation',
      name: '',
      description: '',
      quantity: 1,
      price: 0,
    });
    // ✨ NEW: Load existing images
    setImages([]);
    setExistingImages(pkg.images || []);
    setImagePreviews([]);
    setShowModal(true);
  };

  // ✨ NEW: Handle image selection
  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    
    if (files.length + images.length + existingImages.length > 10) {
      toast.error('Maximum 10 images allowed per package');
      return;
    }

    // Validate files
    const validFiles = files.filter(file => {
      if (!file.type.startsWith('image/')) {
        toast.error(`${file.name} is not an image file`);
        return false;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} exceeds 5MB size limit`);
        return false;
      }
      return true;
    });

    setImages((prev) => [...prev, ...validFiles]);

    // Create previews
    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreviews((prev) => [...prev, e.target.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  // ✨ NEW: Remove new image
  const removeNewImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  // ✨ NEW: Remove existing image
  const removeExistingImage = (imageUrl) => {
    setExistingImages((prev) => prev.filter((url) => url !== imageUrl));
  };

  const handleAddFeature = () => {
    setFormData({
      ...formData,
      features: [...formData.features, ''],
    });
  };

  const handleRemoveFeature = (index) => {
    const newFeatures = formData.features.filter((_, i) => i !== index);
    setFormData({ ...formData, features: newFeatures });
  };

  const handleFeatureChange = (index, value) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = value;
    setFormData({ ...formData, features: newFeatures });
  };

  const handleAddItem = () => {
    if (!currentItem.name || !currentItem.price || currentItem.price <= 0) {
      toast.error('Please fill item name and valid price');
      return;
    }

    setFormData({
      ...formData,
      items: [...formData.items, { ...currentItem }],
    });

    setCurrentItem({
      itemType: 'accommodation',
      name: '',
      description: '',
      quantity: 1,
      price: 0,
    });

    toast.success('Item added');
  };

  const handleRemoveItem = (index) => {
    const newItems = formData.items.filter((_, i) => i !== index);
    setFormData({ ...formData, items: newItems });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.items.length === 0) {
      toast.error('Please add at least one item to the package');
      return;
    }

    // ✨ NEW: Check for images
    if (images.length === 0 && existingImages.length === 0) {
      toast.error('Please upload at least one image');
      return;
    }

    // Filter out empty features
    const cleanedFeatures = formData.features.filter((f) => f.trim() !== '');

    // ✨ UPDATED: Create FormData for image upload
    const submitData = new FormData();
    
    // Append basic fields
    submitData.append('name', formData.name);
    submitData.append('type', formData.type);
    submitData.append('description', formData.description);
    submitData.append('discountPercent', Number(formData.discountPercent) || 0);
    
    // Append features and items as JSON strings
    submitData.append('features', JSON.stringify(cleanedFeatures));
    submitData.append('items', JSON.stringify(formData.items));

    // Append images
    images.forEach((image) => {
      submitData.append('images', image);
    });

    // If updating, include removed images
    if (editingPackage && editingPackage.images) {
      const removedImages = editingPackage.images.filter(
        (img) => !existingImages.includes(img)
      );
      if (removedImages.length > 0) {
        submitData.append('removeImages', JSON.stringify(removedImages));
      }
    }

    try {
      if (editingPackage) {
        await packageAPI.update(editingPackage._id, submitData);
        toast.success('Package updated successfully');
      } else {
        await packageAPI.create(submitData);
        toast.success('Package created successfully');
      }
      setShowModal(false);
      fetchPackages();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save package');
      console.error('Error saving package:', error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this package?')) {
      return;
    }

    try {
      await packageAPI.delete(id);
      toast.success('Package deleted');
      fetchPackages();
    } catch (error) {
      toast.error('Failed to delete package');
      console.error('Error deleting package:', error);
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      await packageAPI.toggleStatus(id);
      toast.success('Package status updated');
      fetchPackages();
    } catch (error) {
      toast.error('Failed to update status');
      console.error('Error toggling status:', error);
    }
  };

  const calculatePackageTotal = (items, discount) => {
    const subtotal = items.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0);
    const discountAmount = (subtotal * (discount || 0)) / 100;
    return {
      subtotal,
      discount: discountAmount,
      total: subtotal - discountAmount,
    };
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Package Management</h2>
        <button onClick={openCreateModal} className="btn-primary flex items-center space-x-2">
          <Plus className="w-5 h-5" />
          <span>Create Package</span>
        </button>
      </div>

      {/* Packages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {packages.map((pkg) => {
          const totals = calculatePackageTotal(pkg.items, pkg.discountPercent);
          // ✨ NEW: Get package images
          const packageImages = pkg.images && pkg.images.length > 0 
            ? pkg.images 
            : ['https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop'];
          const currentImageIndex = packageCarouselIndices[pkg._id] || 0;

          return (
            <div key={pkg._id} className="card overflow-hidden">
              {/* ✨ NEW: Image Carousel */}
              <div className="relative h-48 group">
                <img
                  src={packageImages[currentImageIndex]}
                  alt={pkg.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                
                {/* Carousel Controls */}
                {packageImages.length > 1 && (
                  <>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePackageImagePrev(pkg._id, packageImages.length);
                      }}
                      className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all opacity-0 group-hover:opacity-100"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePackageImageNext(pkg._id, packageImages.length);
                      }}
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all opacity-0 group-hover:opacity-100"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                    
                    {/* Dots Indicator */}
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-1">
                      {packageImages.map((_, idx) => (
                        <div
                          key={idx}
                          className={`w-2 h-2 rounded-full transition-all ${
                            idx === currentImageIndex
                              ? 'bg-white w-4'
                              : 'bg-white/50'
                          }`}
                        />
                      ))}
                    </div>
                  </>
                )}

                {/* Status & Type Badges */}
                <div className="absolute top-2 right-2">
                  <button
                    onClick={() => handleToggleStatus(pkg._id)}
                    className={`p-2 rounded-lg shadow-lg ${
                      pkg.isActive ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'
                    }`}
                    title={pkg.isActive ? 'Active' : 'Inactive'}
                  >
                    {pkg.isActive ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                </div>

                <div className="absolute top-2 left-2">
                  <span
                    className={`badge ${
                      pkg.type === 'luxury'
                        ? 'bg-yellow-500 text-white'
                        : pkg.type === 'budget'
                        ? 'bg-green-500 text-white'
                        : 'bg-blue-500 text-white'
                    }`}
                  >
                    {pkg.type.toUpperCase()}
                  </span>
                </div>

                {/* Image Count */}
                {packageImages.length > 1 && (
                  <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs flex items-center space-x-1">
                    <ImageIcon className="w-3 h-3" />
                    <span>{packageImages.length}</span>
                  </div>
                )}
              </div>

              {/* Package Info */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{pkg.name}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{pkg.description}</p>

                <div className="bg-gray-50 rounded-lg p-3 mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Base Price:</span>
                    <span className="font-semibold">${totals.subtotal.toFixed(2)}</span>
                  </div>
                  {pkg.discountPercent > 0 && (
                    <div className="flex justify-between text-sm text-green-600 mb-1">
                      <span>Discount ({pkg.discountPercent}%):</span>
                      <span>-${totals.discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-lg font-bold border-t pt-2">
                    <span>Final Price:</span>
                    <span className="text-primary-600">${totals.total.toFixed(2)}</span>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-2">
                    {pkg.items.length} items • {pkg.features.length} features
                  </p>
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={() => openEditModal(pkg)}
                    className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  >
                    <Edit className="w-4 h-4" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => handleDelete(pkg._id)}
                    className="flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {packages.length === 0 && (
        <div className="text-center py-12">
          <PackageIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No packages yet</h3>
          <p className="text-gray-600 mb-4">Create your first package to get started</p>
          <button onClick={openCreateModal} className="btn-primary">
            Create Package
          </button>
        </div>
      )}

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">
                {editingPackage ? 'Edit Package' : 'Create New Package'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Package Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="input-field"
                    placeholder="e.g., Luxury Paradise Package"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Type *</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="input-field"
                    required
                  >
                    <option value="budget">Budget-Friendly</option>
                    <option value="luxury">Luxury</option>
                    <option value="custom">Custom</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  required
                  rows="3"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="input-field"
                  placeholder="Describe your package..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Discount Percentage (0-100)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="1"
                  value={formData.discountPercent || 0}
                  onChange={(e) => {
                    const value = e.target.value === '' ? 0 : Number(e.target.value);
                    setFormData({ ...formData, discountPercent: value });
                  }}
                  className="input-field"
                  placeholder="e.g., 10"
                />
              </div>

              {/* ✨ NEW: Images Section */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Package Images * (Max 10 images, 5MB each)
                </label>
                
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary-500 transition-colors">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="cursor-pointer flex flex-col items-center"
                  >
                    <Upload className="w-12 h-12 text-gray-400 mb-2" />
                    <span className="text-sm text-gray-600">
                      Click to upload images or drag and drop
                    </span>
                    <span className="text-xs text-gray-500 mt-1">
                      PNG, JPG, GIF, WEBP up to 5MB
                    </span>
                  </label>
                </div>

                {/* Image Previews */}
                {(existingImages.length > 0 || imagePreviews.length > 0) && (
                  <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                    {/* Existing Images */}
                    {existingImages.map((url, index) => (
                      <div key={`existing-${index}`} className="relative group">
                        <img
                          src={url}
                          alt={`Package ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removeExistingImage(url)}
                          className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        {index === 0 && (
                          <span className="absolute bottom-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                            Primary
                          </span>
                        )}
                      </div>
                    ))}

                    {/* New Images */}
                    {imagePreviews.map((preview, index) => (
                      <div key={`new-${index}`} className="relative group">
                        <img
                          src={preview}
                          alt={`New ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removeNewImage(index)}
                          className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <span className="absolute bottom-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
                          New
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Features */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="block text-sm font-medium text-gray-700">Features</label>
                  <button
                    type="button"
                    onClick={handleAddFeature}
                    className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                  >
                    + Add Feature
                  </button>
                </div>
                {formData.features.map((feature, index) => (
                  <div key={index} className="flex space-x-2 mb-2">
                    <input
                      type="text"
                      value={feature}
                      onChange={(e) => handleFeatureChange(index, e.target.value)}
                      className="input-field"
                      placeholder="e.g., Private Pool"
                    />
                    {formData.features.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveFeature(index)}
                        className="px-3 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
                      >
                        <Minus className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Items */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Package Items *</h3>

                {/* Add Item Form */}
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                    <select
                      value={currentItem.itemType}
                      onChange={(e) =>
                        setCurrentItem({ ...currentItem, itemType: e.target.value })
                      }
                      className="input-field"
                    >
                      <option value="accommodation">Accommodation</option>
                      <option value="food">Food</option>
                      <option value="activity">Activity</option>
                      <option value="spa">Spa</option>
                    </select>

                    <input
                      type="text"
                      value={currentItem.name}
                      onChange={(e) => setCurrentItem({ ...currentItem, name: e.target.value })}
                      className="input-field"
                      placeholder="Item name *"
                    />

                    <input
                      type="text"
                      value={currentItem.description}
                      onChange={(e) =>
                        setCurrentItem({ ...currentItem, description: e.target.value })
                      }
                      className="input-field"
                      placeholder="Description (optional)"
                    />

                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="number"
                        min="1"
                        value={currentItem.quantity || 1}
                        onChange={(e) => {
                          const value = e.target.value === '' ? 1 : parseInt(e.target.value);
                          setCurrentItem({ ...currentItem, quantity: value });
                        }}
                        className="input-field"
                        placeholder="Qty"
                      />
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={currentItem.price || 0}
                        onChange={(e) => {
                          const value = e.target.value === '' ? 0 : parseFloat(e.target.value);
                          setCurrentItem({ ...currentItem, price: value });
                        }}
                        className="input-field"
                        placeholder="Price *"
                      />
                    </div>
                  </div>
                  <button type="button" onClick={handleAddItem} className="w-full btn-primary">
                    Add Item to Package
                  </button>
                </div>

                {/* Items List */}
                {formData.items.length > 0 && (
                  <div className="space-y-2">
                    {formData.items.map((item, index) => (
                      <div
                        key={index}
                        className="bg-white border rounded-lg p-3 flex justify-between items-center"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{item.name}</span>
                            <span className="text-xs badge bg-gray-100 text-gray-700">
                              {item.itemType}
                            </span>
                          </div>
                          {item.description && (
                            <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                          )}
                          <div className="text-sm text-gray-600 mt-1">
                            Qty: {item.quantity} × ${item.price.toFixed(2)} = $
                            {(item.quantity * item.price).toFixed(2)}
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(index)}
                          className="text-red-600 hover:text-red-700 ml-4"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {formData.items.length === 0 && (
                  <p className="text-sm text-gray-500 italic">
                    No items added yet. Add at least one item to create the package.
                  </p>
                )}
              </div>

              {/* Total Preview */}
              {formData.items.length > 0 && (
                <div className="bg-primary-50 rounded-lg p-4">
                  <div className="flex justify-between mb-2">
                    <span>Subtotal:</span>
                    <span className="font-semibold">
                      $
                      {formData.items
                        .reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0)
                        .toFixed(2)}
                    </span>
                  </div>
                  {formData.discountPercent > 0 && (
                    <div className="flex justify-between text-green-600 mb-2">
                      <span>Discount ({formData.discountPercent}%):</span>
                      <span>
                        -$
                        {(
                          (formData.items.reduce(
                            (sum, item) => sum + (item.price || 0) * (item.quantity || 1),
                            0
                          ) *
                            (formData.discountPercent || 0)) /
                          100
                        ).toFixed(2)}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between text-lg font-bold border-t pt-2">
                    <span>Final Price:</span>
                    <span className="text-primary-600">
                      $
                      {(
                        formData.items.reduce(
                          (sum, item) => sum + (item.price || 0) * (item.quantity || 1),
                          0
                        ) -
                        (formData.items.reduce(
                          (sum, item) => sum + (item.price || 0) * (item.quantity || 1),
                          0
                        ) *
                          (formData.discountPercent || 0)) /
                          100
                      ).toFixed(2)}
                    </span>
                  </div>
                </div>
              )}

              {/* Submit */}
              <div className="flex justify-end space-x-4 pt-4 border-t">
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary flex items-center space-x-2"
                  disabled={formData.items.length === 0 || (images.length === 0 && existingImages.length === 0)}
                >
                  <Save className="w-5 h-5" />
                  <span>{editingPackage ? 'Update Package' : 'Create Package'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PackageManager;