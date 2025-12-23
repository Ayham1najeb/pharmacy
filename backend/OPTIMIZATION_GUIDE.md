# Laravel Performance Optimization Commands

## After deploying to Render, run these commands to optimize Laravel:

```bash
# Clear all caches first
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear

# Optimize for production
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan optimize

# Run the new indexes migration
php artisan migrate --force
```

## Environment Variables for Production (.env on Render)

Make sure these are set in your Render environment:

```env
APP_ENV=production
APP_DEBUG=false
LOG_LEVEL=error

# Cache Configuration
CACHE_DRIVER=file
SESSION_DRIVER=file
QUEUE_CONNECTION=sync

# Database Query Optimization
DB_SLOW_QUERY_TIME=1000
```

## Note:
These optimizations will significantly improve performance by:
- Caching configuration files
- Caching routes
- Precompiling views
- Adding database indexes for faster queries
