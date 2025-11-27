import mongoose, { Document, Schema } from 'mongoose';

// Define an interface for the Role document
export interface IRole extends Document {
    name: string;
    status: boolean;
    created_at: Date;
    updated_at: Date;
}

// Define the schema for the Role model
const roleSchema: Schema = new Schema<IRole>({
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
        default: Date.now,
    },
    updated_at: {
        type: Date,
        default: Date.now,
    }
}, { collection: 'Roles' });

// Create the Role model using the schema and the IRole interface
const Role = mongoose.model<IRole>('Role', roleSchema);

export default Role;