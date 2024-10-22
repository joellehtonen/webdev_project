import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from "react-router-dom";

const UserPage = () => {

    const { userId } = useParams();
	const [likedPokemons, setLikedPokemons] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchLikes = async () => {
			try {
				const response = await axios.get(`http://localhost:5000/likes/user/${encodeURIComponent(userId)}`)
				const likes = response.data;

				const likedPokemons = await Promise.all(
					likes.map(async (p) => {
						try {
							const res = await axios.get(`http://localhost:5000/pokemon/${p.pokemon_id}`);
							return { ...p, pokemonData: res.data }
						}
						catch(err) {
							console.log("Error fetching Pokemon data:", err);
							return { ...p, pokemonData: 'Unknown' }
						}
					}));
				setLikedPokemons(likedPokemons);
			}
			catch (err) {
				setError(err.message);
			}
			setLoading(false);
		}
		fetchLikes();
	}, [userId]);

	if (loading) return <h2>Loading...</h2>;
	if (error) return <h2>{error}</h2>;

	return (
		<div className="container text-center">
			<h1>Liked Pokemon</h1>
			{likedPokemons.length === 0 ? (<p>Nothing liked yet.</p>) 
			: (
				<ul className="d-flex flex-wrap">
					{ likedPokemons.map((p) => (
						p.pokemonData !== 'Unknown' &&
						<li className="list-group-item">
							<img src={p.pokemonData.sprites.other['official-artwork'].front_default}
									alt={`Picture of ${p.pokemonData.name}`}
									width={200}
									height={200}
							/>
							<p className="text-capitalize">{p.pokemonData.name}</p>
						</li>
					)) }
				</ul>
			)}
		</div>
	);
}

export default UserPage;
