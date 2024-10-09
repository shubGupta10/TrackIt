import mongoose, {Schema, Document} from "mongoose";

export interface TransactionInterface extends Document{
    userId: mongoose.Schema.Types.ObjectId;
    description: string;
    paymentType: string;
    category: string;
    amount: number;
    location: string;
    date: Date;
}

const transactionSchema: Schema<TransactionInterface> = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    description: {
        type: String,
        required: true
    },

    paymentType: {
        type: String,
        enum: ["cash", "card"],
        required: true
    },

    category: {
        type: String,
        enum: ["saving", "expense", "investment"],
        required: true
    },

    amount: {
        type: Number,
        required: true
    },

    location: {
        type: String,
        default: "Unknown"
    },

    date: {
        type: Date,
        required: true
    }
});


const Transaction = mongoose.model<TransactionInterface>("Transaction", transactionSchema );

export default Transaction