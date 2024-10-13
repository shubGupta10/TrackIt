//user typedefs
const userTypeDefs = `#graphql
   #type definition of user
   type User {
      _id: ID!
      username: String!
      name: String!
      password: String!
      profilePicture: String
      gender: String!
   }

  #query karo user pe
   type Query {
      users: [User!]
      authUser: User
      user(userId: ID!): User
   }

   #mutation me delete , signup and all
   type Mutation {
      signUp(input: SignUpInput!): User #user is reponse
      login(input: LoginInput!): User
      logout: LogoutResponse
   }

   input SignUpInput {
      username: String!
      name: String!
      password: String!
      gender: String!
   }

   input LoginInput {
      username: String!
      password: String!
   }

   type LogoutResponse {
      message: String!
   }
`


export default userTypeDefs
