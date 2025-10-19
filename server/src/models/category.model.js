const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true, 
    trim: true,
    unique: true 
  },
  slug: { 
    type: String, 
    required: true, 
    unique: true, 
    lowercase: true 
  },
  description: { 
    type: String, 
    required: true 
  },
  thumbnail: { 
    type: String, 
    default: 'https://via.placeholder.com/150' 
  },
  icon: { 
    type: String, 
    default: 'BookOpen' 
  },
  color: { 
    type: String, 
    default: 'bg-blue-500' 
  },
  isActive: { 
    type: Boolean, 
    default: true 
  },
  order: { 
    type: Number, 
    default: 0 
  },
  courseCount: { 
    type: Number, 
    default: 0 
  }
}, { 
  collection: 'Categories', 
  timestamps: true 
});

// Indexes
categorySchema.index({ slug: 1 });
categorySchema.index({ isActive: 1, order: 1 });

// Virtual for course count (will be updated when courses are added/removed)
categorySchema.virtual('totalCourses').get(function() {
  return this.courseCount;
});

const Category = mongoose.model('Category', categorySchema);
module.exports = Category;