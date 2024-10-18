import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode"

const PokemonPage = () => {
    const { name } = useParams();
    const [pokemon, setPokemon] = useState(null);
    const [error, setError] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userId, setUserId] = useState(null);
    const [liked, setLiked] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('auth_token');
        //console.log(token)
        if (token && token.split('.').length === 3) { // Check if it has 3 parts
            setIsLoggedIn(true);
            const decodedToken = jwtDecode(token);
            setUserId(decodedToken.id);
        } else {
            console.error("Invalid token format:", token);
            setIsLoggedIn(false);
        }
    }, []);

    const fetchPokemonPage = useCallback(async () => { 
        
        try {
            const response = await axios.get(`http://localhost:5000/pokemon?name=${encodeURIComponent(name)}`)
            setPokemon(response.data);
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
    }, [name, isLoggedIn, userId])

    useEffect(() => {
        fetchPokemonPage();
    }, [fetchPokemonPage]) 

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
                    alert(`Unliked Pokémon ID: ${pokemon.id}`);
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
                alert(`Liked Pokémon ID: ${pokemon.id}`);
            }
        } catch (error) {
            console.error('Error handling like/unlike:', error);
            alert('An error occurred while trying to like/unlike the Pokémon.');
        }
    };

    if (error) return <div>Error: {error}</div>;
    if (!pokemon) return <div>Loading...</div>;

    return (
        <div>
            <h1 className="text-4xl font-bold pt-4">
                {name.charAt(0).toUpperCase() + name.slice(1)}
            </h1>
            <img
                src={pokemon.sprites.other['official-artwork'].front_default}
                alt={`Picture of ${pokemon.name}`}
                width={200}
                height={200}
            />
            <h3>Weight : {pokemon.weight}</h3>

            <button onClick={handleLike} className="like-button">
                {liked ? 'Unlike' : 'Like'}
            </button>
            
            <div className="flex-col">
                {pokemon.stats.map((statObject) => {
                    const statName = statObject.stat.name;
                    const statValue = statObject.base_stat;

                    return (
                        <div className="flex items-stretch" style={{ width: "500px" }} key={statName}>
                            <h3 className="p-3 w-2/4">{`${statName}: ${statValue}`}</h3>
                            {/* Simple representation of progress, you can replace this with a better visual if needed */}
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
