import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import DashboardLayout from '../layout/DashboardLayout';
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

  
    return (
     <DashboardLayout>
        {children ? children : <Outlet />}
     </DashboardLayout>
    )
}

export default ProtectedRoute