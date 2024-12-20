const express = require("express");
const axios = require("axios");
// const NodeCache = require('node-cache');

const router = express.Router();
const POKEAPI_URL = "https://pokeapi.co/api/v2/";

// const cache = new NodeCache();
// const MAX_CACHE_SIZE = 50;

// const manageCacheSize = () => {
// 	const keys = cache.keys();
// 	if (keys.length > MAX_CACHE_SIZE) {
// 		cache.del(keys[0]);
// 	}
// }

const isValidInput = (input) => {
  // Allow letters, numbers, and hyphens in the Pokémon names
  return typeof input === "string" && /^[a-zA-Z0-9-]+$/.test(input);
};

router.get("/type", async (req, res) => {
  try {
    const resp = await axios.get(`${POKEAPI_URL}type`);
    res.json(resp.data.results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch Pokémon types" });
  }
});

router.get("/", async (req, res) => {
  const { name, type } = req.query;
  if (name && !isValidInput(name)) {
    return res.status(400).json({ error: "Invalid input provided" });
  }

  /*	const cachedData = cache.get(name);
	if (cachedData) {
		return res.json(cachedData);
	}*/
  try {
    let response;

    /*if (name && type) {
			const typeResponse = await axios.get(`${POKEAPI_URL}type/${type}`);
			response = typeResponse.data.pokemon.filter(p => p.pokemon.name.includes(name));
			if (response.length === 0)
					return res.status(404).json({message: 'No Pokemon found of that name and type'});
		}
		else */ if (name) {
      //const nameResponse = await axios.get(`${POKEAPI_URL}pokemon/${name}`);
      response = await axios.get(
        `${POKEAPI_URL}pokemon/${encodeURIComponent(name)}`,
      ); //nameResponse.data//.results.filter(p => p.name.includes(name));
    } else if (type) {
      //const typeResponse = await axios.get(`${POKEAPI_URL}type/${encodeURIComponent(type)}`);
      //response = typeResponse.data.pokemon.map(p => p.pokemon);
      response = await axios.get(
        `${POKEAPI_URL}type/${encodeURIComponent(type)}`,
      );
    } else {
      response = await axios.get(`${POKEAPI_URL}pokemon?limit=1305`);
    }
    /*		cache.set(name, response.data);
		manageCacheSize();*/
    res.json(response.data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch Pokemon data" });
  }
});

router.get("/:pokemonId", async (req, res) => {
  const { pokemonId } = req.params;
  // if (pokemonId && !isValidInput(pokemonId)) {
  // 	return res.status(400).json({error: 'Invalid input provided'})
  // }

  /*	const cachedData = cache.get(name);
	if (cachedData) {
		return res.json(cachedData);
	}*/
  try {
    let response;

    /*if (name && type) {
			const typeResponse = await axios.get(`${POKEAPI_URL}type/${type}`);
			response = typeResponse.data.pokemon.filter(p => p.pokemon.name.includes(name));
			if (response.length === 0)
					return res.status(404).json({message: 'No Pokemon found of that name and type'});
		}
		else */ if (pokemonId) {
      //const nameResponse = await axios.get(`${POKEAPI_URL}pokemon/${name}`);
      response = await axios.get(
        `${POKEAPI_URL}pokemon/${encodeURIComponent(pokemonId)}`,
      ); //nameResponse.data//.results.filter(p => p.name.includes(name));
    } else {
      response = await axios.get(`${POKEAPI_URL}pokemon?limit=1305`);
    }
    /*		cache.set(name, response.data);
		manageCacheSize();*/
    res.json(response.data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch Pokemon data" });
  }
});

module.exports = router;
