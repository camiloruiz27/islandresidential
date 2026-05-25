<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MaintenanceRequest extends Model
{
    use HasFactory;

    protected $fillable = [
        'tenant_name', 'tenant_email', 'tenant_phone', 
        'apartment_unit', 'issue_description', 'priority', 'status'
    ];
}
