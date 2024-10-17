#!/bin/bash

SERVER_URL="http://localhost:5000"
RANDOM_LIKES_PER_USER=10;

register_users () {
for USER in $USERS
do
	CMD="curl -H 'Content-Type: application/json' \
	-d '{ \"username\": \"$USER\", \"password\": \"password\" }' \
	-X POST \
	${SERVER_URL}/auth/register"
	eval ${CMD}
done
}

add_likes () {
for USER in $USERS
do
	CMD="curl -s -H 'Content-Type: application/json' \
	-d '{ \"username\": \"$USER\", \"password\": \"password\" }' \
	-X POST \
	${SERVER_URL}/auth/login"
	KEY=$(eval ${CMD} | jq .auth_token | tr -d "\"")

	for ((i=0;i<$RANDOM_LIKES_PER_USER;i++))
	do
		POKEMON_ID=$((1 + $RANDOM % 1300))
		echo "User $USER is liking Pokemon $POKEMON_ID"

		CMD="curl -s -H 'Content-Type: application/json' -H 'authorization: Bearer ${KEY}' \
		-d '{ \"pokemon_id\": \"$POKEMON_ID\" }' \
		-X POST \
		${SERVER_URL}/likes/add"
		eval ${CMD} &> /dev/null
	done
done
}

USERS=$(echo user{1..10})

curl -s $SERVER_URL > /dev/null
if [[ $? == '7' ]]
then
	echo "Cannot connect to server, is the server running?"
	exit 1
fi
register_users 
add_likes

