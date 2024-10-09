import { mergeTypeDefs } from '@graphql-tools/merge';
import userTypeDefs from './user.typeDefs.js';
import transactionTypeDefs from './transaction.typeDefs.js';
const mergedTypeDefs = mergeTypeDefs([userTypeDefs, transactionTypeDefs]);
export default mergedTypeDefs;
