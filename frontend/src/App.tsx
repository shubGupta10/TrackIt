import {Navigate, Route, Routes} from 'react-router-dom'
import SignUpPage from './pages/SignUpPage'
import LoginPage from './pages/LoginPage'
import HomePage from './pages/HomePage'
import NotFoundPage from './pages/NotFoundPage'
import TransactionPage from './pages/TransactionPage'
import Header from './component/Header'
import { useQuery } from '@apollo/client'
import { GET_AUTHENTICATED_USER } from './graphql/queries/userQuery'

const App = () => {
  const {loading, data, error} = useQuery(GET_AUTHENTICATED_USER);

  console.log("loading", loading);
  console.log("Authenticated User:", data);
  console.log("Error", error);
  if(loading) return null
  return (
    <>
    {data?.authUser && <Header/>}
    <Routes>
				<Route path='/' element={data?.authUser ? <HomePage /> : <Navigate to="/login" />} />
				<Route path='/login' element={!data?.authUser ? <LoginPage />: <Navigate to="/" />} />
				<Route path='/signup' element={!data?.authUser ? <SignUpPage />: <Navigate to="/" />} />
				<Route path='/transaction/:id' element={ data.authUser ? <TransactionPage />  : <Navigate to="/login" />} />
				<Route path='*' element={<NotFoundPage />} />
			</Routes>
    </>
  )
}

export default App