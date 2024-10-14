CREATE TABLE users (
	id SERIAL PRIMARY KEY,
	username VARCHAR(50) NOT NULL UNIQUE,
	hashed_password VARCHAR(255) NOT NULL
);

CREATE TABLE likes (
	id SERIAL PRIMARY KEY,
	user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
	pokemon_id INTEGER NOT NULL
);
