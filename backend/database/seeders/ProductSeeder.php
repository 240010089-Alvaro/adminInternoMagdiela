<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Product;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $products = [
            ['category_id'=>1,'name'=>'Vestido Floral Primavera','sku'=>'VES-001','price'=>899,'cost'=>450,'sizes'=>['S','M','L'],'colors'=>['Rosa','Blanco'],'stock'=>12,'min_stock'=>3],
            ['category_id'=>1,'name'=>'Vestido Negro Elegante','sku'=>'VES-002','price'=>1299,'cost'=>650,'sizes'=>['S','M','L','XL'],'colors'=>['Negro'],'stock'=>8,'min_stock'=>2],
            ['category_id'=>1,'name'=>'Vestido Casual Azul','sku'=>'VES-003','price'=>699,'cost'=>350,'sizes'=>['M','L'],'colors'=>['Azul','Celeste'],'stock'=>15,'min_stock'=>3],
            ['category_id'=>2,'name'=>'Blusa de Seda Dorada','sku'=>'BLU-001','price'=>599,'cost'=>280,'sizes'=>['S','M','L'],'colors'=>['Dorado','Beige'],'stock'=>20,'min_stock'=>5],
            ['category_id'=>2,'name'=>'Top Crop Estampado','sku'=>'BLU-002','price'=>349,'cost'=>170,'sizes'=>['S','M'],'colors'=>['Multicolor'],'stock'=>25,'min_stock'=>5],
            ['category_id'=>3,'name'=>'Falda Plisada Midi','sku'=>'FAL-001','price'=>549,'cost'=>260,'sizes'=>['S','M','L'],'colors'=>['Negro','Vino'],'stock'=>10,'min_stock'=>3],
            ['category_id'=>3,'name'=>'Falda Lápiz Ejecutiva','sku'=>'FAL-002','price'=>649,'cost'=>320,'sizes'=>['M','L','XL'],'colors'=>['Negro','Gris'],'stock'=>7,'min_stock'=>2],
            ['category_id'=>4,'name'=>'Jeans Skinny Premium','sku'=>'PAN-001','price'=>799,'cost'=>380,'sizes'=>['26','28','30','32'],'colors'=>['Azul','Negro'],'stock'=>18,'min_stock'=>5],
            ['category_id'=>4,'name'=>'Pantalón Palazzo','sku'=>'PAN-002','price'=>699,'cost'=>340,'sizes'=>['S','M','L'],'colors'=>['Beige','Negro'],'stock'=>14,'min_stock'=>3],
            ['category_id'=>5,'name'=>'Chamarra de Piel','sku'=>'ABR-001','price'=>2499,'cost'=>1200,'sizes'=>['S','M','L'],'colors'=>['Negro','Café'],'stock'=>5,'min_stock'=>2],
            ['category_id'=>5,'name'=>'Abrigo Largo Elegante','sku'=>'ABR-002','price'=>1899,'cost'=>900,'sizes'=>['M','L'],'colors'=>['Camel','Gris'],'stock'=>4,'min_stock'=>2],
            ['category_id'=>6,'name'=>'Bolso Tote Premium','sku'=>'ACC-001','price'=>1199,'cost'=>550,'sizes'=>['Único'],'colors'=>['Negro','Rosa'],'stock'=>10,'min_stock'=>3],
            ['category_id'=>6,'name'=>'Collar Cristal Swarovski','sku'=>'ACC-002','price'=>499,'cost'=>200,'sizes'=>['Único'],'colors'=>['Plata','Oro'],'stock'=>15,'min_stock'=>5],
            ['category_id'=>6,'name'=>'Aretes Perla Natural','sku'=>'ACC-003','price'=>399,'cost'=>150,'sizes'=>['Único'],'colors'=>['Blanco'],'stock'=>20,'min_stock'=>5],
            ['category_id'=>7,'name'=>'Tacones Stiletto Rojo','sku'=>'CAL-001','price'=>1099,'cost'=>520,'sizes'=>['35','36','37','38'],'colors'=>['Rojo','Negro'],'stock'=>8,'min_stock'=>2],
            ['category_id'=>7,'name'=>'Sandalias Plataforma','sku'=>'CAL-002','price'=>799,'cost'=>380,'sizes'=>['36','37','38'],'colors'=>['Dorado','Negro'],'stock'=>12,'min_stock'=>3],
            ['category_id'=>8,'name'=>'Set Lencería Encaje','sku'=>'RIN-001','price'=>599,'cost'=>250,'sizes'=>['S','M','L'],'colors'=>['Negro','Rosa'],'stock'=>15,'min_stock'=>5],
            ['category_id'=>8,'name'=>'Pijama Seda Premium','sku'=>'RIN-002','price'=>899,'cost'=>420,'sizes'=>['S','M','L'],'colors'=>['Rosa','Vino'],'stock'=>10,'min_stock'=>3],
        ];

        foreach ($products as $p) {
            Product::create(array_merge($p, ['status' => $p['stock'] > 0 ? 'disponible' : 'agotado']));
        }
    }
}
