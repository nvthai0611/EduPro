import mongoose, { Document } from 'mongoose';

export interface ICategory extends Document {
  name: string;
  slug: string;
  description: string;
  thumbnail: string;
  icon: string;
  color: string;
  isActive: boolean;
  order: number;
  courseCount: number;
  totalCourses?: number; // virtual
}

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
categorySchema.index({ isActive: 1, order: 1 });

// Virtual for course count (will be updated when courses are added/removed)
categorySchema.virtual('totalCourses').get(function() {
  return this.courseCount;
});

const Category = mongoose.model<ICategory>('Category', categorySchema);

export default Category;