
// src/App.js

import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useLocation, useNavigate } from 'react-router-dom'; // Import Link here
import PokemonList from './pokemonList'; // Adjust the import path as necessary
//import RegisterForm from './registerForm';//
import RegisterPage from './registerPage';//
import LoginPage from './loginForm';
import UserPage from './userPage';
import PokemonPage from './pokemonPage';
import UserSettingsPage from './userSettingsPage';
import './App.css';
import axios from 'axios';
//import IsTokenExpired from './handleTokenExpired';

function App() {
  const location = useLocation(); // Get the current route
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [userId, setUserId] = useState(null);
  // const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);

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

// fetch your user data when logging in
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

// Fetch user data when searching for other users
    useEffect(() => {
      const token = localStorage.getItem('auth_token')
      const fetchUsersSearch = async () => {
          if (token) {
              try {
                  const resp = await axios.get('http://localhost:5000/users');
                  setUsers(resp.data);
                  setFilteredUsers(resp.data);
              } catch (err) {
                  setError('Failed to fetch users');
              }
          }
      }
      fetchUsersSearch();
  }, []);

  // Filter users based on search query
  useEffect(() => {
      if (userSearchQuery) {
          setFilteredUsers(
              users.filter((user) =>
                  user.username.toLowerCase().includes(userSearchQuery.toLowerCase())
              )
          );
      } else {
          setFilteredUsers([]); // Clear filtered users
      }
  }, [userSearchQuery, users]);


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

            <div id="header">
            <div className="flex-container" style={{position: "relative"}}>
            {isLoggedIn && (
            <input
                type="text"
                placeholder="Search User"
                value={userSearchQuery}
                onChange={(e) => setUserSearchQuery(e.target.value)}
                className="border rounded p-2 mb-4 input-center"
            />
            )}
                {/* User Dropdown List */}
                {filteredUsers.length > 0 && isLoggedIn && (
                <div className="dropdown-list">
                    {filteredUsers.map((user) => (
                        <Link
                            key={user.id}
                            to={`/user/${user.id}`} // Link to user detail page
                            className="dropdown-item" // Class for styling
                            onClick={() => setUserSearchQuery('')} // Clear the search query on click
                        >
                            {user.username}
                        </Link>
                    ))}
                </div>
                )}
              </div>
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
                  <li className="nav-item">
                    <button className="nav-link" onClick={() => navigate(`/user/settings`)}>Settings</button>
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
          <Route path="/user/settings" element={<UserSettingsPage />} />
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
