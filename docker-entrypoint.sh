#!/bin/bash
set -e

# Restore dependencies if they are missing or if package.json has changed
if [ ! -d "node_modules" ] || [ -z "$(ls -A node_modules)" ]; then
  echo "Installing dependencies..."
  npm install
fi

# Run any necessary database migrations or seeding here

# Run database initialization to ensure tables exist
echo "Running database initialization..."
npm run seed || echo "Warning: Database seed failed, continuing..."


echo "Starting application..."
# Check if command is overridden in docker-compose, otherwise default to dev
if [ "$#" -eq 0 ]; then
  npm run dev
else
  exec "$@"
fi
