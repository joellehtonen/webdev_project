import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode"
import PokemonList from "./pokemonList";
import './pokemonPage.css';

const PokemonPage = () => {
    const { name } = useParams();
    const [pokemon, setPokemon] = useState(null);
    const [error, setError] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userId, setUserId] = useState(null);
    const [liked, setLiked] = useState(false);
    const [likeMessage, setLikeMessage] = useState('');
    const [unlikeMessage, setUnlikeMessage] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    const [pokemonList, setPokemonList] = useState([]);
    const [currentId, setCurrentId] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('auth_token');
        if (token && token.split('.').length === 3) { // Check if it has 3 parts
            setIsLoggedIn(true);
            const decodedToken = jwtDecode(token);
            setUserId(decodedToken.id);
        } else {
            console.error("Invalid token format:", token);
            setIsLoggedIn(false);
        }
    }, []);

    useEffect(() => {
        const fetchPokemonPage = async () => { 
            try {
                const response = await axios.get(`http://localhost:5000/pokemon?name=${encodeURIComponent(name)}`)
                setPokemon(response.data);
                setCurrentId(response.data.id);
                setPokemonList(location.state?.pokemonList || []);
                setError(null)
                if (isLoggedIn && userId) {
                    const likesResponse = await axios.get(`http://localhost:5000/likes/user/${userId}`);
                    const userLikes = likesResponse.data;
                    const isLiked = userLikes.some(like => like.pokemon_id === response.data.id);
                    setLiked(isLiked);
                }

            } catch (err) {
                console.error(err);
                setError(err.response ? err.response.data.message : "An unknown error occurred");
            }
        }
        fetchPokemonPage()
    }, [name, isLoggedIn, userId])

    const handleLike = async () => {
        if (!isLoggedIn) {
            alert('Please log in to like Pokémon.');
            return;
        }
        try {
            if (liked) {
                // Unlike the Pokémon
                const likesResponse = await axios.get(`http://localhost:5000/likes/user/${userId}`);
                const userLikes = likesResponse.data;
                const likeToDelete = userLikes.find(like => like.pokemon_id === pokemon.id);

                if (likeToDelete) {
                    await axios.delete(`http://localhost:5000/likes/delete/${likeToDelete.id}`, {
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
                        },
                    });
                    setLiked(false);
                    setUnlikeMessage(`Unliked Pokémon : ${pokemon.name}`);
                    setTimeout(() => {
                        setUnlikeMessage('');
                    }, 2000);
                }
            } else {
                // Like the Pokémon
                await axios.post('http://localhost:5000/likes/add', {
                    pokemon_id: pokemon.id
                }, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
                    },
                });
                setLiked(true);
                setLikeMessage(`Liked Pokémon : ${pokemon.name}`);
                setTimeout(() => {
                    setLikeMessage('');
                }, 2000);
            }
        } catch (error) {
            console.error('Error handling like/unlike:', error);
            alert('An error occurred while trying to like/unlike the Pokémon.');
        }
    };

    if (error) return <div>Error: {error}</div>;
    if (!pokemon) return <div>Loading...</div>;

    const { currentPage } = location.state || { currentPage: 1 };

    console.log('list length is ', pokemonList.length);

    const handleNavigation = (direction) => {
        const currentIndex = pokemonList.findIndex(p => p.name === pokemon.name); // Get current index
        let nextIndex = currentIndex;
        if (direction === 'next') {
            nextIndex = (currentIndex + 1) % pokemonList.length;
        } else if (direction === 'prev') {
            nextIndex = (currentIndex - 1 + pokemonList.length) % pokemonList.length;
        }
        const nextPokemonName = pokemonList[nextIndex]?.name;
        if (nextPokemonName) {
            navigate(`/pokemon/${nextPokemonName}`, { state: {currentPage, pokemonList}});
        }
    };

    return (
        <div>
            {/* Back button navigates to the list and maintains the page */}
            <button onClick={() => navigate(`/?page=${currentPage}`, { state: { currentPage } })}>
                Back to Pokémon List
            </button>
            <div>
            <label style={{ marginRight: '5px', marginTop: '5px'}}>
            <button onClick={() => handleNavigation('prev')} disabled={pokemonList.length <= 1}>
                Previous Pokémon
            </button>
            </label>
            <button onClick={() => handleNavigation('next')} disabled={pokemonList.length <= 1}>
                Next Pokémon
            </button>
            </div>
            <h1 className="text-4xl font-bold pt-4">
                {name.charAt(0).toUpperCase() + name.slice(1)}
            </h1>
            <div className="types-container">
                {pokemon.types.map((type) => (
                    <div key={type.type.name} className={`type-${type.type.name}`} data-type={type.type.name}>
                        {type.type.name.charAt(0).toUpperCase() + type.type.name.slice(1)}
                    </div>
                ))}
            </div>
            <img
                src={pokemon.sprites.other['official-artwork'].front_default}
                alt={pokemon.name}
                width={200}
                height={200}
            />
            <h3>Weight : {pokemon.weight}</h3>

            <button onClick={handleLike} className="like-button">
                {liked ? 'Unlike' : 'Like'}
            </button>
            
            {likeMessage && <p style={{ color: 'green' }}>{likeMessage}</p>}
            {unlikeMessage && <p style={{ color: 'red' }}>{unlikeMessage}</p>}

            <div className="flex-col">
                {pokemon.stats.map((statObject) => {
                    const statName = statObject.stat.name;
                    const statValue = statObject.base_stat;

                    return (
                        <div className="flex items-stretch" style={{ width: "250px", marginBottom: "10px" }} key={statName}>
                            <h3 className="p-3 w-2/4" style={{fontSize: '20px', marginBottom: '-10px'}}>{`${statName}: ${statValue}`}</h3>
                            <div style={{ backgroundColor: 'lightgray', width: '100%', height: '20px', borderRadius: '5px' }}>
                                <div style={{ backgroundColor: 'green', width: `${statValue}px`, height: '100%', borderRadius: '5px' }} />
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    )
}

export default PokemonPage
