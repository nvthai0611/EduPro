const mongoose = require('mongoose');
//  định nghĩa schema
const roleSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    status: {
        type: Boolean,
        default: false,
    },
    created_at: {
        type: Date,
        default: Date.now(),
    },
    updated_at: {
        type: Date,
        default: Date.now(),
    }
}, {collection: 'Roles'});
const Role = mongoose.model('Role', roleSchema);
module.exports = Role;