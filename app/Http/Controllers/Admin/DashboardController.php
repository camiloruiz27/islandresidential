<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index()
    {
        $stats = [
            'total_apartments' => \App\Models\Apartment::count(),
            'available_apartments' => \App\Models\Apartment::where('status', 'available')->count(),
            'pending_applications' => \App\Models\RentalApplication::where('status', 'pending')->count(),
            'pending_maintenance' => \App\Models\MaintenanceRequest::where('status', 'pending')->count(),
        ];

        return \Inertia\Inertia::render('Admin/Dashboard', [
            'stats' => $stats
        ]);
    }
}
