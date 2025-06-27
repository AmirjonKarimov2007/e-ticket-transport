import { Schema, model ,Types} from "mongoose";

const ticketSchema = new Schema({
    transport_id: { type: Types.ObjectId, ref: 'Transport', required: true },
    from: { type: String, required: true },
    to:{ type: String, required: true },
    price: { type: Number, required: true },
    departure: { type: Date, required: true },
    arrival: { type: Date, required: true },
    customer_id: { type: Types.ObjectId, ref: 'Customer', required: true }
},{
    timestamps:true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

ticketSchema.virtual('customers', {
    ref: 'Customer',
    localField: '_id',
    foreignField: 'customerId'
});

const Ticket = model('Ticket',ticketSchema);
export default Ticket;