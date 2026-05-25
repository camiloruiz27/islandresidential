<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RentalApplication extends Model
{
    use HasFactory;

    protected $fillable = [
        'apartment_id', 'applicant_name', 'applicant_email', 
        'applicant_phone', 'application_data', 'status'
    ];

    protected $casts = [
        'application_data' => 'array',
    ];
}
