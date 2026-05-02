FROM php:8.2-apache

# Arreglar error de Apache MPM
RUN a2dismod mpm_event || true
RUN a2enmod mpm_prefork || true

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

# Habilitar mod_rewrite para Laravel
RUN a2enmod rewrite

# Configurar carpeta public como raíz de Apache
ENV APACHE_DOCUMENT_ROOT /var/www/html/public
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/*.conf
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/apache2.conf /etc/apache2/conf-available/*.conf

# Copiar proyecto
WORKDIR /var/www/html
COPY . .

# Instalar Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer
RUN composer install --no-dev --optimize-autoloader

# Permisos
RUN chown -R www-data:www-data storage bootstrap/cache

# Puerto 80
EXPOSE 80

# Comando de inicio: migraciones + crear usuario + arrancar Apache
CMD php artisan config:clear && php artisan migrate --force; php artisan tinker --execute="App\Models\User::updateOrCreate(['email' => 'mya'], ['name' => 'Magdiela Admin', 'password' => Hash::make('123'), 'role' => 'admin'])"; apache2-foreground
