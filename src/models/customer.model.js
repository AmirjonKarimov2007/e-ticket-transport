import { Schema,Types,model } from "mongoose";

const customerSchema = new Schema({
    email:{type:String,required:true,unique:true},
    phoneNumber: { type: String, unique: true, required: true,unique:true }

},{timestamps:true})

customerSchema.virtual('passports', {
    ref: 'Passport',
    localField: '_id',
    foreignField: 'customer_id',
});

customerSchema.set('toObject', { virtuals: true });
customerSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret.id;  
    return ret;
  }
});


const Customer = model('Customer',customerSchema);
export default Customer;