<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Category;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            ['name' => 'Vestidos', 'slug' => 'vestidos', 'description' => 'Vestidos para toda ocasión'],
            ['name' => 'Blusas', 'slug' => 'blusas', 'description' => 'Blusas y tops'],
            ['name' => 'Faldas', 'slug' => 'faldas', 'description' => 'Faldas y enaguas'],
            ['name' => 'Pantalones', 'slug' => 'pantalones', 'description' => 'Pantalones y jeans'],
            ['name' => 'Abrigos', 'slug' => 'abrigos', 'description' => 'Abrigos y chamarras'],
            ['name' => 'Accesorios', 'slug' => 'accesorios', 'description' => 'Bolsos, joyería y accesorios'],
            ['name' => 'Calzado', 'slug' => 'calzado', 'description' => 'Zapatos, tacones y sandalias'],
            ['name' => 'Ropa Interior', 'slug' => 'ropa-interior', 'description' => 'Lencería y ropa interior'],
        ];

        foreach ($categories as $cat) {
            Category::create($cat);
        }
    }
}
