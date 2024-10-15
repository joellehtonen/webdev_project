
const express = require('express');
const { Pool } = require('pg');
const jwt = require('jsonwebtoken');
const { pool } = require('../db');
//const authMiddleware = require('./auth')

const router = express.Router();

const authMiddleware = (req, res, next) => {
	const token = req.get('authorization').replace('Bearer ', '');
	if (!token)
		return (res.status(401).json({error: 'Access denied'}));
	try {
		const decoded = jwt.decode(token, "real-secure-key");
		const authorized = jwt.verify(token, "real-secure-key");
		req.user = authorized;
		next();
	}
	catch (err) {
		return (res.status(401).json({error: 'Invalid token'}));
	}
}

// get all likes from an user
router.get('/user/:userId', async (req, res) => {
	const {userId} = req.params;
	try {
		const result = await pool.query(`
			SELECT id, user_id, pokemon_id 
			FROM likes
			WHERE user_id = $1`, [userId]
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
router.post('/add', authMiddleware, async (req, res) => {
	const { pokemon_id } = req.body;
	const userId = req.user.id;
	try {
		const result_check = await pool.query(`
		SELECT id 
		FROM likes 
		WHERE user_id = $1 AND pokemon_id = $2`, [userId, pokemon_id]);
		if (result_check.rows.length !== 0) {
			return res.status(400).json({ error: 'User has already liked this pokemon'})
		}
		const result = await pool.query(`
			INSERT INTO likes (user_id, pokemon_id) VALUES ($1, $2) RETURNING id`, [userId, pokemon_id]);
		res.status(201).json(result.rows);
	}
	catch (err) {
		console.error(err);
		res.status(500).json({error: "Internal server error"})
	}
})

// delete a like from an user
router.delete('/delete/:likeId', authMiddleware, async (req, res) => {
	const { likeId } = req.params;
	try {
		const result = await pool.query(`
			DELETE FROM likes 
			WHERE id = $1`, [likeId])
		res.json(({message: likeId}))
		}
		catch (err) {
			console.error(err);
			res.status(500).json({error: 'Internal server error'})
		}
})

module.exports = router;
