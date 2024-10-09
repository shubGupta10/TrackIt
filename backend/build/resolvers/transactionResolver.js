import Transaction from "../model/TransactionMode.js";
const transactionResolver = {
    Query: {
        transactions: async (_parent, _args, context) => {
            try {
                if (!context.getUser())
                    throw new Error("Unauthorized");
                const userId = context.getUser()._id;
                const transactions = await Transaction.find({ userId });
                return transactions;
            }
            catch (error) {
                console.error("Failed to fetch transactions", error);
                throw new Error(error.message || "Internal Server error");
            }
        },
        transaction: async (_parent, { transactionId }, context) => {
            try {
                const transaction = await Transaction.findById(transactionId);
                if (!transaction)
                    throw new Error("Transaction not found");
                return transaction;
            }
            catch (error) {
                console.error("Can't find transaction", error);
                throw new Error(error.message || "Internal Server error");
            }
        }
    },
    Mutation: {
        createTransaction: async (_parent, { input }, context) => {
            try {
                const newTransaction = new Transaction({
                    ...input,
                    userId: context.getUser()._id,
                });
                await newTransaction.save();
                return newTransaction;
            }
            catch (err) {
                console.error("Error creating transaction:", err);
                throw new Error("Error creating transaction");
            }
        },
        updateTransaction: async (_parent, { input }, context) => {
            try {
                const updatedTransaction = await Transaction.findByIdAndUpdate(input.transactionId, input, {
                    new: true,
                    runValidators: true,
                });
                if (!updatedTransaction)
                    throw new Error("Transaction not found or could not be updated");
                return updatedTransaction;
            }
            catch (err) {
                console.error("Error updating transaction:", err);
                throw new Error("Error updating transaction");
            }
        },
        deleteTransaction: async (_parent, { transactionId }, context) => {
            try {
                const deletedTransaction = await Transaction.findByIdAndDelete(transactionId);
                if (!deletedTransaction)
                    throw new Error("Transaction not found or could not be deleted");
                return deletedTransaction;
            }
            catch (err) {
                console.error("Error deleting transaction:", err);
                throw new Error("Error deleting transaction");
            }
        },
    },
};
export default transactionResolver;
