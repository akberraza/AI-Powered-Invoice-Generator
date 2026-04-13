import {BrowserRouter as Router, Routes, Route, Navigate, BrowserRouter } from 'react-router-dom';
import {toast, Toaster} from 'react-hot-toast';
import LandingPage from './pages/LandingPage/LandingPage';
import Signup from './pages/Auth/Signup';
import Login from './pages/Auth/Login';
import Dashboard from './pages/Dashboard/Dashboard';
import AllInvoices from './pages/Invoices/AllInvoices';
import CreateInvoice from './pages/Invoices/CreateInvoice';
import InvoiceDetails from './pages/Invoices/InvoiceDetails';
import ProfilePage from './pages/Profile/ProfilePage';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';

const App = () => {
  return (
     <AuthProvider>
        <BrowserRouter>
            <Routes>
                {/* Public Routes */}
               <Route path='/' element={<LandingPage />} />
               <Route path='/signup' element={<Signup />} />
               <Route path='/login' element={<Login />} />

               {/* Protected Routes */}
               <Route path='/' element={<ProtectedRoute />} />
               <Route path='dashboard' element={<Dashboard />} />
               <Route path='invoices' element={<AllInvoices />} />
               <Route path='invoices/new' element={<CreateInvoice />} />
               <Route path='invoices/:id' element={<InvoiceDetails />} />
               <Route path='profile' element={<ProfilePage ></ProfilePage>} />

              {/* Catch all route */}
              <Route path='*' element={<Navigate to='/' replace />} />

            </Routes>
        </BrowserRouter>

        <Toaster  
          toastOptions={{
            className: '',
            style: {
              fontSize: '13px',
            },
          }}
        />
     </AuthProvider>
  )
}

export default App