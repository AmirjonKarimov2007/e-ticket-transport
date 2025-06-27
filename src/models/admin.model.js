import { Schema, model } from "mongoose";

const AdminSchema = new Schema({
    username: { type: String, unique: true, required: true },
    hashedPassword: { type: String, required: true },
    is_active: { type: Boolean,required:true,default: true },
    role: { type: String, enum: ['superadmin', 'admin'], default: 'admin' }

}, { timestamps: true });

const Admin = model('Admin', AdminSchema);
export default Admin;
