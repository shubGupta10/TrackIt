import User from "../model/UserMode.js";
import bcrypt from 'bcryptjs';
const userResolver = {
    Mutation: {
        signUp: async (_, { input }, context) => {
            try {
                const { username, name, password, gender } = input;
                if (!username || !name || !password || !gender) {
                    throw new Error("All fields are required");
                }
                const existingUser = await User.findOne({ username });
                if (existingUser) {
                    throw new Error("User already exists");
                }
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(password, salt);
                const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`;
                const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`;
                const newUser = new User({
                    username,
                    name,
                    password: hashedPassword,
                    gender,
                    profilePicture: gender === 'male' ? boyProfilePic : girlProfilePic
                });
                await newUser.save();
                await context.login(newUser);
                return newUser;
            }
            catch (error) {
                console.error("User creation failed", error);
                throw new Error(error.message || "Internal Server error");
            }
        },
        login: async (_, { input }, context) => {
            try {
                const { username, password } = input;
                const { user } = await context.authenticate("graphql-local", { username, password });
                await context.login(user);
                return user;
            }
            catch (error) {
                console.error("User login failed", error);
                throw new Error(error.message || "Internal Server error");
            }
        },
        logout: async (_parent, _args, { context }) => {
            try {
                await context.logout();
                context.req.session.destroy((error) => {
                    if (error)
                        throw new Error("Session destruction failed");
                });
                context.res.clearCookie("connect.sid");
                return { message: "User logout successful" };
            }
            catch (error) {
                console.error("User logout failed", error);
                throw new Error(error.message || "Internal Server error");
            }
        }
    },
    // Resolver logic for queries
    Query: {
        authUser: async (_, __, context) => {
            try {
                const user = await context.getUser();
                return user;
            }
            catch (error) {
                console.error("User is not authenticated failed", error);
                throw new Error(error.message || "Internal Server error");
            }
        },
        user: async (_, { userId }) => {
            try {
                const user = await User.findById(userId);
                return user;
            }
            catch (error) {
                console.error("User does not found", error);
                throw new Error(error.message || "Internal Server error");
            }
        }
    },
};
export default userResolver;
