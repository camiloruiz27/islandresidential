<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Apartment extends Model
{
    use HasFactory;

    protected $fillable = [
        'title', 'description', 'location', 'price', 
        'bedrooms', 'bathrooms', 'images', 'status', 'has_parking'
    ];

    protected $casts = [
        'images' => 'array',
        'has_parking' => 'boolean',
    ];
}
