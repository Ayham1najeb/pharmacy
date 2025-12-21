#!/bin/bash

# Exit on error
set -e

# Generate app key if not set
if [ -z "$APP_KEY" ]; then
    php artisan key:generate --force
fi

# Clear and cache config
php artisan config:clear
php artisan route:clear
php artisan view:clear

# Run migrations
php artisan migrate --force

# Seed neighborhoods (if not already seeded)
php artisan db:seed --class=NeighborhoodSeeder --force

# Cache for production
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Start the PHP built-in server
php artisan serve --host=0.0.0.0 --port=10000
