import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import "./pokemonPage.css";
import "./App.css";

const PokemonPage = () => {
  const { name } = useParams();
  const [pokemon, setPokemon] = useState(null);
  const [error, setError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState(null);
  const [liked, setLiked] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [pokemonList, setPokemonList] = useState([]);
  const { currentPage } = location.state || { currentPage: 1 };

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
        setIsLoggedIn(true);
        const decodedToken = jwtDecode(token);
        setUserId(decodedToken.id);
      }
    } catch (error) {
      console.error("Token is invalid or expired:", error);
      setIsLoggedIn(false);
      localStorage.removeItem("auth_token");
      navigate("/login");
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (token) {
      validateToken(token);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  useEffect(() => {
    const fetchPokemonPage = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/pokemon?name=${encodeURIComponent(name)}`,
        );
        setPokemon(response.data);
        setPokemonList(location.state?.pokemonList || []);
        setError(null);
        if (isLoggedIn && userId) {
          const likesResponse = await axios.get(
            `${process.env.REACT_APP_BACKEND_URL}/likes/user/${userId}`,
          );
          const userLikes = likesResponse.data;
          const isLiked = userLikes.some(
            (like) => like.pokemon_id === response.data.id,
          );
          setLiked(isLiked);
        }
      } catch (err) {
        console.error(err);
        setError(
          err.response
            ? err.response.data.message
            : "An unknown error occurred",
        );
      }
    };
    fetchPokemonPage();
  }, [name, isLoggedIn, userId]);

  const handleLike = async () => {
    if (!isLoggedIn) {
      alert("Please log in to like Pokémon.");
      return;
    }
    try {
      if (liked) {
        // Unlike the Pokémon
        const likesResponse = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/likes/user/${userId}`,
        );
        const userLikes = likesResponse.data;
        const likeToDelete = userLikes.find(
          (like) => like.pokemon_id === pokemon.id,
        );

        if (likeToDelete) {
          await axios.delete(
            `${process.env.REACT_APP_BACKEND_URL}/likes/delete/${likeToDelete.id}`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
              },
            },
          );
          setLiked(false);
          setTimeout(() => {
          }, 2000);
        }
      } else {
        // Like the Pokémon
        await axios.post(
          `${process.env.REACT_APP_BACKEND_URL}/likes/add`,
          {
            pokemon_id: pokemon.id,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
            },
          },
        );
        setLiked(true);
        setTimeout(() => {
        }, 2000);
      }
    } catch (error) {
      console.error("Error handling like/unlike:", error);
      alert("An error occurred while trying to like/unlike the Pokémon.");
    }
  };

  if (error) return <div>Error: {error}</div>;
  if (!pokemon) return <div>Loading...</div>;

  const handleNavigation = (direction) => {
    const currentIndex = pokemonList.findIndex((p) => p.name === pokemon.name); // Get current index
    let nextIndex = currentIndex;
    if (direction === "next") {
      nextIndex = (currentIndex + 1) % pokemonList.length;
    } else if (direction === "prev") {
      nextIndex = (currentIndex - 1 + pokemonList.length) % pokemonList.length;
    }
    const nextPokemonName = pokemonList[nextIndex]?.name;
    if (nextPokemonName) {
      navigate(`/pokemon/${nextPokemonName}`, {
        state: { currentPage, pokemonList },
      });
    }
  };

  const handleTypeClick = (typeName) => {
    navigate(`/?type=${typeName}`);
  };

  const statColors = {
    hp: "#7AC74C",
    attack: "#F7D02C",
    defense: "#EE8130",
    "special-attack": "#96D9D6",
    "special-defense": "#A98FF3",
    speed: "#A33EA1",
  };

  return (
    <div>
      <div className="flex-container">
        <h1 className="text-4xl font-bold pt-4">
          {name.charAt(0).toUpperCase() + name.slice(1)}
        </h1>
        <div className="types-container">
          {pokemon.types.map((type) => (
            <div
              key={type.type.name}
              className={`type-${type.type.name}`}
              data-type={type.type.name}
              onClick={() => handleTypeClick(type.type.name)}
              style={{ cursor: "pointer" }}
            >
              {type.type.name.charAt(0).toUpperCase() + type.type.name.slice(1)}
            </div>
          ))}
        </div>
        <div className="bottom">
          <div className="left-side">
            <img
              src={pokemon.sprites.other["official-artwork"].front_default}
              alt={pokemon.name}
              width={400}
              height={400}
            />
          </div>
          <div className="right-side">
            <h5 style={{ marginTop: "10%" }}>{pokemon.height / 10} m</h5>
            <h5>{pokemon.weight / 10} kg</h5>
            {pokemon.stats.map((statObject) => {
              const statName = statObject.stat.name;
              const statValue = statObject.base_stat;
              const displayStatName =
                {
                  hp: "HP",
                  attack: "Attack",
                  defense: "Defense",
                  "special-attack": "Special Attack",
                  "special-defense": "Special Defense",
                  speed: "Speed",
                }[statName] || statName;
              return (
                <div
                  className="flex items-stretch"
                  style={{ width: "250px", marginBottom: "0px" }}
                  key={statName}
                >
                  <h3
                    className="p-1 w-2/4"
                    style={{
                      fontSize: "20px",
                      fontWeight: "bold",
                      marginBottom: "-0px",
                    }}
                  >
                    {`${displayStatName}: ${statValue}`}
                  </h3>
                  <div
                    style={{
                      backgroundColor: "lightgray",
                      width: "100%",
                      height: "20px",
                      borderRadius: "5px",
                    }}
                  >
                    <div
                      style={{
                        backgroundColor: statColors[statName] || "green",
                        width: `${statValue}px`,
                        height: "100%",
                        borderRadius: "5px",
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        {isLoggedIn && (
          <button
            type="button"
            onClick={handleLike}
            className={
              liked
                ? "btn btn-outline-danger btn-sm mb-3 mt-3"
                : "btn btn-outline-success btn-sm mb-3 mt-3"
            }
            style={{ width: "100px", marginLeft: "0px", marginTop: "20px" }}
          >
            {liked ? "Unlike" : "Like"}
          </button>
        )}
        <div>
          <label style={{ marginRight: "5px", marginTop: "10%" }}>
            <button
              className="button"
              onClick={() => handleNavigation("prev")}
              disabled={pokemonList.length <= 1}
            >
              Previous Pokémon
            </button>
          </label>
          <button
            className="button"
            onClick={() => handleNavigation("next")}
            disabled={pokemonList.length <= 1}
          >
            Next Pokémon
          </button>
        </div>
        <button
          className="button"
          onClick={() =>
            navigate(`/?page=${currentPage}`, {
              state: { currentPage, pokemonList },
            })
          }
          style={{ marginTop: "5px" }}
        >
          Back to Pokémon List
        </button>
      </div>
    </div>
  );
};

export default PokemonPage;
