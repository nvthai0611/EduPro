const mongoose = require('mongoose');

const settingSchema = new mongoose.Schema({
    key: {
        type: String,
        required: true,
        unique: true,
        index: true,
    },
    enabled: {
        type: Boolean,
        required: true,
        default: false,
    },
    description: {
        type: String,
        default: '',
    }
}, { timestamps: true });

module.exports = mongoose.model('Setting', settingSchema, 'Settings');
