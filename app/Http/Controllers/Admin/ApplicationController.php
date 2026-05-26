<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\RentalApplication;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ApplicationController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Applications/Index', [
            'applications' => RentalApplication::latest()->get(),
            'flash' => session()->only(['success']),
        ]);
    }

    public function updateStatus(Request $request, RentalApplication $application)
    {
        $request->validate([
            'status' => 'required|in:pending,approved,rejected',
        ]);

        $application->update(['status' => $request->status]);

        return back()->with('success', 'Application status updated.');
    }
}
