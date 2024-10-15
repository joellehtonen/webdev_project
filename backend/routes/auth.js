// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   auth.js                                            :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: pleander <pleander@student.hive.fi>        +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2024/10/15 11:31:12 by pleander          #+#    #+#             //
//   Updated: 2024/10/15 13:23:13 by pleander         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

const express = require('express');
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { pool } = require('../db');

const router = express.Router();

const JWT_SECRET = "real-secure-key";


const authMiddleware = (req, res, next) => {
	const token = req.get('authorization').replace('Bearer ', '');
	if (!token)
		return (res.status(401).json({error: 'Access denied'}));
	try {
		const decoded = jwt.decode(token, JWT_SECRET);
		const authorized = jwt.verify(token, JWT_SECRET);
		req.user = authorized;
		next();
	}
	catch (err) {
		return (res.status(401).json({error: 'Invalid token'}));
	}
}

router.post('/register', async (req, res) => {
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

router.post('/login', async (req, res) => {
	const { username, password } = req.body;
	try {
		const result = await pool.query('SELECT id, username, hashed_password FROM users WHERE username = ($1)', [username]);
		if (result.rows.length === 0) { 
			return res.status(400).json({ error: 'Invalid credentials' })
		}
		if (await bcrypt.compare(password, result.rows[0].hashed_password) === false) {
			return res.status(400).json({ error: 'Invalid credentials' })
		}
		const token = jwt.sign({ id: result.rows[0].id}, JWT_SECRET, { expiresIn: '1h' })
		res.json({ auth_token: token });
	}
	catch (err) {
		console.error(err);
		res.status(500).json({ error: 'Internal server error' });
	}
})

module.exports = router;
exports.authMiddleware = authMiddleware;
