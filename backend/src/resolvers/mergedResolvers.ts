import { mergeResolvers } from "@graphql-tools/merge";

import transactionResolver from "./transactionResolver.js";
import userResolver from "./user.Resolvers.js";

const mergedResolver = mergeResolvers([userResolver, transactionResolver])

export default mergedResolver