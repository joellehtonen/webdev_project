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
    const [selectedType, setSelectedType] = useState(null)
    const [sortAZ, setSortAZ] = useState(false); // A-Z checkbox
    const [sortZA, setSortZA] = useState(false); // Z-A checkbox

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
        let filtered = pokemonList;

        if (searchQuery) {
            filtered = filtered.filter(pokemon =>
                pokemon.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Sort if checkboxes are checked
        if (sortAZ || sortZA) {
            filtered = sortPokemons(filtered);
        }

        setFilteredList(filtered);
        setCurrentPage(1);
    }, [searchQuery, pokemonList, sortAZ, sortZA]);

    // Fetch users data
    useEffect(() => {
        const token = localStorage.getItem('auth_token')
        const fetchUsers = async () => {
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
        setSearchQuery('')
        if (type === 'all') {
            setFilteredList(sortPokemons(pokemonList))
            setSelectedType(null)
            setShowTypeDropdown(false)
            setCurrentPage(1)
            return;
        }
        try {
            const resp = await axios.get(`http://localhost:5000/pokemon?type=${type}`)
            console.log(resp.data);
            const pokemonByType = resp.data.pokemon.map(p => ({
                name: p.pokemon.name,
                url: p.pokemon.url,
                types: p.pokemon.types
            }))
            setFilteredList(sortPokemons(pokemonByType))
            setShowTypeDropdown(false)
            setCurrentPage(1)
            setSelectedType(type)
        } catch (err) {
            setError(`Failed to fetch pokemon by type`)
        }
    }

    const sortPokemons = (list) => {
        return [...list].sort((a, b) => {
            const nameA = a.name.toLowerCase()
            const nameB = b.name.toLowerCase()

            if (sortAZ && !sortZA) {
                return nameA.localeCompare(nameB);
            } else if (sortZA && !sortAZ) {
                return nameB.localeCompare(nameA);
            }
            return 0
        })
    }

    // Update sorting states
    const handleSortAZ = () => {
        setSortAZ(prev => !prev); // Toggle A-Z sorting
        if (sortZA) setSortZA(false); // Ensure Z-A is off
    };

    const handleSortZA = () => {
        setSortZA(prev => !prev); // Toggle Z-A sorting
        if (sortAZ) setSortAZ(false); // Ensure A-Z is off
    };

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

            {/* Pokémon Types Dropdown */}
            <button onClick={() => setShowTypeDropdown(prev => !prev)}>
                {selectedType ? `Filter by ${selectedType.charAt(0).toUpperCase() + selectedType.slice(1)}` : 'Pokemon Types'}
            </button>
            {showTypeDropdown && types.length > 0 && (
                <div className="dropdown-list">
                    <div
                        className="dropdown-item"
                        onClick={() => filterByType('all')} // Handle "All Pokémon"
                    >
                        All Pokémon
                    </div>
                    {types.map((type) => (
                        <div
                            key={type.name}
                            /*to={`/pokemon/type/${type.name}`}*/
                            className="dropdown-item"
                            onClick={() => //{
                                //setShowTypeDropdown(false); // Hide dropdown after selection
                                filterByType(type.name)
                            }//}
                        >
                            {type.name.charAt(0).toUpperCase() + type.name.slice(1)} {/* Capitalize first letter */}
                        </div>
                    ))}
                </div>
            )}

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

            <input
                type="text"
                placeholder="Search User"
                value={userSearchQuery}
                onChange={(e) => setUserSearchQuery(e.target.value)}
                className="border rounded p-2 mb-4"
            />

            <div>
                <label>
                    <input
                        type="checkbox"
                        checked={sortAZ}
                        onChange={handleSortAZ}
                    />
                    Sort A-Z
                </label>
                <label>
                    <input
                        type="checkbox"
                        checked={sortZA}
                        onChange={handleSortZA}
                    />
                    Sort Z-A
                </label>
            </div>

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
