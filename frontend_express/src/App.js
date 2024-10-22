
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
  // const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

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
}, [location, userName]); // Re-run effect when location (route) changes

const fetchUserData = async (token) => {
  try {
    const response = await fetch(`http://localhost:5000/get_user_by_token`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });

    const data = await response.json(); // Parse JSON directly from response
      setUserName(data.username);
      setUserId(data.id);
      console.log("Logged in as", data.username); // Logging username
      console.log("ID is", data.id); // Logging username
  } catch (error) {
    console.error("Failed to fetch username: ", error);
    localStorage.removeItem('auth_token');
    setIsLoggedIn(false);
    setUserName('');
    setUserId(null);
  }
};

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
            <button className="navbar-brand" onClick={() => {
                  navigate('/');
                  // window.location.reload();
                }}
              >Pokémon Finder</button>
            </div>
            <ul className="navbar-nav">
              { isLoggedIn
                ? 
                /* Show Logout button if logged in */
                <>
                  <li className="nav-item">
                  <button className="nav-link text-capitalize" onClick={() => navigate(`/user/${userId}`)}>{userName}'s Home</button>
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
          <Route path="/" element={<PokemonList />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/user/:userId" element={<UserPage />} />
          <Route path="/pokemon/:name" element={<PokemonPage />} />
        </Routes>
      </main>

      <footer className="footer" style={{ position: 'relative', bottom: 0, width: '100%', backgroundColor: '#343a40', color: 'white', textAlign: 'center', padding: '20px' }}>
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
