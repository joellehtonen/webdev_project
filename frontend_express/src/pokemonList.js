// src/PokemonList.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './pokemonList.css';
import { Link } from 'react-router-dom';

const PokemonList = () => {
    const [pokemonList, setPokemon] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredList, setFilteredList] = useState([]);

    useEffect(() => {
        const fetchPokemon = async () => {
            try {
                const response = await axios.get('http://localhost:5000/pokemon');
                setPokemon(response.data.results); // Access the results array
                setLoading(false);
                setFilteredList(response.data.results);
            } catch (err) {
                setError('Failed to fetch Pokémon');
                setLoading(false);
            }
        };

        fetchPokemon();
    }, []);

        useEffect(() => {
        if (searchQuery) {
            const filtered = pokemonList.filter(pokemon =>
                pokemon.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setFilteredList(filtered);
        } else {
            setFilteredList(pokemonList);
        }
    }, [searchQuery, pokemonList]);

    if (loading) return <h2>Loading...</h2>;
    if (error) return <h2>{error}</h2>;

    return (
        <div>
            <input
                type="text"
                placeholder="Search Pokémon"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)} // Update the search query
                className="border rounded p-2 mb-4"
            />
            <div className="pokemon-grid">
                {filteredList.map((poke) => (
                    <div className="pokemon-card" key={poke.name}>
                        <Link to ={`/pokemon/${poke.name}`}>
                       <h3>{poke.name.charAt(0).toUpperCase() + poke.name.slice(1)}</h3> {/* Capitalize the first letter */}
                       </Link>
                  </div>
                ))}
            </div>
        </div>
    );
};

export default PokemonList;
