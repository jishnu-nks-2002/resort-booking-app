const Booking = require('../models/Booking');
const { validationResult } = require('express-validator');

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Private
const createBooking = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      customerInfo,
      checkInDate,
      checkOutDate,
      numberOfGuests,
      items,
      specialRequests,
      cookingDuration,
    } = req.body;

    // Validate dates
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);

    if (checkIn >= checkOut) {
      return res.status(400).json({ message: 'Check-out date must be after check-in date' });
    }

    // Create booking
    const booking = await Booking.create({
      user: req.user._id,
      customerInfo,
      checkInDate: checkIn,
      checkOutDate: checkOut,
      numberOfGuests,
      items,
      specialRequests,
      cookingDuration: cookingDuration || 30,
      status: 'pending',
      paymentStatus: 'pending',
    });

    res.status(201).json({
      success: true,
      booking,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all bookings (Admin) or user bookings
// @route   GET /api/bookings
// @access  Private
const getAllBookings = async (req, res) => {
  try {
    const { status, startDate, endDate } = req.query;

    // Build query
    let query = {};
    
    // Filter by status
    if (status) {
      query.status = status;
    }

    // Filter by date range
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    // If not admin, only show user's bookings
    if (req.user.role !== 'admin') {
      query.user = req.user._id;
    }

    const bookings = await Booking.find(query)
      .populate('user', 'name email phone')
      .sort({ createdAt: -1 });

    // ✅ Calculate comprehensive stats with revenue
    const stats = {
      total: bookings.length,
      pending: bookings.filter((b) => b.status === 'pending').length,
      confirmed: bookings.filter((b) => b.status === 'confirmed').length,
      preparing: bookings.filter((b) => b.status === 'preparing').length,
      ready: bookings.filter((b) => b.status === 'ready').length,
      completed: bookings.filter((b) => b.status === 'completed').length,
      cancelled: bookings.filter((b) => b.status === 'cancelled').length,
      // Calculate total revenue from completed bookings
      totalRevenue: bookings
        .filter((b) => b.status === 'completed')
        .reduce((sum, b) => sum + (b.finalAmount || b.totalAmount || 0), 0),
    };

    res.json({
      success: true,
      count: bookings.length,
      stats,
      bookings,
    });
  } catch (error) {
    console.error('Error in getAllBookings:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get user bookings
// @route   GET /api/bookings/user/:userId
// @access  Private
const getUserBookings = async (req, res) => {
  try {
    const userId = req.params.userId || req.user._id;

    const bookings = await Booking.find({ user: userId }).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get booking by ID
// @route   GET /api/bookings/:id
// @access  Private
const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('user', 'name email phone');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if user owns the booking or is admin
    if (booking.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to view this booking' });
    }

    res.json({
      success: true,
      booking,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update booking status
// @route   PATCH /api/bookings/:id/status
// @access  Private/Admin
const updateBookingStatus = async (req, res) => {
  try {
    const { status, notes } = req.body;

    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    booking.status = status || booking.status;
    if (notes) booking.notes = notes;

    await booking.save();

    res.json({
      success: true,
      booking,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Start cooking timer
// @route   POST /api/bookings/:id/start-cooking
// @access  Private/Admin
const startCooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    const now = new Date();
    const endTime = new Date(now.getTime() + booking.cookingDuration * 60000);

    booking.cookingStartTime = now;
    booking.cookingEndTime = endTime;
    booking.status = 'preparing';

    await booking.save();

    res.json({
      success: true,
      message: 'Cooking timer started',
      booking,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Mark cooking as complete
// @route   PATCH /api/bookings/:id/complete-cooking
// @access  Private/Admin
const completeCooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    booking.status = 'ready';
    booking.cookingEndTime = new Date();

    await booking.save();

    res.json({
      success: true,
      message: 'Order is ready',
      booking,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete booking
// @route   DELETE /api/bookings/:id
// @access  Private/Admin
const deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    await booking.deleteOne();

    res.json({
      success: true,
      message: 'Booking deleted',
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createBooking,
  getAllBookings,
  getUserBookings,
  getBookingById,
  updateBookingStatus,
  startCooking,
  completeCooking,
  deleteBooking,
};