import { Schema, model,Types } from "mongoose";


const passportSchema = new Schema({
    serial: { type: String, required: true,unique: true },
    jsshir: { type: String, required: true,unique: true },
    fullname: { type: String, required: true },
    customer_id: { type: Types.ObjectId, ref: 'Customer', required: true }
}, { timestamps: true });

const Passport = model('Passport', passportSchema);

export default Passport;

