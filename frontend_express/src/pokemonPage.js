import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode"

const PokemonPage = () => {
    const { name } = useParams();
    const [pokemon, setPokemon] = useState(null);
    const [error, setError] = useState(null);
    const [liked, setLiked] = useState(false);
    const [likeId, setLikeId] = useState(null); // To store the like ID
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userId, setUserId] = useState(null); // To hold the user ID

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        console.log(token)
        if (token && token.split('.').length === 3) { // Check if it has 3 parts
            setIsLoggedIn(true);
            const decodedToken = jwtDecode(token);
            console.log(decodedToken)
            setUserId(decodedToken.id);
        } else {
            console.error("Invalid token format:", token);
            setIsLoggedIn(false);
        }
    }, []);

    const fetchPokemonPage = useCallback(async () => { 
        
        try {
            const response = await axios.get(`http://localhost:5000/pokemon?name=${encodeURIComponent(name)}`)
//            const data  = await response.json();
            setPokemon(response.data);
            console.log(pokemon)
            setError(null)
        } catch (err) {
            console.error(err);
            setError(err.response ? err.response.data.message : "An unknown error occurred");
        }
    }, [name])

    useEffect(() => {
        fetchPokemonPage();
    }, [fetchPokemonPage])

    useEffect(() => {
        const checkIfLiked = async () => {
            if (isLoggedIn && userId) {
                try {
                    const res = await axios.get(`http://localhost:5000/likes/user/${userId}`);
                    const likedPokemons = res.data.map(like => like.pokemon_id);
                    const likedEntry = res.data.find(like => like.pokemon_id === name);
                    setLiked(likedPokemons.includes(name));
                    if (likedEntry) {
                        setLikeId(likedEntry.id); // Store the like ID
                    }
                } catch (err) {
                    console.error(err);
                }
            }
        };
        checkIfLiked();
    }, [isLoggedIn, userId, name]);

    console.log("Is user logged in:", isLoggedIn);

    const handleLike = async () => {
        if (!isLoggedIn) {
            alert('You must be logged in to like Pokémon');
            return;
        }
        
        try {
            if (liked) {
                // Unlike the Pokémon
                const response = await axios.delete(`http://localhost:5000/likes/delete/${likeId}`); // Use the stored likeId
                console.log(response.data); // Log success message
                setLikeId(null); // Reset the likeId
            } else {
                // Like the Pokémon
                const response = await axios.post(`http://localhost:5000/likes/add`, { pokemon_id: id});
                console.log(response.data); // Log success message
                setLikeId(response.data[0].id); // Store the newly created like ID
            }
            setLiked(!liked); // Toggle liked state
        } catch (err) {
            console.error(err);
            alert(err.response ? err.response.data.error : "An unknown error occurred");
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