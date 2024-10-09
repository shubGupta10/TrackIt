import passport from "passport";
import bcyrpt from 'bcryptjs'
import User from "../model/UserMode.js";
import { GraphQLLocalStrategy } from "graphql-passport";


export const configurePassport = async () => {
    passport.serializeUser((user: any, done) => {
        console.log("Serializing User:", user);
        console.log("User ID:", user.id);
        console.log("User _id:", user._id);
        
        const userId = user._id.toString();
        done(null, userId);
    })


    passport.deserializeUser(async (id , done) => {
        console.log("deserialise User");
        try {
            const user = await User.findById(id)
            done(null, user)
        } catch (error) {
            done(error)
        }
    })


    passport.use(
        new GraphQLLocalStrategy(async (username: any, password: any, done) => {
            try {
                const user = await User.findOne({username});
                if(!user){
                    throw new Error("Invalid username and password")
                }

                const isValid = await bcyrpt.compare(password, user.password )

                if(!isValid){
                    throw new Error("Password is incorrect")
                }

                return done(null, user)
            } catch (error) {
                return done(error)
            }
        })
    )
}