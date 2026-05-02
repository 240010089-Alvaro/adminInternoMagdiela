<?php

require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

\App\Models\Sale::where('payment_method', 'credito')->whereHas('credit', function($q) { 
    $q->where('balance', '>', 0); 
})->update(['status' => 'pendiente']);

echo "Updated successfully\n";
