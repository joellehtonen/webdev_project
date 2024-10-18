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
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 50;
    const [users, setUsers] = useState([]);
    const [userSearchQuery, setUserSearchQuery] = useState('');
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [showTypeDropdown, setShowTypeDropdown] = useState(false);
    const [types, setTypes] = useState([]);

    // Fetch Pokémon data
    useEffect(() => {
        const fetchPokemon = async () => {
            try {
                const response = await axios.get('http://localhost:5000/pokemon');
                setPokemon(response.data.results);
                setLoading(false);
                setFilteredList(response.data.results);
            } catch (err) {
                setError('Failed to fetch Pokémon');
                setLoading(false);
            }
        };

        fetchPokemon();
    }, []);

    // Filter Pokémon based on search query
    useEffect(() => {
        if (searchQuery) {
            const filtered = pokemonList.filter(pokemon =>
                pokemon.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setFilteredList(filtered);
        } else {
            setFilteredList(pokemonList);
        }
        setCurrentPage(1);
    }, [searchQuery, pokemonList]);

    // Fetch users data
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const resp = await axios.get('http://localhost:5000/users');
                setUsers(resp.data);
                setFilteredUsers(resp.data);
            } catch (err) {
                setError('Failed to fetch users');
            }
        };
        fetchUsers();
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

    // Fetch Pokémon types
    useEffect(() => {
        const fetchPokemonTypes = async () => {
            try {
                const resp = await axios.get('http://localhost:5000/pokemon/type');
                setTypes(resp.data); // Expecting an array of types
            } catch (err) {
                setError('Failed to fetch types');
            }
        };
        fetchPokemonTypes();
    }, []);

    if (loading) {
        return (
            <div className="alert alert-secondary text-center" role="alert">
                Loading...
            </div>
        );
    }
    if (error) return <h2>{error}</h2>;

    const totalPages = Math.ceil(filteredList.length / itemsPerPage);
    const paginatedList = filteredList.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const goToNextPage = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    const goToPreviousPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    return (
        <div>
            <input
                type="text"
                placeholder="Search Pokémon"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="border rounded p-2 mb-4"
            />

            {/* User Dropdown List */}
            {filteredUsers.length > 0 && (
                <div className="dropdown-list">
                    {filteredUsers.map((user) => (
                        <Link
                            key={user.id}
                            to={`/users/${user.id}`} // Link to user detail page
                            className="dropdown-item" // Class for styling
                            onClick={() => setUserSearchQuery('')} // Clear the search query on click
                        >
                            {user.username}
                        </Link>
                    ))}
                </div>
            )}

            {/* Pokémon Types Dropdown */}
            <button onClick={() => setShowTypeDropdown(prev => !prev)}>Pokemon Types</button>
            {showTypeDropdown && types.length > 0 && (
                <div className="dropdown-list">
                    {types.map((type) => (
                        <Link
                            key={type.name}
                            to={`/pokemon/type/${type.name}`}
                            className="dropdown-item"
                            onClick={() => {
                                setShowTypeDropdown(false); // Hide dropdown after selection
                            }}
                        >
                            {type.name.charAt(0).toUpperCase() + type.name.slice(1)} {/* Capitalize first letter */}
                        </Link>
                    ))}
                </div>
            )}

            <input
                type="text"
                placeholder="Search User"
                value={userSearchQuery}
                onChange={(e) => setUserSearchQuery(e.target.value)}
                className="border rounded p-2 mb-4"
            />

            <div className="pokemon-grid">
                {paginatedList.map((poke) => (
                    <div className="pokemon-card" key={poke.name}>
                        <Link to={`/pokemon/${poke.name}`}>
                            <h3>{poke.name.charAt(0).toUpperCase() + poke.name.slice(1)}</h3>
                        </Link>
                    </div>
                ))}
            </div>
            <div className="pagination">
                <button onClick={goToPreviousPage}>Previous</button>
                <span>{`Page ${currentPage} of ${totalPages}`}</span>
                <button onClick={goToNextPage}>Next</button>
            </div>
        </div>
    );
};

export default PokemonList;
