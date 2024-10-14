const express = require('express');
const { Pool } = require('pg');
const http = require('http');
const app = express();
const port = 3000;

const pool = new Pool ({
	user: 'youruser',
	host: 'localhost',
	database: 'pokemon-db',
	password: 'yourpassword',
	port: 5432
})

app.post('/register', async (req, res) => {
	try {

	}
	catch (err) {
		console.error(err);
		
	}
})

app.post('/login', async (req, res) => {
	try {

	}
	catch (err) {
		console.error(err);
		
	}
})

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

// delete a user
app.delete('/users/:id', async (req, res) => {
	const {id} = req.params;
	try {
		const result = await pool.query(`
			DELETE FROM users WHERE id = $1 RETURNING *`, [id]);
		if (result.rows.length === 0) {
			return res.status(404).json ({error: 'User not found'});
		res.json(({message: 'User deleted successfully'}))
		}
	}
})

app.use(express.json());

app.listen(port, () => {
	console.log('Server running on http://localhost:${port}')
})