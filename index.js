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

app.get('/')

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

app.get('/user', async (req, res) => {
	try {
		const result = await pool.query(`
			SELECT users
			`)
	}
	catch (err) {
		console.error(err);
		
	}
})


app.use(express.json());

app.listen(port, () => {
	console.log('Server running on http://localhost:${port}')
})