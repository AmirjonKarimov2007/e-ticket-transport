import { Schema, model } from "mongoose"


const transportSchema = new Schema({
    transport_type: { type: String, required: true },
    class: { type: String, enum: ['car', 'bus','pozeyd'], default: 'car' },
    seat: { type: Number, required: true }

},{timestamps:true})

const Transport = model('Transport',transportSchema);

export default Transport