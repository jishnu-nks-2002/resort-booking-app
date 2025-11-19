const Package = require('../models/Package');
const { validationResult } = require('express-validator');
const { deleteFile } = require('../middleware/upload');
const path = require('path');

// Helper function to generate image URLs
const generateImageUrls = (files, req) => {
  if (!files || files.length === 0) return [];
  
  const baseUrl = `${req.protocol}://${req.get('host')}`;
  return files.map(file => `${baseUrl}/uploads/packages/${file.filename}`);
};

// @desc    Get all packages
// @route   GET /api/packages
// @access  Public
const getAllPackages = async (req, res) => {
  try {
    const { isActive, type } = req.query;

    let query = {};
    if (isActive !== undefined) {
      query.isActive = isActive === 'true';
    }
    if (type) {
      query.type = type;
    }

    const packages = await Package.find(query).sort({ popularityScore: -1, createdAt: -1 });

    res.json({
      success: true,
      count: packages.length,
      packages,
    });
  } catch (error) {
    console.error('Error in getAllPackages:', error);
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

// @desc    Get package by ID or slug
// @route   GET /api/packages/:id
// @access  Public
const getPackageById = async (req, res) => {
  try {
    const pkg = await Package.findOne({
      $or: [{ _id: req.params.id }, { slug: req.params.id }],
    });

    if (!pkg) {
      return res.status(404).json({ 
        success: false,
        message: 'Package not found' 
      });
    }

    res.json({
      success: true,
      package: pkg,
    });
  } catch (error) {
    console.error('Error in getPackageById:', error);
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

// @desc    Create new package with images
// @route   POST /api/packages
// @access  Private/Admin
const createPackage = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // Delete uploaded files if validation fails
      if (req.files && req.files.length > 0) {
        req.files.forEach(file => deleteFile(file.path));
      }
      return res.status(400).json({ 
        success: false,
        errors: errors.array() 
      });
    }

    const { name, type, description, features, items, discountPercent } = req.body;

    // Check if package with same name exists
    const existingPackage = await Package.findOne({ name });
    if (existingPackage) {
      // Delete uploaded files
      if (req.files && req.files.length > 0) {
        req.files.forEach(file => deleteFile(file.path));
      }
      return res.status(400).json({ 
        success: false,
        message: 'Package with this name already exists' 
      });
    }

    // Generate image URLs from uploaded files
    const imageUrls = generateImageUrls(req.files, req);

    // Parse features and items if they're strings
    const parsedFeatures = typeof features === 'string' ? JSON.parse(features) : features;
    const parsedItems = typeof items === 'string' ? JSON.parse(items) : items;

    const pkg = await Package.create({
      name,
      type,
      description,
      features: parsedFeatures || [],
      items: parsedItems || [],
      discountPercent: discountPercent || 0,
      images: imageUrls,
      image: imageUrls.length > 0 ? imageUrls[0] : '', // Set first image as primary
      isActive: true,
    });

    res.status(201).json({
      success: true,
      message: 'Package created successfully',
      package: pkg,
    });
  } catch (error) {
    console.error('Error in createPackage:', error);
    
    // Delete uploaded files on error
    if (req.files && req.files.length > 0) {
      req.files.forEach(file => deleteFile(file.path));
    }
    
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

// @desc    Update package
// @route   PUT /api/packages/:id
// @access  Private/Admin
const updatePackage = async (req, res) => {
  try {
    const pkg = await Package.findById(req.params.id);

    if (!pkg) {
      // Delete uploaded files if package not found
      if (req.files && req.files.length > 0) {
        req.files.forEach(file => deleteFile(file.path));
      }
      return res.status(404).json({ 
        success: false,
        message: 'Package not found' 
      });
    }

    const { name, type, description, features, items, discountPercent, isActive, removeImages } = req.body;

    // Update basic fields
    if (name) pkg.name = name;
    if (type) pkg.type = type;
    if (description) pkg.description = description;
    
    // Parse and update features
    if (features) {
      pkg.features = typeof features === 'string' ? JSON.parse(features) : features;
    }
    
    // Parse and update items
    if (items) {
      pkg.items = typeof items === 'string' ? JSON.parse(items) : items;
    }
    
    if (discountPercent !== undefined) pkg.discountPercent = discountPercent;
    if (isActive !== undefined) pkg.isActive = isActive;

    // Handle image removal
    if (removeImages) {
      const imagesToRemove = typeof removeImages === 'string' ? JSON.parse(removeImages) : removeImages;
      
      if (Array.isArray(imagesToRemove) && imagesToRemove.length > 0) {
        // Remove images from array
        pkg.images = pkg.images.filter(img => !imagesToRemove.includes(img));
        
        // Delete physical files
        imagesToRemove.forEach(imageUrl => {
          const filename = path.basename(imageUrl);
          const filePath = path.join('./uploads/packages', filename);
          deleteFile(filePath);
        });
      }
    }

    // Add new images
    if (req.files && req.files.length > 0) {
      const newImageUrls = generateImageUrls(req.files, req);
      pkg.images = [...pkg.images, ...newImageUrls];
      
      // Ensure we don't exceed 10 images
      if (pkg.images.length > 10) {
        // Delete excess uploaded files
        const excessCount = pkg.images.length - 10;
        const excessUrls = pkg.images.slice(-excessCount);
        
        excessUrls.forEach(imageUrl => {
          const filename = path.basename(imageUrl);
          const filePath = path.join('./uploads/packages', filename);
          deleteFile(filePath);
        });
        
        pkg.images = pkg.images.slice(0, 10);
      }
    }

    // Update primary image if needed
    if (pkg.images.length > 0) {
      pkg.image = pkg.images[0];
    } else {
      pkg.image = '';
    }

    await pkg.save();

    res.json({
      success: true,
      message: 'Package updated successfully',
      package: pkg,
    });
  } catch (error) {
    console.error('Error in updatePackage:', error);
    
    // Delete uploaded files on error
    if (req.files && req.files.length > 0) {
      req.files.forEach(file => deleteFile(file.path));
    }
    
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

// @desc    Delete package
// @route   DELETE /api/packages/:id
// @access  Private/Admin
const deletePackage = async (req, res) => {
  try {
    const pkg = await Package.findById(req.params.id);

    if (!pkg) {
      return res.status(404).json({ 
        success: false,
        message: 'Package not found' 
      });
    }

    // Delete all associated images
    if (pkg.images && pkg.images.length > 0) {
      pkg.images.forEach(imageUrl => {
        const filename = path.basename(imageUrl);
        const filePath = path.join('./uploads/packages', filename);
        deleteFile(filePath);
      });
    }

    await pkg.deleteOne();

    res.json({
      success: true,
      message: 'Package deleted successfully',
    });
  } catch (error) {
    console.error('Error in deletePackage:', error);
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

// @desc    Toggle package active status
// @route   PATCH /api/packages/:id/toggle
// @access  Private/Admin
const togglePackageStatus = async (req, res) => {
  try {
    const pkg = await Package.findById(req.params.id);

    if (!pkg) {
      return res.status(404).json({ 
        success: false,
        message: 'Package not found' 
      });
    }

    pkg.isActive = !pkg.isActive;
    await pkg.save();

    res.json({
      success: true,
      message: `Package ${pkg.isActive ? 'activated' : 'deactivated'} successfully`,
      package: pkg,
    });
  } catch (error) {
    console.error('Error in togglePackageStatus:', error);
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

// @desc    Delete a specific image from package
// @route   DELETE /api/packages/:id/images
// @access  Private/Admin
const deletePackageImage = async (req, res) => {
  try {
    const { imageUrl } = req.body;
    
    if (!imageUrl) {
      return res.status(400).json({
        success: false,
        message: 'Image URL is required'
      });
    }

    const pkg = await Package.findById(req.params.id);

    if (!pkg) {
      return res.status(404).json({ 
        success: false,
        message: 'Package not found' 
      });
    }

    // Check if image exists in package
    if (!pkg.images.includes(imageUrl)) {
      return res.status(404).json({
        success: false,
        message: 'Image not found in package'
      });
    }

    // Remove image from array
    pkg.images = pkg.images.filter(img => img !== imageUrl);
    
    // Update primary image if it was deleted
    if (pkg.image === imageUrl) {
      pkg.image = pkg.images.length > 0 ? pkg.images[0] : '';
    }

    await pkg.save();

    // Delete physical file
    const filename = path.basename(imageUrl);
    const filePath = path.join('./uploads/packages', filename);
    deleteFile(filePath);

    res.json({
      success: true,
      message: 'Image deleted successfully',
      package: pkg,
    });
  } catch (error) {
    console.error('Error in deletePackageImage:', error);
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

module.exports = {
  getAllPackages,
  getPackageById,
  createPackage,
  updatePackage,
  deletePackage,
  togglePackageStatus,
  deletePackageImage,
};