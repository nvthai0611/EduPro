import mongoose from 'mongoose';

const CourseSchema = new mongoose.Schema({
    manager_id: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true},
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true, default: 0 },
    salePrice: { type: Number, default: 0 },
    thumbnail: { type: String },
    level: { type: String, enum: ['beginner', 'intermediate', 'advanced'], default: 'beginner' },
    rating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
    totalStudents: { type: Number, default: 0 },
    totalDuration: { type: Number, default: 0 },
    whatYouWillLearn: [{ type: String }],
    requirements: [{ type: String }],
    targetAudience: [{ type: String }],
    modules: [{
        title: { type: String },
        lessons: [{
            _id: { type: mongoose.Schema.Types.ObjectId },
            title: { type: String },
            videoDuration: { type: Number },
            isFree: { type: Boolean, default: false },
            resources: [{ type: String }]
        }]
    }],
    status: { type: String, enum: ['draft', 'pending', 'approved', 'published'], default: 'draft' },
    approvalMessage: { type: String },
    submittedAt: { type: Date },
    submittedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    isDeleted: { type: Boolean, default: false },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
}, { timestamps: true });

// Auto-generate slug from title before saving
CourseSchema.pre('save', function(next) {
    if (this.isModified('title') || !this.slug) {
        this.slug = this.title
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '') 
            .replace(/đ/g, 'd')
            .replace(/[^a-z0-9\s-]/g, '') 
            .replace(/\s+/g, '-') 
            .replace(/-+/g, '-') 
            .trim();
    }
    next();
});

CourseSchema.index({ manager_id: 1, status: 1 }); // Index for faster queries by manager_id and status
const CourseModel = mongoose.model('Course', CourseSchema);

export default CourseModel;