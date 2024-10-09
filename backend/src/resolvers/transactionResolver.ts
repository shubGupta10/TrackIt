import Transaction from "../model/TransactionMode.js";

interface CreateTransactionInput {
    description: string;
    paymentType: string;
    category: string;
    amount: number; 
    date: string;
    location?: string; 
}

interface UpdateTransactionInput {
    transactionId: string; 
    description?: string; 
    paymentType?: string;
    category?: string;
    amount?: number;
    location?: string;
    date?: string;
}

const transactionResolver = {
    Query: {
        transactions: async (_parent: unknown, _args: unknown, context: any) => {
            try {
                if (!context.getUser()) throw new Error("Unauthorized");
                const userId = context.getUser()._id;

                const transactions = await Transaction.find({ userId });
                return transactions;
            } catch (error: any) {
                console.error("Failed to fetch transactions", error);
                throw new Error(error.message || "Internal Server error");
            }
        },

        transaction: async (_parent: unknown, { transactionId }: { transactionId: string }, context: any) => {
            try {
                const transaction = await Transaction.findById(transactionId);
                if (!transaction) throw new Error("Transaction not found");
                return transaction;
            } catch (error: any) {
                console.error("Can't find transaction", error);
                throw new Error(error.message || "Internal Server error");
            }
        }
    },
    Mutation: {
        createTransaction: async (_parent: unknown, { input }: { input: CreateTransactionInput }, context: any) => {
            try {
                const newTransaction = new Transaction({
                    ...input,
                    userId: context.getUser()._id,
                });
                await newTransaction.save();
                return newTransaction;
            } catch (err) {
                console.error("Error creating transaction:", err);
                throw new Error("Error creating transaction");
            }
        },

        updateTransaction: async (_parent: unknown, { input }: { input: UpdateTransactionInput }, context: any) => {
            try {
                const updatedTransaction = await Transaction.findByIdAndUpdate(input.transactionId, input, {
                    new: true,
                    runValidators: true, 
                });
                if (!updatedTransaction) throw new Error("Transaction not found or could not be updated");
                return updatedTransaction;
            } catch (err) {
                console.error("Error updating transaction:", err);
                throw new Error("Error updating transaction");
            }
        },

        deleteTransaction: async (_parent: unknown, { transactionId }: { transactionId: string }, context: any) => {
            try {
                const deletedTransaction = await Transaction.findByIdAndDelete(transactionId);
                if (!deletedTransaction) throw new Error("Transaction not found or could not be deleted");
                return deletedTransaction;
            } catch (err) {
                console.error("Error deleting transaction:", err);
                throw new Error("Error deleting transaction");
            }
        },
    },
};

export default transactionResolver;
