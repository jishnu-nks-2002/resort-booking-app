const mongoose = require('mongoose');

const bookingItemSchema = new mongoose.Schema({
  itemType: {
    type: String,
    enum: ['accommodation', 'food', 'activity', 'spa'],
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  subtotal: {
    type: Number,
    required: true,
  },
});

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    bookingNumber: {
      type: String,
      unique: true,
    },
    packageType: {
      type: String,
      enum: ['luxury', 'budget', 'custom'],
      default: 'custom',
    },
    packageName: {
      type: String,
    },
    customerInfo: {
      name: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
      phone: {
        type: String,
        required: true,
      },
    },
    checkInDate: {
      type: Date,
      required: true,
    },
    checkOutDate: {
      type: Date,
      required: true,
    },
    numberOfGuests: {
      type: Number,
      required: true,
      min: 1,
    },
    numberOfNights: {
      type: Number,
      default: 1,
    },
    items: [bookingItemSchema],
    totalAmount: {
      type: Number,
      default: 0,
    },
    discountAmount: {
      type: Number,
      default: 0,
    },
    finalAmount: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'preparing', 'ready', 'completed', 'cancelled'],
      default: 'pending',
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'pending',
    },
    specialRequests: {
      type: String,
    },
    cookingStartTime: {
      type: Date,
    },
    cookingEndTime: {
      type: Date,
    },
    cookingDuration: {
      type: Number,
      default: 30,
    },
    notes: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Generate booking number and calculate amounts before validation
bookingSchema.pre('validate', function (next) {
  // Generate booking number if not exists
  if (!this.bookingNumber) {
    const timestamp = Date.now().toString().slice(-8);
    const random = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, '0');
    this.bookingNumber = `BK${timestamp}${random}`;
  }

  // Calculate number of nights
  if (this.checkInDate && this.checkOutDate) {
    const checkIn = new Date(this.checkInDate);
    const checkOut = new Date(this.checkOutDate);
    const diffTime = Math.abs(checkOut - checkIn);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    this.numberOfNights = diffDays || 1;
  }

  // Calculate total amount from items
  if (this.items && this.items.length > 0) {
    this.totalAmount = this.items.reduce((total, item) => {
      // Ensure subtotal is calculated
      if (!item.subtotal) {
        item.subtotal = (item.price || 0) * (item.quantity || 1);
      }
      return total + item.subtotal;
    }, 0);
  } else {
    this.totalAmount = 0;
  }

  // Apply package discounts if package type is set
  this.discountAmount = 0;
  if (this.packageType === 'luxury') {
    this.discountAmount = this.totalAmount * 0.1; // 10% discount
  } else if (this.packageType === 'budget') {
    this.discountAmount = this.totalAmount * 0.05; // 5% discount
  }

  // Calculate final amount
  this.finalAmount = this.totalAmount - this.discountAmount;

  next();
});

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;