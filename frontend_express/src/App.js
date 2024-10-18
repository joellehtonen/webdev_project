
// src/App.js

import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useLocation, useNavigate } from 'react-router-dom'; // Import Link here
import PokemonList from './pokemonList'; // Adjust the import path as necessary
import RegisterForm from './registerForm';//
import RegisterPage from './registerPage';//
import LoginPage from './loginForm';
import UserPage from './userPage';
import PokemonPage from './pokemonPage';
//import IsTokenExpired from './handleTokenExpired';

function App() {
  const location = useLocation(); // Get the current route
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Check login status in localStorage
    const token = localStorage.getItem('auth_token'); // Check for token presence instead of 'isLoggedIn'
    const userNameStored = localStorage.getItem('username');
    console.log('stored username is ', userNameStored);
    if (token/* && !IsTokenExpired(token)*/) {
      setIsLoggedIn(!!token); // Set isLoggedIn based on token presence
      setUserName(userNameStored);
      console.log("Logged in user:", userName); // Checking if the username is logged correctly
    } else {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('username');
      setIsLoggedIn(false);
      setUserName('');
    }
}, [location]); // Re-run effect when location (route) changes

const handleLogout = () => {
    // Clear the login state and token
    localStorage.removeItem('auth_token');
    //localStorage.removeItem('username');
    setIsLoggedIn(false);
    setUserName('');
    navigate('/login'); // Redirect to login after logout
};

  return (
    <div>
      <h1>
        <Link to="/">Pokemon Finder</Link>
      </h1>
      {/* Conditionally render RegisterForm if not on the /login route */}
      {!isLoggedIn && location.pathname !== '/login' && (
        <div>
          <RegisterForm />
        </div>
      )}

      <nav className="navbar bg-dark navbar-expand-lg navbar-fixed-top" data-bs-theme="dark">
        <div className="container align-items-center">
          <div className="navbar-header">
            <a className="navbar-brand" href="/">Pokémon Finder</a>
          </div>
          <ul className="navbar-nav">
            { isLoggedIn
              ? 
              /* Show Logout button if logged in */
              <>
                <li className="nav-item">
                {/* <Link className="nav-link" to={`/user/${userName}`}>{userName}</Link> */}
                <a className="nav-link" href="/user">Todo: Username Here</a>
                </li>
                <li className="nav-item">
                  <button className="nav-link" onClick={handleLogout}>Logout</button>
                </li>
              </>
              :
              <>
              <li className="nav-item">
                <a className="nav-link" href="/login">Sign in</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/register">Register</a>
              </li>
              </>
            }
          </ul>
        </div>
      </nav>

      <div>
        {/* Define the routes for Login and Pokemon List */}
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/user/:username" element={<UserPage/>} />
        </Routes>
      </div>

      <Routes>
        <Route path="/" element={<PokemonList />} />
        <Route
          path="/pokemon/:name"
          element={<PokemonPage />}
        />
      </Routes>

      <Routes>
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </div>
  );
}

function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}

export default AppWrapper;
