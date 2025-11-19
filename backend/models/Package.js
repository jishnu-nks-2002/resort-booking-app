const mongoose = require('mongoose');

const packageItemSchema = new mongoose.Schema({
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
    default: 1,
  },
  price: {
    type: Number,
    required: true,
  },
});

const packageSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Package name is required'],
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
    type: {
      type: String,
      enum: ['luxury', 'budget', 'custom'],
      required: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    features: [
      {
        type: String,
      },
    ],
    items: [packageItemSchema],
    basePrice: {
      type: Number,
      default: 0,
    },
    discountPercent: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    finalPrice: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    // Updated: Support for multiple images
    images: {
      type: [String],
      default: [],
      validate: {
        validator: function(arr) {
          return arr.length <= 10; // Maximum 10 images per package
        },
        message: 'Package cannot have more than 10 images'
      }
    },
    // Legacy field for backward compatibility
    image: {
      type: String,
      default: '',
    },
    popularityScore: {
      type: Number,
      default: 0,
    },
    bookingCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Generate slug before validation
packageSchema.pre('validate', function (next) {
  if (this.isModified('name') && !this.slug) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  next();
});

// Calculate base price and final price before validation
packageSchema.pre('validate', function (next) {
  // Calculate base price from items
  if (this.items && this.items.length > 0) {
    this.basePrice = this.items.reduce((total, item) => {
      return total + (item.price || 0) * (item.quantity || 1);
    }, 0);
  } else {
    this.basePrice = 0;
  }

  // Calculate final price with discount
  const discountAmount = (this.basePrice * (this.discountPercent || 0)) / 100;
  this.finalPrice = this.basePrice - discountAmount;

  next();
});

// Ensure backward compatibility - if no images array but has image field, use it
packageSchema.post('init', function() {
  if (this.image && (!this.images || this.images.length === 0)) {
    this.images = [this.image];
  }
});

const Package = mongoose.model('Package', packageSchema);

module.exports = Package;