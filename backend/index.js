const express = require('express');
const cors = require('cors');
const { router: authRoutes, authMiddleware} = require('./routes/auth');
const pokeRoutes = require('./routes/pokemon');
const likesRoutes = require('./routes/likes')
const { pool } = require('./db');
const axios = require('axios');

const app = express();
const port = 5000;

app.use(express.json());
app.use(cors());
app.use('/auth', authRoutes);
app.use('/pokemon', pokeRoutes);
app.use('/likes', likesRoutes);

//added this only for testing without next.js
// app.get('/api/pokemon', async (req, res) => {
//     try {
//         const response = await axios.get('https://pokeapi.co/api/v2/pokemon?limit=151&offset=0');
//         res.json(response.data);
//     } catch (error) {
//         console.error('Error fetching data from PokeAPI:', error);
//         res.status(500).json({ error: 'Failed to fetch data' });
//     }
// });

app.use('/api/pokemon', pokeRoutes);

// get all users
app.get('/users', async (req, res) => {
	try {
		const result = await pool.query(`
			SELECT id, username
			FROM users
			`)
		res.json(result.rows)
	}
	catch (err) {
		console.error(err);
		res.status(500).json({error: "Internal server error"})
	}
})

// get a specific user
app.get('/users/:id', async (req, res) => {
	const {id} = req.params;
	try {
		const result = await pool.query(`SELECT id, username FROM users WHERE id = $1`, [id]);
		if (result.rows.length === 0) {
			return res.status(404).json({error: 'User not found'});
		}
		res.json(result.rows[0]);
	}
	catch (err) {
		console.error(err);
		res.status(500).json({error: "Internal server error"})
	}
})

app.listen(port, () => {
	console.log(`Server running on http://localhost:${port}`)
})
