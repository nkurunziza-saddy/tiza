#!/bin/bash

APP_DIR="$HOME/.local/share/tiza.com"
DB_PATH="$APP_DIR/library.db"

echo "Attempting to create and initialize the database"

mkdir -p "$APP_DIR"

echo "Running database migration..."
sqlite3 "$DB_PATH" ".read migrations/20250731000000_initial.sql"

if [ $? -eq 0 ]; then
    echo "Database initialized successfully!"
    exit 0
else
    echo "Failed to initialize database"
    exit 1
fi