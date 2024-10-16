// src/PokemonList.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './pokemonList.css';

const PokemonList = () => {
    const [pokemon, setPokemon] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPokemon = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/pokemon');
                setPokemon(response.data.results); // Access the results array
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch Pokémon');
                setLoading(false);
            }
        };

        fetchPokemon();
    }, []);

    if (loading) return <h2>Loading...</h2>;
    if (error) return <h2>{error}</h2>;

    return (
        <div>
            <h1>Pokémon List</h1>
            <div className="pokemon-grid">
                {pokemon.map((poke) => (
                    <div className="pokemon-card" key={poke.name}>
                       <h3>{poke.name.charAt(0).toUpperCase() + poke.name.slice(1)}</h3> {/* Capitalize the first letter */}
                  </div>
                ))}
            </div>
        </div>
    );
};

export default PokemonList;
