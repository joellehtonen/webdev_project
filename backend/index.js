const express = require('express');
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
// const http = require('http');
const app = express();
const port = 3000;

const pool = new Pool ({
	user: 'youruser',
	host: 'localhost',
	database: 'pokemon-db',
	password: 'yourpassword',
	port: 5432
})
app.use(express.json());

app.use(express.json());

app.post('/register', async (req, res) => {
	const { username, password } = req.body;
	try {
		const count_result = await pool.query('SELECT username FROM users WHERE username = ($1)', [username]);
		if (count_result.rows.length !== 0) { 
			return res.status(400).json({ error: 'User already exists' })
		}
		const hashedPassword = await bcrypt.hash(password, 10);
		const result = await pool.query('INSERT INTO users (username, hashed_password) VALUES ($1, $2) RETURNING id, username;',
		[username, hashedPassword]);
		res.json(result.rows);
	}
	catch (err) {
		console.error(err);
		res.status(500).json({ error: 'Internal server error' });
	}
})

app.post('/login', async (req, res) => {
	const { username, password } = req.body;
	try {
		const result = await pool.query('SELECT id, username, hashed_password FROM users WHERE username = ($1)', [username]);
		if (result.rows.length === 0) { 
			return res.status(400).json({ error: 'Invalid credentials' })
		}
		if (await bcrypt.compare(password, result.rows[0].hashed_password) === false) {
			return res.status(400).json({ error: 'Invalid credentials' })
		}
		const token = jwt.sign({ id: result.rows[0].id}, 'secret_encryption_key', { expiresIn: '1h' })
		res.json({ auth_token: token });
	}
	catch (err) {
		console.error(err);
		
	}
})

// get all users
app.get('/users', async (req, res) => {
	try {
		const result = await pool.query('SELECT id, username FROM users')
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
app.delete('/likes/:usersId', async (req, res) => {
	try {
		const result = await pool.query (`
			DELETE FROM likes WHERE likesId = $1`, [likesId])
		res.json(({message: "Like removed"}))
		}
		catch (err) {
			console.error(err);
			res.status(500).json({error: "Internal server error"})
		}
})

app.listen(port, () => {
	console.log(`Server running on http://localhost:${port}`)
})
