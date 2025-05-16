import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser, selectAuthError, clearAuthError } from '../redux/authSlice';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [registrationAttempted, setRegistrationAttempted] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const authError = useSelector(selectAuthError);

  useEffect(() => {
    // Clear error on component mount
    dispatch(clearAuthError());
    setRegistrationAttempted(false); // Reset attempt flag on mount
    return () => {
      // Clear error on component unmount
      dispatch(clearAuthError());
    };
  }, [dispatch]);

  useEffect(() => {
    if (registrationAttempted && !authError) {
      setName('');
      setEmail('');
      setPassword('');
      // Show success message (handled by UI below) and then navigate
      setTimeout(() => {
        navigate('/login');
      }, 2000); // Delay for user to see success message
    }
    if (registrationAttempted) {
        setRegistrationAttempted(false);
    }
  }, [authError, registrationAttempted, navigate, dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(clearAuthError()); // Clear previous errors
    dispatch(registerUser({ name, email, password }));
    setRegistrationAttempted(true); // Signal that a registration attempt has been made
  };

  const isSuccess = !authError && registrationAttempted;

  return (
    <div className="flex-grow flex flex-col items-center justify-center p-4 pt-24 md:pt-32">
      <div className="w-full max-w-md p-8 bg-slate-800 bg-opacity-80 rounded-xl shadow-2xl backdrop-blur-lg border border-slate-700">
        <h2 className="text-3xl font-bold text-sky-300 mb-6 text-center">
          Create Your Account
        </h2>
        {authError && (
          <div className="mb-4 p-3 bg-red-500 text-white rounded-md text-sm text-center">
            {authError}
          </div>
        )}
        {isSuccess && (
          <div className="mb-4 p-3 bg-green-500 text-white rounded-md text-sm text-center">
            Registration successful! Redirecting to login...
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-1">
              Full Name
            </label>
            <input 
              type="text" 
              id="name" 
              name="name" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              required 
              disabled={isSuccess} // Disable form on success
              className="mt-1 block w-full px-3 py-2.5 border-slate-600 bg-slate-700 text-white rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm disabled:opacity-50"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-1">
              Email Address
            </label>
            <input 
              type="email" 
              id="email" 
              name="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
              disabled={isSuccess}
              className="mt-1 block w-full px-3 py-2.5 border-slate-600 bg-slate-700 text-white rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm disabled:opacity-50"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-1">
              Password
            </label>
            <input 
              type="password" 
              id="password" 
              name="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
              disabled={isSuccess}
              className="mt-1 block w-full px-3 py-2.5 border-slate-600 bg-slate-700 text-white rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm disabled:opacity-50"
            />
          </div>
          <button 
            type="submit" 
            disabled={isSuccess}
            className="w-full bg-sky-600 hover:bg-sky-700 text-white font-semibold py-3 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ease-in-out transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-opacity-75 disabled:opacity-75 disabled:cursor-not-allowed"
          >
            Sign Up
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-slate-400">
          Already have an account?{' '}
          <Link to="/login" className={`font-medium text-sky-400 hover:text-sky-300 ${isSuccess ? 'pointer-events-none' : ''}`}>
            Log in here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage; 