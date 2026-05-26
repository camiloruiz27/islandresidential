<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\MaintenanceRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MaintenanceController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Maintenance/Index', [
            'requests' => MaintenanceRequest::latest()->get(),
            'flash' => session()->only(['success']),
        ]);
    }

    public function updateStatus(Request $request, MaintenanceRequest $maintenanceRequest)
    {
        $request->validate([
            'status' => 'required|in:pending,in_progress,resolved',
        ]);

        $maintenanceRequest->update(['status' => $request->status]);

        return back()->with('success', 'Maintenance request status updated.');
    }
}
