import { useEffect, useState } from "react";
import {
  Briefcase,
  LogOut,
  Menu,
  X
} from "lucide-react"
import {Link, useNavigate } from 'react-router-dom';
import {useAuth} from '../../context/AuthContext';
import ProfileDropdown from './ProfileDropDown';

const DashboardLayout = ({children}) => {

  const {user, logout} = useAuth();
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeNavItem, setActiveNavItem] = useState(activeMenu || "dashboard");
  const [profileDropDownOpen, setProfileDropDownOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Handle responsive behavior 
  useEffect(() => {
      const handleResize = () => {
        const mobile = window.innerWidth < 786;
        setIsMobile(mobile);
        if(!mobile){
          setSidebarOpen(false);
        }
      };

      handleResize();
      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize)
      }
  }, []);

  return (
    <div>DashboardLayout
        <div>{children}</div>
    </div>
  )
}

export default DashboardLayout