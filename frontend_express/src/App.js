/*import React from 'react';
import './App.css';
import PokemonList from './pokemonList';
import { Router, Link } from "react-router-dom"

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;*/

// src/App.js

import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useLocation, useNavigate } from 'react-router-dom'; // Import Link here
import PokemonList from './pokemonList'; // Adjust the import path as necessary
import RegisterForm from './registerForm';//
import LoginPage from './loginForm';
import UserPage from './userPage';
import PokemonPage from './pokemonPage';
//import IsTokenExpired from './handleTokenExpired';
//import userPage from './userPage';

function App() {
  const location = useLocation(); // Get the current route
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');

  useEffect(() => {
    // Check login status in localStorage
    const token = localStorage.getItem('authToken'); // Check for token presence instead of 'isLoggedIn'
    const userName = localStorage.getItem('userName');
    if (token/* && !IsTokenExpired(token)*/) {
      setIsLoggedIn(!!token); // Set isLoggedIn based on token presence
      setUserName(userName);
    } else {
      localStorage.removeItem('authToken');
      localStorage.removeItem('userName');
      setIsLoggedIn(false);
    }
}, [location]); // Re-run effect when location (route) changes

const handleLogout = () => {
    // Clear the login state and token
    localStorage.removeItem('authToken');
    localStorage.removeItem('userName');
    setIsLoggedIn(false);
    navigate('/login'); // Redirect to login after logout
};

  return (
    <div>
      <h1>
        <Link to="/">Pokemon Finder</Link>
      </h1>

      {isLoggedIn && (
        <nav>
          <Link to="/user">{userName}</Link>
        </nav>
      )}

      {/* Conditionally render RegisterForm if not on the /login route */}
      {!isLoggedIn && location.pathname !== '/login' && (
        <div>
          <RegisterForm />
        </div>
      )}

      <div>
        {!isLoggedIn && (
          <nav>
            <Link to="/login">Login</Link>
          </nav>
        )}

        {/* Define the routes for Login and Pokemon List */}
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/user/:username" element={<UserPage/>} />
        </Routes>
      </div>

      {/* Show Logout button if logged in */}
      {isLoggedIn && (
          <div>
              <button onClick={handleLogout}>Logout</button>
          </div>
      )}

      <nav>
        <Link to="/pokemon">View Pokémon List</Link>
      </nav>

      <Routes>
        <Route path="/pokemon" element={<PokemonList />} />
        <Route
          path="/pokemon/:name"
          element={<PokemonPage />}
          />
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