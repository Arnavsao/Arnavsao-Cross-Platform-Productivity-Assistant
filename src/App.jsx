import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ChatPage from './pages/ChatPage';
import CustomCursor from './components/CustomCursor';

const App = () => {
  return (
    <Router>
      <CustomCursor />
      <div className='min-h-screen bg-gradient-to-br from-slate-900 via-gray-800 to-slate-900 text-white flex flex-col selection:bg-sky-500 selection:text-sky-900 app-container'>
        <Navbar />
        <div className="flex-grow pt-20"> {/* Ensure content isn't hidden by fixed navbar */}
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/chat" element={<ChatPage />} /> {/* We'll protect this route later */}
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
};

export default App;