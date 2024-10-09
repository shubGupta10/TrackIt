import { users } from "../dummyData/data.js";

interface User {
    _id: string;
    username: string;
    name: string;
    password: string;
    profilePicture: string;
    gender: string;
}

const userResolver = {
    // Resolver logic for queries
    Query: {
        users: (): User[] => {
            return users;
        },
        user: (_: unknown, { userId }: { userId: string }): User | undefined => {
            return users.find((user) => user._id === userId);
        }
    },
    Mutation: {}
}

export default userResolver;
