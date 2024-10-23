/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   auth.js                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mpellegr <mpellegr@student.hive.fi>        +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/10/15 11:31:12 by pleander          #+#    #+#             */
/*   Updated: 2024/10/23 10:54:59 by mpellegr         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

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
	console.log(req.body);
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

router.put(`/updateCredentials`, authMiddleware, async (req, res) => {
	const { currentPassword, newPassword, newUsername } = req.body
	const userId = req.user.id
	try {
		const result = await pool.query(`SELECT id, username, hashed_password FROM users WHERE id = ($1)`, [userId])
		if (result.rows.length === 0) {
			return res.status(404).json({ error: 'User not found' })
		}
		const user = result.rows[0]

		const isPasswordCorrect = await bcrypt.compare(currentPassword, user.hashed_password)
		if (!isPasswordCorrect) {
			return res.status(400).json({ error: 'Current password is incorrect' });
		}

		if (newUsername) {
			const usernameExists = await pool.query(`SELECT username FROM users WHERE username = $1`, [newUsername])
			if (usernameExists.rows.length !== 0) {
				return res.status(400).json({ error: 'Username already taken' });
			}
			await pool.query(`UPDATE users SET username = $1 WHERE id =$2`, [newUsername, userId] )
		}

		if (newPassword) {
			const hashedNewPassword = await bcrypt.hash(newPassword, 10)
			await pool.query(`UPDATE users SET hashed_password = $1 WHERE id = $2`, [hashedNewPassword, userId])
		}

		res.json({ message: 'User credentials updated successfully' })
	} catch (err) {
		console.error(err)
		res.status(500).json({ error: 'Internal server error' });
	}
})

module.exports = { router, authMiddleware };
