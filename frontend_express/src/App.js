
// src/App.js

import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation, useNavigate } from 'react-router-dom'; // Import Link here
import PokemonList from './pokemonList'; // Adjust the import path as necessary
//import RegisterForm from './registerForm';//
import RegisterPage from './registerPage';//
import LoginPage from './loginForm';
import UserPage from './userPage';
import PokemonPage from './pokemonPage';
//import IsTokenExpired from './handleTokenExpired';

function App() {
  const location = useLocation(); // Get the current route
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(() => {
    const savedPage = localStorage.getItem('currentPage');
    console.log('Saved page is ', savedPage);
    return savedPage ? JSON.parse(savedPage) : 1;
  });

  useEffect(() => {
    // Check login status in localStorage
    const token = localStorage.getItem('auth_token'); // Check for token presence instead of 'isLoggedIn'
    if (token/* && !IsTokenExpired(token)*/) {
      setIsLoggedIn(!!token); // Set isLoggedIn based on token presence
      fetchUserData(token);
    } else {
      localStorage.removeItem('auth_token');
      setIsLoggedIn(false);
      setUserName('');
      setUserId(null);
    }
}, [location]); // Re-run effect when location (route) changes

useEffect(() => {
  localStorage.setItem('currentPage', JSON.stringify(currentPage));
}, [currentPage]);

console.log('currentPage IN APP.JS IS ', currentPage);

const fetchUserData = async (token) => {
  try {
    const response = await fetch(`http://localhost:5000/get_user_by_token`,
      {
        headers: {'Authorization': `Bearer ${token}`},
      });
      const { username, id: userId } = await response.json();
      setUserName(username);
      setUserId(userId);
      console.log("Logged in as", response.data.username); // Logging username
  }
  catch (error) {
    console.error("Failed to fetch username: ", error);
    localStorage.removeItem('auth_token');
    setIsLoggedIn(false);
    setUserName('');
    setUserId(null);
  }
}

const handlePage = (page) => {
  setCurrentPage(page);
  navigate(`/${page}`);
}

const handleLogout = () => {
    // Clear the login state and token
    localStorage.removeItem('auth_token');
    setIsLoggedIn(false);
    setUserName('');
    navigate('/login'); // Redirect to login after logout
};

  return (
    <div>
      <header>
        <nav className="navbar bg-dark navbar-expand-lg navbar-fixed-top" data-bs-theme="dark">
          <div className="container align-items-center">
            <div className="navbar-header">
            <button className="navbar-brand" onClick={() => navigate('/')}>Pokémon Finder</button>
            </div>
            <ul className="navbar-nav">
              { isLoggedIn
                ? 
                /* Show Logout button if logged in */
                <>
                  <li className="nav-item">
                  <button className="nav-link text-capitalize" onClick={() => handlePage(userId)}>{userName}'s Home</button>
                  </li>
                  <li className="nav-item">
                    <button className="nav-link" onClick={handleLogout}>Logout</button>
                  </li>
                </>
                :
                <>
                <li className="nav-item">
                  <button className="nav-link" onClick={() => navigate('/login')}>Sign in</button>
                </li>
                <li className="nav-item">
                  <button className="nav-link" onClick={() => navigate('/register')}>Register</button>
                </li>
                </>
              }
            </ul>
          </div>
        </nav>
      </header>

      <main>
        {/* Define the routes for Login and Pokemon List */}
        <Routes>
          <Route path="/" element={<PokemonList currentPage={currentPage}/>} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/user/:username" element={<UserPage />} />
          <Route path="/pokemon/:name" element={<PokemonPage currentPage={currentPage} />} />
        </Routes>
      </main>

      <footer className="footer" style={{ position: 'fixed', bottom: 0, width: '100%', backgroundColor: '#343a40', color: 'white', textAlign: 'center', padding: '1rem' }}>
        <p>&copy; 2024 Pokémon Finder. All rights reserved.</p>
      </footer>
    </div>
  );
};

function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}

export default AppWrapper;
