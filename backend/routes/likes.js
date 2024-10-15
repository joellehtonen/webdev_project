
const express = require('express');
const { Pool } = require('pg');
const jwt = require('jsonwebtoken');
const { pool } = require('../db');

const router = express.Router();


// get all likes from an user
router.get('/userId', async (req, res) => {
	const {userId} = req.params;
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
router.post('/add', async (req, res) => {
	const { userId, pokemonId } = req.body;
	try {
		const decoded = 
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
router.delete('/likes/:usersId', async (req, res) => {
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

module.exports = router;
