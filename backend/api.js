import express from 'express';
import axios from 'axios';

const router = express.Router();
const POKEAPI_URL = 'https://pokeapi.co/api/v2/';

const isValidInput = (input) => {
	return typeof input === 'string' && /^[a-zA-Z]+$/.test(input);
};

router.get('/pokemon/:name', async (req, res) => {
	const {name} = req.params;
	if (!isValidInput(name)) {
		return res.status(400).json({error: 'Invalid input provided'})
	}
	try {
		const response = await axios.get(`${POKEAPI_URL}/pokemon/${name}`);
		res.json(response.data);
	}
	catch (err) {
		console.error(err);
		res.status(500).json({error: "Failed to fetch Pokemon data"})
	}
})

router.get('/type/:type', async (req, res) => {
	const {type} = req.params;
	if (!isValidInput(type)) {
		return res.status(400).json({error: 'Invalid input provided'})
	}
	try {
		const response = await axios.get(`${POKEAPI_URL}/type/${type}`);
		res.json(response.data);
	}
	catch (err) {
		console.error(err);
		res.status(500).json({error: "Failed to fetch Pokemon data"})
	}
})

export default router;