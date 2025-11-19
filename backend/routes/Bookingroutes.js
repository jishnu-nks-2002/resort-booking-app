const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
  createBooking,
  getAllBookings,
  getUserBookings,
  getBookingById,
  updateBookingStatus,
  startCooking,
  completeCooking,
  deleteBooking,
} = require('../controllers/bookingController');
const { protect, admin } = require('../middleware/auth');

// Validation middleware
const bookingValidation = [
  body('customerInfo.name').trim().notEmpty().withMessage('Customer name is required'),
  body('customerInfo.email').isEmail().withMessage('Valid email is required'),
  body('customerInfo.phone').trim().notEmpty().withMessage('Phone number is required'),
  body('checkInDate').isISO8601().withMessage('Valid check-in date is required'),
  body('checkOutDate').isISO8601().withMessage('Valid check-out date is required'),
  body('numberOfGuests')
    .isInt({ min: 1 })
    .withMessage('Number of guests must be at least 1'),
  body('items').isArray({ min: 1 }).withMessage('At least one item is required'),
];

// Routes
router.post('/', protect, bookingValidation, createBooking);
router.get('/', protect, admin, getAllBookings);

// FIXED optional route
router.get('/user', protect, getUserBookings);
router.get('/user/:userId', protect, getUserBookings);

router.get('/:id', protect, getBookingById);
router.patch('/:id/status', protect, admin, updateBookingStatus);
router.patch('/:id/start-cooking', protect, admin, startCooking);
router.patch('/:id/complete-cooking', protect, admin, completeCooking);
router.delete('/:id', protect, admin, deleteBooking);


module.exports = router;