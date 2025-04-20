import mongoose from 'mongoose';

const foodSchema = new mongoose.Schema({
    order: {
        type: String,
        required: true,
    },
});

const orders = mongoose.model("orders", foodSchema);
export default orders;
