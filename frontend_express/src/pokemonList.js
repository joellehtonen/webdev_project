import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './pokemonList.css';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const PokemonList = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [pokemonList, setPokemon] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredList, setFilteredList] = useState([]);
    const [currentPage, setCurrentPage] = useState(() => {
        const savedPage = location.state?.currentPage || localStorage.getItem('currentPage');
        return savedPage ? JSON.parse(savedPage) : 1;
    });
    const itemsPerPage = 50;
    const [users, setUsers] = useState([]);
    const [userSearchQuery, setUserSearchQuery] = useState('');
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [showTypeDropdown, setShowTypeDropdown] = useState(false);
    const [types, setTypes] = useState([]);

    console.log('Current page before funcs', currentPage);

    useEffect(() => {
        if (currentPage) {
            localStorage.setItem('currentPage', JSON.stringify(currentPage));
        }
    }, [currentPage]);

    // Go to Pokemon page
    const goToPokemonPage = (poke) => {
        console.log(`Clicked on Pokemon: ${poke.name}, current page stored: ${currentPage}`);
        navigate(`/pokemon/${poke.name}`, { state: {currentPage}});
    }

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

    const filterByType = async (type) => {
        try {
            const resp = await axios.get(`http://localhost:5000/pokemon/type${type}`)
            const pokemonByType = resp.data.pokemon
            setFilteredList(pokemonByType)
            setShowTypeDropdown(false)
            setCurrentPage(1)
        } catch (err) {
            setError(`Failed to fetch pokemon by type`)
        }
    }

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
        if (currentPage < totalPages) {
            const newPage = currentPage + 1;
            setCurrentPage(newPage);
        }
    };

    const goToPreviousPage = () => {
        if (currentPage > 1) {
            const newPage = currentPage - 1;
            setCurrentPage(newPage);
        }
    };

    console.log('Current page after funcs:', currentPage);

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
                        <div
                            key={user.id}
                            onClick={() => navigate(`/users/${user.id}`)}
                            className="dropdown-item"
                        >
                            {user.username}
                        </div>
                    ))}
                </div>
            )}

            {/* Pokémon Types Dropdown */}
            <button onClick={() => setShowTypeDropdown(prev => !prev)}>Pokemon Types</button>
            {showTypeDropdown && types.length > 0 && (
                <div className="dropdown-list">
                    {types.map((type) => (
                        <div
                            key={type.name}
                            onClick={() => filterByType(type.name)}
                            className="dropdown-item"
                        >
                            {type.name.charAt(0).toUpperCase() + type.name.slice(1)} {/* Capitalize first letter */}
                        </div>
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
                        <div onClick={() => goToPokemonPage(poke)} style={{ cursor: 'pointer' }}>
                            <h3>{poke.name.charAt(0).toUpperCase() + poke.name.slice(1)}</h3>
                        </div>
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
