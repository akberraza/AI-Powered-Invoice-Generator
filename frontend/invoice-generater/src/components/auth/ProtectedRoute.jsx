import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({children}) => {
    // will integrate these
   const {isAuthenticated, loading} = useAuth();

  if(loading){
    // You Can render a loading spinner here
    return <div>Loading...</div>
  }

  if(!isAuthenticated){
    return <Navigate to='/login' replace  />
  }

  
    return <Outlet />
}

export default ProtectedRoute