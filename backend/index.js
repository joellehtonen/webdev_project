const express = require('express');
const authRoutes = require('./routes/auth');
const { pool } = require('./db');
// const http = require('http');

const app = express();
const port = 3000;

app.use(express.json());
app.use('/', authRoutes);

// get all users
app.get('/users', async (req, res) => {
	try {
		const result = await pool.query(`
			SELECT users.*
			GROUP BY users.id;
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
		const result = await pool.query(`SELECT * FROM users WHERE id = $1`, [id]);
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

// create a new user
app.post('/users', async (req, res) => {
	const {username} = req.body
	try {
		const result = await pool.query(`
			INSERT INTO users (username) VALUE ($1) RETURNING *`, [username]
		)
		res.status(201).json(result.rows[0])
	}
	catch (err) {
		console.log(err);
		res.status(500).json({ error: 'interal server error' });
	}
	res.status(201).json(result.rows[0]);
});

// delete a user
app.delete('/users/:id', async (req, res) => {
	const {id} = req.params;
	try {
		const result = await pool.query(`
			DELETE FROM users WHERE id = $1 RETURNING *`, [id]);
		if (result.rows.length === 0) {
			return res.status(404).json ({error: 'User not found'});
		}
		res.json({message: 'User deleted successfully'})
	}
	catch (err) {
		console.error(err);
		res.status(500).json({error: "Internal server error"})
	}
})

// get all likes from an user
app.get('/users/:usersId/likes', async (req, res) => {
	const {usersId} = req.params;
	try {
		const result = await pool.query(`
			SELECT likes.* FROM likes
			WHERE likes.users_id = $1`, [userId]
		)
		if (result.rows.length === 0) {
			return res.status(404).json({error: 'User not found'});
		}
		res.json(result.rows);
	}
	catch (err) {
		console.error(err);
		res.status(500).json({error: "Internal server error"})
	}
})

// add a like to an user
app.post('/likes/:usersId', async (req, res) => {
	const {userId} = req.params;
	const {pokemonId} = req.body;
	if (!pokemonId)
			return res.status(400).json({error: "pokemonId required"});
	try {
		await pool.query(`
			INSERT INTO likes (user_id, pokemon_id) VALUES ($1, $2)`, [userId, pokemonId]);
	res.status(201).json({message: "Pokemon liked"});
	}
	catch (err) {
		console.error(err);
		res.status(500).json({error: "Internal server error"})
	}
})

// delete a like from an user
app.delete('/likes/:usersId/:likesId', async (req, res) => {
	const {userId, likeId} = req.params;
	try {
		const result = await pool.query (`
			DELETE FROM likes WHERE likes_id = $1`, [likesId])
		res.json(({message: "Like removed"}))
		}
		catch (err) {
			console.error(err);
			res.status(500).json({error: "Internal server error"})
		}
})


app.get()

app.listen(port, () => {
	console.log('Server running on http://localhost:${port}')
})
