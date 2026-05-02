<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Client extends Model
{
    use HasFactory;

    protected $fillable = [
        'name', 'phone', 'email', 'address', 'notes',
        'total_purchases', 'total_debt',
    ];

    protected $casts = [
        'total_purchases' => 'decimal:2',
        'total_debt' => 'decimal:2',
    ];

    public function sales()
    {
        return $this->hasMany(Sale::class);
    }

    public function credits()
    {
        return $this->hasMany(Credit::class);
    }
}
