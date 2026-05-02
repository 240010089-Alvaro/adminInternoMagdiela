FROM php:8.2-cli

# Instalar extensiones necesarias
RUN apt-get update && apt-get install -y \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip \
    libzip-dev \
    && docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd zip \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Copiar proyecto
WORKDIR /var/www/html
COPY . .

# Instalar Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer
RUN composer install --no-dev --optimize-autoloader

# Permisos
RUN chown -R www-data:www-data storage bootstrap/cache

EXPOSE 8080

CMD php artisan config:clear; php artisan migrate --force; php artisan tinker --execute="App\Models\User::updateOrCreate(['email' => 'mya'], ['name' => 'Magdiela Admin', 'password' => Hash::make('123'), 'role' => 'admin'])"; php artisan serve --host=0.0.0.0 --port=8080
