import React, { useState } from 'react'
import {
  Eye,
  EyeOff,
  Loader2,
  Mail,
  Lock,
  FileText,
  ArrowRight,
  User
} from 'lucide-react';
import { API_PATHS } from '../../utils/apiPaths';
import { useAuth } from '../../context/AuthContext';
import axiosInstance from '../../utils/axiosInstance';
import { useNavigate } from 'react-router-dom';
import { validateEmail, validatePassword } from '../../utils/helper';

const Signup = () => {

  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setformData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [fieldError, setFieldError] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const [touched, setTouched] = useState({
    name: false,
    email: false,
    password: false,
    confirmPassword: false
  });

  //  Validation function
  const validateName = (name) => { };

  const validateConfirmPassword = (confirmPassword, password) => { };

  const handleInputChange = (e) => { };

  const handleBlur = (e) => { };

  const isFormValid = () => { };

  const handleSubmit = async () => { };

  return (
    <div className=''>
      <div className=''>

        {/* Header */}
        <div className=''>
          <div className=''>
            <FileText className='' />
          </div>

          <h1 className=''>Create Account</h1>
          <p className=''>Join Invoice Generator today</p>

        </div>

        {/* Form */}
        <div className=''>

          {/* Name */}
          <div>
            <label className=''>Full Name</label>
            <div className=''>
              <User className='' />
              <input
                name='name'
                type='text'
                required
                value={formData.name}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={`w-full pl-12 pr-3 border rounded-lg focus:ring-2 foucs:border-transparent outline-none transition-all ${fieldError.name && touched.name
                    ? "border-red-300 foucs:ring-red-500"
                    : "border-gray-300 foucs:ring-black"
                  }`}
                placeholder='Enter your full name'
              />
            </div>

            {fieldError.name && touched.name && (
              <p className=''>{fieldError.name} </p>
            )}

          </div>

          {/* Email */}
          <div>
            <label className=''>Email</label>
            <div className=''>
              <Mail className='' />
              <input
                name='email'
                type="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={`w-full pl-12 pr-4 border rounded-lg foucs:ring-2 foucs:border-transparent outline-none transition-all ${fieldError.email && touched.email
                    ? "border-red-300 foucs:ring-red-500"
                    : "border-gray-300 foucs:ring-black"
                  }`}
                placeholder='Enter your email'
              />
            </div>
            {fieldError.email && touched.email && (
              <p className=''>{fieldError.email}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className=''>Password</label>
            <div className=''>
              <Lock className='' />
              <input
                name='password'
                type={showPassword ? 'text' : "password"}
                required
                value={formData.password}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={`w-full pl-12 pr-4 border rounded-lg foucs:ring-2 foucs:border-transparent outline-none transition-all ${fieldError.password && touched.password
                    ? "border-red-300 foucs:ring-red-500"
                    : "border-gray-300 foucs:ring-black"
                  }`}
                placeholder='Create a password'
              />
              <button
                type='button'
                onClick={() => setShowPassword(!showPassword)}
                className=''
              >
                {showPassword ? (
                  <EyeOff className='' />
                ) : (
                  <Eye className='' />
                )}
              </button>
            </div>

            {fieldError.password && touched.password && (
              <p className=''>{fieldError.password} </p>
            )}

          </div>

          {/* Confirm Password */}
          <div>
            <label className=''>Confirm Password</label>
            <div className=''>
              <Lock className='' />
              <input
                name='confirmpassword'
                type={showConfirmPassword ? 'text' : "password"}
                required
                value={formData.confirmPassword}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={`w-full pl-12 pr-4 border rounded-lg foucs:ring-2 foucs:border-transparent outline-none transition-all ${fieldError.confirmPassword && touched.confirmPassword
                    ? "border-red-300 foucs:ring-red-500"
                    : "border-gray-300 foucs:ring-black"
                  }`}
                placeholder='Confirm password'
              />
            </div>
          </div>

        </div>

      </div>
    </div>
  )
}

export default Signup