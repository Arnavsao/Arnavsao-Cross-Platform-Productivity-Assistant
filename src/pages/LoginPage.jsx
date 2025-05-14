import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, selectIsAuthenticated, selectAuthError, clearAuthError } from '../redux/authSlice';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const authError = useSelector(selectAuthError);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/chat'); // Redirect to chat if already authenticated (e.g., after successful login)
      dispatch(clearAuthError()); // Clear any previous errors
    }
    // Cleanup error on component unmount or when auth state changes
    return () => {
      dispatch(clearAuthError());
    };
  }, [isAuthenticated, navigate, dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser({ email, password }));
  };

  return (
    <div className="flex-grow flex flex-col items-center justify-center p-4 pt-24 md:pt-32">
      <div className="w-full max-w-md p-8 bg-slate-800 bg-opacity-80 rounded-xl shadow-2xl backdrop-blur-lg border border-slate-700">
        <h2 className="text-3xl font-bold text-sky-300 mb-6 text-center">
          Welcome Back!
        </h2>
        {authError && (
          <div className="mb-4 p-3 bg-red-500 text-white rounded-md text-sm text-center">
            {authError}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
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
              className="mt-1 block w-full px-3 py-2.5 border-slate-600 bg-slate-700 text-white rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
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
              className="mt-1 block w-full px-3 py-2.5 border-slate-600 bg-slate-700 text-white rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
            />
          </div>
          <button 
            type="submit" 
            className="w-full bg-sky-600 hover:bg-sky-700 text-white font-semibold py-3 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ease-in-out transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-opacity-75"
          >
            Log In
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-slate-400">
          Don't have an account?{' '}
          <Link to="/register" className="font-medium text-sky-400 hover:text-sky-300">
            Sign up here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage; 