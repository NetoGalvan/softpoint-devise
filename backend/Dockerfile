FROM php:8.3-fpm-alpine

WORKDIR /var/www

# Instalar dependencias del sistema
RUN apk add --no-cache \
    postgresql-dev \
    postgresql-client \
    zip \
    unzip \
    git \
    curl \
    libpng-dev \
    libzip-dev \
    oniguruma-dev

# Instalar extensiones PHP
RUN docker-php-ext-install \
    pdo_pgsql \
    pgsql \
    mbstring \
    zip \
    exif \
    pcntl \
    bcmath

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Copy composer files first (for layer caching)
COPY composer.json composer.lock ./

# Install PHP dependencies
RUN composer install --no-scripts --no-autoloader

# Copy application code
COPY . .

# Copy .env file explicitly (important for development)
COPY .env .env

# Generate autoload files
RUN composer dump-autoload --optimize

# Set permissions
RUN chown -R www-data:www-data /var/www/storage /var/www/bootstrap/cache

# Expose port
EXPOSE 8000

CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8000"]






