<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Client;

class ClientSeeder extends Seeder
{
    public function run(): void
    {
        $clients = [
            ['name'=>'María García López','phone'=>'614-123-4567','email'=>'maria@email.com','address'=>'Col. Centro #123','notes'=>'Clienta frecuente, prefiere vestidos'],
            ['name'=>'Ana Rodríguez','phone'=>'614-234-5678','email'=>'ana@email.com','address'=>'Col. San Felipe #456','notes'=>'Le gustan los colores vivos'],
            ['name'=>'Laura Martínez','phone'=>'614-345-6789','email'=>'laura@email.com','address'=>'Col. Altavista #789','notes'=>'Prefiere tallas M'],
            ['name'=>'Carmen Hernández','phone'=>'614-456-7890','email'=>'carmen@email.com','address'=>'Col. Dale #321','notes'=>'Clienta VIP'],
            ['name'=>'Sofia Torres','phone'=>'614-567-8901','email'=>'sofia@email.com','address'=>'Col. Mirador #654','notes'=>''],
            ['name'=>'Patricia Flores','phone'=>'614-678-9012','email'=>'','address'=>'Col. Jardines #987','notes'=>'Paga siempre a crédito'],
            ['name'=>'Rosa Díaz','phone'=>'614-789-0123','email'=>'rosa@email.com','address'=>'','notes'=>'Le gustan los accesorios'],
            ['name'=>'Elena Morales','phone'=>'614-890-1234','email'=>'','address'=>'Col. Granjas #147','notes'=>''],
            ['name'=>'Diana Ruiz','phone'=>'614-901-2345','email'=>'diana@email.com','address'=>'Col. Industrial #258','notes'=>'Prefiere ropa ejecutiva'],
            ['name'=>'Valentina Sánchez','phone'=>'614-012-3456','email'=>'valentina@email.com','address'=>'Col. Paseos #369','notes'=>'Nueva clienta'],
        ];

        foreach ($clients as $c) {
            Client::create($c);
        }
    }
}
