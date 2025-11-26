import mongoose from 'mongoose';

const CourseSchema = new mongoose.Schema({
    manager_id: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true},
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    status: { type: String, enum: ['draft', 'published', 'pending'], default: 'active' },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
}, { timestamps: true });

CourseSchema.index({ manager_id: 1, status: 1 }); // Index for faster queries by manager_id and status
const CourseModel = mongoose.model('Course', CourseSchema);

export default CourseModel;