<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Apartment;
use App\Models\RentalApplication;
use App\Models\MaintenanceRequest;
use App\Models\Setting;

class DashboardController extends Controller
{
    public function index()
    {
        $stats = [
            'total_apartments'      => Apartment::count(),
            'available_apartments'  => Apartment::where('status', 'available')->count(),
            'pending_applications'  => RentalApplication::where('status', 'pending')->count(),
            'pending_maintenance'   => MaintenanceRequest::where('status', 'pending')->count(),
        ];

        $recentApplications = RentalApplication::latest()->take(5)->get();
        $recentMaintenance  = MaintenanceRequest::latest()->take(5)->get();

        $settings = [
            'maintenance_emails' => Setting::getEmailList('maintenance_email', ['rent@islandresidential.ca']),
            'rental_emails'      => Setting::getEmailList('rental_email', ['info@islandresidential.ca']),
        ];

        return \Inertia\Inertia::render('Admin/Dashboard', [
            'stats'               => $stats,
            'recentApplications'  => $recentApplications,
            'recentMaintenance'   => $recentMaintenance,
            'settings'            => $settings,
            'flash'               => session()->only(['success']),
        ]);
    }
}
