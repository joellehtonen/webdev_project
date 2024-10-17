import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const PokemonPage = () => {
    const { name } = useParams();
    const [pokemon, setPokemon] = useState(null);
    const [error, setError] = useState(null);

    const fetchPokemonPage = useCallback(async () => { 
        
        try {
            const response = await axios.get(`http://localhost:5000/pokemon?name=${name}`)
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