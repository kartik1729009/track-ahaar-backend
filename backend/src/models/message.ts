import mongoose, { Schema } from 'mongoose'
const messageSchema = new mongoose.Schema({
    message:{
        type: String,
    }
})
const messages = mongoose.model("messages", messageSchema);
export default messages;