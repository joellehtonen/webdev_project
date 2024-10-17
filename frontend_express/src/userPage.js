import React, { useEffect, useState } from 'react';
import axios from 'axios';

const UserPage = ({userId, userName}) => {

	const [likedPokemons, setLikedPokemons] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchLikes = async () => {
			try {
				const response = await axios.get(`api/users/$1`, [userId])
				const liked = response.data;
				setLikedPokemons(liked);
			}
			catch (err) {
				setError(err.message);
			}
			finally {
				setLoading(false);
			}
		}
		fetchLikes();
	}, [userId]);

	if (loading) return <h2>Loading...</h2>;
	if (error) return <h2>{error}</h2>;

	return (
		<div>
			<h1>{userName}</h1>
			<h1>Liked Pokemon</h1>
			{likedPokemons.length === 0 ? (<p>Nothing liked yet.</p>) 
			: (
				<ul>
					{likedPokemons.map((pokemon) => (
						<li key={pokemon.name}>
							{pokemon.name}
						</li>
					))}
				</ul>
			)}
		</div>
	);
}

export default UserPage;