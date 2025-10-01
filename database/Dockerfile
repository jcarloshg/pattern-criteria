# Use the official PostgreSQL image from the Docker Hub
FROM postgres:15.13

ENV POSTGRES_USER=admin
ENV POSTGRES_PASSWORD=123456
ENV POSTGRES_DB=pattern_criteria_db

# Copy the initialization SQL script to the Docker entrypoint directory
COPY ./database/migrations/2025-09-30/create-database.UP.sql /docker-entrypoint-initdb.d/
COPY ./database/migrations/2025-09-30/insert-products.UP.sql /docker-entrypoint-initdb.d/

EXPOSE 5432