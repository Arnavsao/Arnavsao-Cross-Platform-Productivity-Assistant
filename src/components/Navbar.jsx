import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser, selectIsAuthenticated, selectCurrentUser } from '../redux/authSlice';

const Navbar = () => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const currentUser = useSelector(selectCurrentUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-slate-900 bg-opacity-80 backdrop-blur-md shadow-lg z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center">
            <Link to="/" className="text-3xl font-bold text-sky-400 hover:text-sky-300 transition-colors">
              Zenith Mode
            </Link>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link
                to="/"
                className="text-slate-300 hover:bg-slate-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150"
              >
                Home
              </Link>
              
              {isAuthenticated && currentUser ? (
                <>
                  <span className='text-slate-300 px-3 py-2 text-sm'>Hi, {currentUser.name}!</span>
                  <Link
                    to="/chat"
                    className="text-slate-300 hover:bg-slate-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150"
                  >
                    Chat
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="text-slate-300 hover:bg-red-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150 bg-red-600"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  className="bg-sky-600 text-white hover:bg-sky-700 px-4 py-2 rounded-md text-sm font-medium transition-colors duration-150 shadow-sm"
                >
                  Login / Sign Up
                </Link>
              )}
            </div>
          </div>
          {/* Mobile menu button (optional, can add later) */}
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 