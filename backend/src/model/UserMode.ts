import mongoose, { Schema, Document } from "mongoose";

export interface User extends Document {
    username: string;
    name: string;
    password: string;
    profilePicture: string;
    gender: string;
}

const userSchema: Schema<User> = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "Username is required"],
        trim: true,
        unique: true
    },
    name: {
        type: String,
        required: [true, "Name is required"],
    },
    password: {
        type: String,
        required: [true, "Password is required"],
    },
    profilePicture: {
        type: String,
    },
    gender: {
        type: String,
    }
}, { timestamps: true });  

const User = mongoose.model<User>("User", userSchema);

export default User;
