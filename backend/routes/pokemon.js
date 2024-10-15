const express = require('express');
const axios = require('axios');
const NodeCache = require('node-cache');

const router = express.Router();
const POKEAPI_URL = 'https://pokeapi.co/api/v2/';

const cache = new NodeCache();
const MAX_CACHE_SIZE = 50;

const manageCacheSize = () => {
	const keys = cache.keys();
	if (keys.length > MAX_CACHE_SIZE) {
		cache.del(keys[0]);
	}
}

const isValidInput = (input) => {
	return typeof input === 'string' && /^[a-zA-Z]+$/.test(input);
};

//WORK IN PROGRESS
router.get('/pokemon/:name', async (req, res) => {
	const {name, type} = req.query;
	if (name && !isValidInput(name)) {
		return res.status(400).json({error: 'Invalid input provided'})
	}
	const cachedData = cache.get(name);
	if (cachedData) {
		return res.json(cachedData);
	}
	try {
		let response;

		if (name && type) {

		}
		else if (name) {
			const nameResponse = await axios.get(`${POKEAPI_URL}/pokemon/${name}`);
			response = nameResponse.data;
		}
		else if (type) {
			const typeResponse = await axios.get(`${POKEAPI_URL}/type/${type}`);
			response = typeResponse.data.pokemon.map(p => p.pokemon);
		}
		else {
			return res.status(400).json({error: 'Either name or type required'});
		}
		cache.set(name, response.data);
		manageCacheSize();
		res.json(response.data);
	}
	catch (err) {
		console.error(err);
		res.status(500).json({error: "Failed to fetch Pokemon data"})
	}
});

//THE OLD VERSION
// router.get('/pokemon/:name', async (req, res) => {
// 	const {name} = req.params;
// 	if (!isValidInput(name)) {
// 		return res.status(400).json({error: 'Invalid input provided'})
// 	}
// 	const cachedData = cache.get(name);
// 	if (cachedData) {
// 		return res.json(cachedData);
// 	}
// 	try {
// 		const response = await axios.get(`${POKEAPI_URL}/pokemon/${name}`);
// 		cache.set(name, response.data);
// 		manageCacheSize();
// 		res.json(response.data);
// 	}
// 	catch (err) {
// 		console.error(err);
// 		res.status(500).json({error: "Failed to fetch Pokemon data"})
// 	}
// })

module.exports = router;
