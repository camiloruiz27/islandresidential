<?php

namespace App\Http\Controllers;

use App\Models\MaintenanceRequest;
use App\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;
use App\Mail\FormSubmittedNotification;

class MaintenanceRequestController extends Controller
{
    public function store(Request $request)
    {
        $rules = [
            'user_type' => 'required|string',
            'tenant_name' => 'required|string|max:255',
            'tenant_email' => 'required|email|max:255',
            'tenant_phone' => 'required|string|max:20',
            'street_address' => 'required|string|max:255',
            'city' => 'required|string|max:100',
            'unit' => 'required|string|max:50',
            'issue_description' => 'required|string',
            'photos.*' => 'required|file|mimes:jpg,jpeg,png,mp4,mov|max:20480', // max 20MB per file
        ];

        if (!app()->environment('local')) {
            $rules['captcha_token'] = 'required|string';
        }

        $request->validate($rules);

        // Verify reCAPTCHA
        if (!app()->environment('local')) {
            $secret = env('RECAPTCHA_SECRET_KEY', '6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe');
            $response = Http::asForm()->post('https://www.google.com/recaptcha/api/siteverify', [
                'secret' => $secret,
                'response' => $request->captcha_token,
                'remoteip' => $request->ip()
            ]);

            if (!$response->json('success')) {
                return back()->withErrors(['captcha_token' => 'ReCAPTCHA validation failed. Please try again.']);
            }
        }

        // Store photos in public disk so admin can view them
        $photosPaths = [];
        if ($request->hasFile('photos')) {
            foreach ($request->file('photos') as $file) {
                $path = $file->store('maintenance_requests/photos', 'public');
                $photosPaths[] = $path;
            }
        }

        $fullDescription = "User Type: " . $request->user_type . "\n" .
                           "Address: " . $request->street_address . ", " . $request->city . "\n\n" .
                           "Issue Description:\n" . $request->issue_description;

        $maintenanceRequest = MaintenanceRequest::create([
            'tenant_name'       => $request->tenant_name,
            'tenant_email'      => $request->tenant_email,
            'tenant_phone'      => $request->tenant_phone,
            'apartment_unit'    => $request->unit,
            'issue_description' => $fullDescription,
            'priority'          => 'medium',
            'photos'            => $photosPaths, // JSON array of public storage paths
        ]);

        // Send Email
        $maintenanceEmail = Setting::get('maintenance_email', 'info@islandresidential.ca');
        Mail::to($maintenanceEmail)->send(new FormSubmittedNotification($maintenanceRequest->toArray(), 'Maintenance Request'));

        return back()->with('success', 'Maintenance request submitted.');
    }

    /**
     * Serve a maintenance photo securely (admin only).
     */
    public function downloadPhoto(string $path)
    {
        $fullPath = storage_path('app/public/' . $path);
        abort_unless(file_exists($fullPath), 404);
        return response()->download($fullPath);
    }
}
