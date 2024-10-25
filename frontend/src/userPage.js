import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const UserPage = () => {
  const { userId } = useParams();
  const [likedPokemons, setLikedPokemons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [authToken, setAuthToken] = useState("");
  const [decodedToken, setDecodedToken] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLikes = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/likes/user/${encodeURIComponent(userId)}`,
        );
        const likes = response.data;

        const likedPokemons = await Promise.all(
          likes.map(async (p) => {
            try {
              const res = await axios.get(
                `${process.env.REACT_APP_BACKEND_URL}/pokemon/${p.pokemon_id}`,
              );
              return { ...p, pokemonData: res.data };
            } catch (err) {
              console.log("Error fetching Pokemon data:", err);
              return { ...p, pokemonData: "Unknown" };
            }
          }),
        );
        setLikedPokemons(likedPokemons);
      } catch (err) {
        setError(err.message);
      }
      setLoading(false);
    };
    fetchLikes();
  }, [userId]);

  const validateToken = async (token) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/auth/validate`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (response.status === 200) {
        setAuthToken(token);
        const decodedToken = jwtDecode(token);
        setDecodedToken(decodedToken);
      }
    } catch (error) {
      console.error("Token is invalid or expired:", error);
      localStorage.removeItem("auth_token");
      navigate("/login");
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (token) {
      validateToken(token);
    } else {
      console.error("Invalid token format:", token);
      setAuthToken("");
      setDecodedToken({});
    }
  }, []);

  const unlikePokemon = async (pokemonId, userId) => {
    const likesResponse = await axios.get(
      `${process.env.REACT_APP_BACKEND_URL}/likes/user/${userId}`,
    );
    const userLikes = likesResponse.data;
    const likeToDelete = userLikes.find(
      (like) => like.pokemon_id === pokemonId,
    );
    if (likeToDelete) {
      await axios.delete(
        `${process.env.REACT_APP_BACKEND_URL}/likes/delete/${likeToDelete.id}`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        },
      );
      const newLikedPokemons = likedPokemons.filter((p) => {
        return p.pokemonData.id !== pokemonId;
      });
      setLikedPokemons(newLikedPokemons);
    }
  };

  if (loading) return <h2>Loading...</h2>;
  if (error) return <h2>{error}</h2>;

  return (
    <div className="container text-center" style={{ paddingBottom: "80px" }}>
      <h1>Liked Pokémon</h1>
      {likedPokemons.length === 0 ? (
        <p>Nothing liked yet.</p>
      ) : (
        <ul className="d-flex flex-wrap ">
          {likedPokemons.map(
            (p) =>
              p.pokemonData !== "Unknown" && (
                <li key={p.pokemonData.id} className="list-group-item p-3">
                  <div className="container vstack border border-secondary rounded">
                    <h3
                      className="text text-capitalize my-3"
                      style={{ height: "2em", width: "8em" }}
                    >
                      {p.pokemonData.name}
                    </h3>
                    <Link
                      className="text text-capitalize"
                      to={`/pokemon/${p.pokemonData.name}`}
                    >
                      <img
                        src={
                          p.pokemonData.sprites.other["official-artwork"]
                            .front_default
                        }
                        alt={`${p.pokemonData.name}`}
                        width={200}
                        height={200}
                      />
                    </Link>
                    {Number(decodedToken.id) === Number(userId) && (
                      <button
                        className="btn btn-outline-danger btn-sm mb-3 mt-3"
                        onClick={() => unlikePokemon(p.pokemonData.id, userId)}
                      >
                        Unlike
                      </button>
                    )}
                  </div>
                </li>
              ),
          )}
        </ul>
      )}
    </div>
  );
};

export default UserPage;
