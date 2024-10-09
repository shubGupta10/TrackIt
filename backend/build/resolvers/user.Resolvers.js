import { users } from "../dummyData/data.js";
const userResolver = {
    // Resolver logic for queries
    Query: {
        users: () => {
            return users;
        },
        user: (_, { userId }) => {
            return users.find((user) => user._id === userId);
        }
    },
    Mutation: {}
};
export default userResolver;
