#!/bin/bash

echo "Attempting to create and initialize the database"

# Create data directory if it doesn't exist
if [ ! -d "data" ]; then
    mkdir -p data
fi

# Path to the database file
DB_PATH="data/library.db"

# Initialize the database by running the SQL from migrations
echo "Running database migration..."
sqlite3 "$DB_PATH" ".read migrations/20250731000000_initial.sql"

if [ $? -eq 0 ]; then
    echo "Database initialized successfully!"
    exit 0
else
    echo "Failed to initialize database"
    exit 1
fi 