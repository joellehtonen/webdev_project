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

import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom'; // Import Link here
import PokemonList from './pokemonList'; // Adjust the import path as necessary
import RegisterForm from './registerForm';

function App() {
  return (
    <Router>
      <div>
        <h1>
          <Link to="/">Pokemon Finder</Link>
        </h1>
        <div>
          <RegisterForm />
        </div>
        <nav>
          <Link to="/pokemons">View Pokémon List</Link>
        </nav>
        <Routes>
          <Route path="/pokemons" element={<PokemonList />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;