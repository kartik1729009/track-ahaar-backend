import mongoose, { Schema, Document } from 'mongoose';

const userSchema: Schema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true, 
        match: [/\S+@\S+\.\S+/, 'Please enter a valid email address'],
    },
    password: {
        type: String,
        required: true,
    },
}, {
    timestamps: true, 
});

const User = mongoose.model<IUser>('User', userSchema);

interface IUser extends Document {
    fullName: string;
    email: string;
    password: string;
}

export default User;
