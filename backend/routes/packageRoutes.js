const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
  getAllPackages,
  getPackageById,
  createPackage,
  updatePackage,
  deletePackage,
  togglePackageStatus,
  deletePackageImage,
} = require('../controllers/packageController');
const { protect, admin } = require('../middleware/auth');
const { uploadPackageImages, handleMulterError } = require('../middleware/upload');

// Validation middleware
const packageValidation = [
  body('name').trim().notEmpty().withMessage('Package name is required'),
  body('type')
    .isIn(['luxury', 'budget', 'custom'])
    .withMessage('Type must be luxury, budget, or custom'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('items').custom((value) => {
    // Handle both string and array
    const items = typeof value === 'string' ? JSON.parse(value) : value;
    if (!Array.isArray(items) || items.length === 0) {
      throw new Error('At least one item is required');
    }
    return true;
  }),
];

// Public routes
router.get('/', getAllPackages);
router.get('/:id', getPackageById);

// Admin routes with image upload
router.post(
  '/',
  protect,
  admin,
  uploadPackageImages,
  handleMulterError,
  packageValidation,
  createPackage
);

router.put(
  '/:id',
  protect,
  admin,
  uploadPackageImages,
  handleMulterError,
  updatePackage
);

router.delete('/:id', protect, admin, deletePackage);
router.patch('/:id/toggle', protect, admin, togglePackageStatus);
router.delete('/:id/images', protect, admin, deletePackageImage);

module.exports = router; 