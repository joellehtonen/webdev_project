import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import './pokemonList.css';
import { Link, useLocation, useNavigate} from 'react-router-dom';
import { jwtDecode } from "jwt-decode"
import { isValidInputTimeValue, wait } from '@testing-library/user-event/dist/utils';
import './App.css'

const PokemonList = () => {
    const [pokemonList, setPokemon] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredList, setFilteredList] = useState([]);
    const itemsPerPage = 28;
    const [showTypeDropdown, setShowTypeDropdown] = useState(false);
    const [types, setTypes] = useState([]);
    const [selectedType, setSelectedType] = useState(null)
    const [sortAZ, setSortAZ] = useState(false); // A-Z checkbox
    const [sortZA, setSortZA] = useState(false); // Z-A checkbox
    const [typeFilteredList, setTypeFilteredList] = useState([]);
    const location = useLocation();
    const navigate = useNavigate();
    const { currentPage: initialPage } = location.state || { currentPage: 1 };  // Default to page 1 if no state is passed
    const [currentPage, setCurrentPage] = useState(initialPage);
    const [paginatedList, setPaginatedList] = useState([]);
    const [authToken, setAuthToken] = useState("");
    const [decodedToken, setDecodedToken] = useState({});
    const [userLikes, setUserLikes] = useState([]);
    const [userId, setUserId] = useState(null);
    const query = new URLSearchParams(location.search);
    const type = query.get('type');
    const page = parseInt(query.get('page')) || 1;

    useEffect(() => {
        const token = localStorage.getItem('auth_token');
        if (token && token.split('.').length === 3) {
            setAuthToken(token);
            const decodedToken = jwtDecode(token);
            setDecodedToken(decodedToken);
            setUserId(decodedToken.id);
        } else {
            setAuthToken("");
            setDecodedToken({});
        }
    },[])

    // Fetch likes
    useEffect(() => {
        if (userId === null)
            return ;
        const fetchLikes = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/likes/user/${userId}`)
                const likes = response.data;
                setUserLikes(likes);
            }
            catch (err) {
                console.log(`Error fetching user likes: ${err}`);
            }
        }
        fetchLikes();
    }, [userId]);

    const sortPokemons = useCallback((list) => {
        return [...list].sort((a, b) => {
            const nameA = a.name.toLowerCase();
            const nameB = b.name.toLowerCase();
    
            if (sortAZ && !sortZA) {
                return nameA.localeCompare(nameB);
            } else if (sortZA && !sortAZ) {
                return nameB.localeCompare(nameA);
            }
            return 0;
        });
    }, [sortAZ, sortZA]);

    // Fetch Pokémon data
    useEffect(() => {
        const fetchPokemon = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/pokemon`);
                setPokemon(response.data.results);
                setLoading(false);
                setFilteredList(response.data.results);
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch Pokémon');
                setLoading(false);
            }
        };
        fetchPokemon();
    }, []);

    // Filter Pokémon based on search query
    useEffect(() => {
        const filterPokemon = async () => {
        setLoading(true);
        let filtered = pokemonList;
    
        if (selectedType) {
            filtered = typeFilteredList;
        }
    
        if (searchQuery) {
            filtered = filtered.filter(pokemon =>
                pokemon.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }
    
        if (sortAZ || sortZA) {
            filtered = sortPokemons(filtered);
        }
    
        setFilteredList(filtered);
        setCurrentPage(initialPage);
        setLoading(false);
        // if (searchQuery) {
        //     setCurrentPage(1);
        // };
    };
        filterPokemon();
    }, [searchQuery, pokemonList, sortAZ, sortZA, sortPokemons, typeFilteredList, selectedType, initialPage]);

    // Fetch Pokémon types
    useEffect(() => {
        const fetchPokemonTypes = async () => {
            try {
                const resp = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/pokemon/type`);
                setTypes(resp.data); // Expecting an array of types
            } catch (err) {
                setError('Failed to fetch types');
            }
        };
        fetchPokemonTypes();
    }, [type]);

    // Fetch paginated Pokémons
    useEffect(() => {
        const paginatedList = filteredList.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
        const fetchPokeData = async () => {
            const paginatedListWithData = await Promise.all(paginatedList.map(async (pl) => {
                try {
                    const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/pokemon/${pl.name}`);
                    return { ...res.data};
                }
                catch(err) {
                    console.log("Error fetching Pokemon data:", err);
                    return {name: 'undefined'}
                }
            }));
            setPaginatedList(paginatedListWithData);
        }
        fetchPokeData();
    }, [filteredList, currentPage]);

    const filterByType = async (type) => {
        // setSearchQuery('')
        // setLoading(true);
        if (type === 'all') {
            setFilteredList(sortPokemons(pokemonList))
            setTypeFilteredList(pokemonList)
            setSelectedType(null)
            setShowTypeDropdown(false)
            setCurrentPage(1)
            navigate({
                pathname: '/',
                search: ''
            });
            return;
        }
        try {
            const resp = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/pokemon?type=${type}`)
            const pokemonByType = resp.data.pokemon.map(p => ({
                name:   p.pokemon.name,
                url:    p.pokemon.url,
                types:  p.pokemon.types
            }))
            const sortedPokemons = sortPokemons(pokemonByType);
            setFilteredList(sortedPokemons)
            setTypeFilteredList(sortedPokemons)
            setShowTypeDropdown(false)
            setCurrentPage(1)
            setSelectedType(type)
            navigate({
                pathname: '/',
                search: `type=${type}`
            });
        } catch (err) {
            setError(`Failed to fetch pokemon by type`)
        }
    }   

    // Update page if type is changed
    useEffect(() => {
        if (type) {
            filterByType(type);
        }
    }, [type]);

    // Update sorting states
    const handleSortAZ = () => {
        setSortAZ(prev => !prev); // Toggle A-Z sorting
        if (sortZA) setSortZA(false); // Ensure Z-A is off
    };

    const handleSortZA = () => {
        setSortZA(prev => !prev); // Toggle Z-A sorting
        if (sortAZ) setSortAZ(false); // Ensure A-Z is off
    };

    const totalPages = Math.ceil(filteredList.length / itemsPerPage);
    
    const goToNextPage = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    const goToPreviousPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    const isLikedPokemon = (pokemonId) => {
        
        const liked = userLikes.find((l) => Number(l.pokemon_id) === Number(pokemonId))
        return Boolean(liked);
    }

  const unlikePokemon = async (pokemonId, userId) => {

    const likesResponse = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/likes/user/${userId}`);
    const userLikes = likesResponse.data;
    const likeToDelete = userLikes.find(like => like.pokemon_id === pokemonId);
    if (likeToDelete) {
	await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/likes/delete/${likeToDelete.id}`, {
	    headers: {
		'Authorization': `Bearer ${authToken}`
	    },
	});
	const newUserLikes = userLikes.filter((like) => {
	  return (like.pokemon_id !== pokemonId)
      })
      setUserLikes(newUserLikes);
    }
    }

  const likePokemon = async (pokemonId, userId) => {
    try {
        const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/likes/add`,
            { pokemon_id: pokemonId }, 
            { headers:  
                { 'Authorization': `Bearer ${authToken}`,
                 'Content-Type': `application/json`}
            },
        );
        const newUserLikes = [...userLikes, {id: res.data[0].id, user_id: userId, pokemon_id: pokemonId}]
        setUserLikes(newUserLikes);
    }
    catch (err) {
        console.log(`Error while liking pokemon: ${err}`)
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

    return (
        <div>
            <div className="container p-5">
                <div className="row">
                    <div className="col-10">
                        <input
                            type="text"
                            placeholder="Search Pokémon"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="form-control border rounded p-2 mb-4"
                        />
                    </div>
                    <div className="col">
                        {/* Pokémon Types Dropdown */}
                        <button className="button" onClick={() => setShowTypeDropdown(prev => !prev)}>
                            {selectedType ? `Filter by ${selectedType.charAt(0).toUpperCase() + selectedType.slice(1)}` : 'Pokémon Types'}
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
                                        className="dropdown-item"
                                        onClick={() => filterByType(type.name)
                                        }
                                    >
                                        {type.name.charAt(0).toUpperCase() + type.name.slice(1)} {/* Capitalize first letter */}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
                <div className="row">
                    <div className="col-2 form-check">
                            <input
                                type="checkbox"
                                checked={sortAZ}
                                onChange={handleSortAZ}
                                className="form-check-input m-2"
                            />
                        <label className="form-check-label">Sort A-Z</label>
                        </div>
                    <div className="col-2 form-check">
                            <input
                                type="checkbox"
                                checked={sortZA}
                                onChange={handleSortZA}
                                className="form-check-input m-2"
                            />
                        <label className="form-check-label">Sort Z-A</label>
                    </div>
                </div>
            </div>
            <div className="container-xl text-center">
                <ul className="d-flex flex-wrap">
                    { paginatedList.map((p) => (
                        <li className="list-group-item p-3" >
                            <div className="container vstack border border-secondary rounded" >
                                <h3 className="text text-capitalize mt-3 mb-0" style={{"height": "2em", "width": "8em"}}>{p.name}</h3>
                                <Link className="text text-capitalize" 
                                to={`/pokemon/${p.name}`}
                                state={{ currentPage, pokemonList: filteredList }}>
                                    <img src={p.sprites.other['official-artwork'].front_default}
                                        alt={`Picture of ${p.name}`}
                                        width={200}
                                        height={200}
                                    />

                                </Link> 
                                { isLikedPokemon(p.id) ?
                                    <button 
                                        className="btn btn-outline-danger btn-sm mb-3 mt-3"
                                        onClick={() => unlikePokemon(p.id, userId)}>
                                        Unlike</button>
                                    :
                                    <button 
                                        className="btn btn-outline-success btn-sm mb-3 mt-3"
                                        onClick={() => likePokemon(p.id, userId)}>
                                        Like</button>
                                }
                            </div>
                        </li>
                    )) }
                </ul>
            </div>
            <div className="pagination">
                <button className="btn btn-outline-dark" style={{marginRight: '.5%'}} onClick={goToPreviousPage}>Previous</button>
                <span style={{marginTop: '.5%'}}>{`Page ${currentPage} of ${totalPages}`}</span>
                <button className="btn btn-outline-dark" style={{marginLeft: '.5%'}}onClick={goToNextPage}>Next</button>
            </div>
        </div>
    );
};
export default PokemonList;
