FROM postgres:latest

ENV POSTGRES_DB=pokemon-db
ENV POSTGRES_USER=youruser
ENV POSTGRES_PASSWORD=yourpassword

COPY init.sql /docker-entrypoint-initdb.d/