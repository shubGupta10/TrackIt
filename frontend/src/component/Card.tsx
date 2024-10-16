import { FaLocationDot } from "react-icons/fa6";
import { BsCardText } from "react-icons/bs";
import { MdOutlinePayments } from "react-icons/md";
import { FaSackDollar } from "react-icons/fa6";
import { FaTrash } from "react-icons/fa";
import { HiPencilAlt } from "react-icons/hi";
import { Link } from "react-router-dom";
import { useMutation } from "@apollo/client";
import { DELETE_TRANSACTION } from "../graphql/mutations/transactionMutations";
import toast from "react-hot-toast";

const categoryColorMap: Record<string, string> = {
  saving: "from-green-700 to-green-400",
  expense: "from-pink-800 to-pink-600",
  investment: "from-blue-700 to-blue-400",
};

interface Transaction {
  _id: string;
  description: string;
  paymentType: string;
  category: string;
  amount: number;
  location: string;
  date: string;
}

interface CardProps {
  transaction: Transaction;
  authUser: any; 
}

const Card: React.FC<CardProps> = ({ transaction, authUser }) => {
  const cardClass = categoryColorMap[transaction.category as keyof typeof categoryColorMap];

  const [deleteTransaction, {loading}] = useMutation(DELETE_TRANSACTION, {
    refetchQueries: ["GetTransactions"]
  })


  const handleDelete = async () => {
    try {
      await deleteTransaction({variables: {transactionId: transaction._id}})
      toast.success("Toast deleted successfully")
    } catch (error: any) {
      toast.error(error.message)
    }
  }

  return (
    <div className={`rounded-md p-4 bg-gradient-to-br ${cardClass}`}>
      <div className='flex flex-col gap-3'>
        <div className='flex flex-row items-center justify-between'>
          <h2 className='text-lg font-bold text-white'>{transaction.category.charAt(0).toUpperCase() + transaction.category.slice(1)}</h2>
          <div className='flex items-center gap-2'>
            <FaTrash className={"cursor-pointer"} onClick={handleDelete} />
            <Link to={`/transaction/${transaction._id}`}>
              <HiPencilAlt className='cursor-pointer' size={20} />
            </Link>
          </div>
        </div>
        <p className='text-white flex items-center gap-1'>
          <BsCardText />
          Description: {transaction.description}
        </p>
        <p className='text-white flex items-center gap-1'>
          <MdOutlinePayments />
          Payment Type: {transaction.paymentType}
        </p>
        <p className='text-white flex items-center gap-1'>
          <FaSackDollar />
          Amount: ${transaction.amount}
        </p>
        <p className='text-white flex items-center gap-1'>
          <FaLocationDot />
          Location: {transaction.location}
        </p>
        <div className='flex justify-between items-center'>
          <p className='text-xs text-black font-bold'>{new Date(transaction.date).toLocaleDateString()}</p>
          <img
            src={"https://tecdn.b-cdn.net/img/new/avatars/2.webp"}
            className='h-8 w-8 border rounded-full'
            alt={authUser.name || "User Avatar"}
          />
        </div>
      </div>
    </div>
  );
};

export default Card;
