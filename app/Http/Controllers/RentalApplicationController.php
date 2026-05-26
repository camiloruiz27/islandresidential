<?php

namespace App\Http\Controllers;

use App\Models\RentalApplication;
use App\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;
use App\Mail\FormSubmittedNotification;

class RentalApplicationController extends Controller
{
    public function store(Request $request)
    {
        $rules = [
            'applicant_name' => 'required|string|max:255',
            'applicant_email' => 'required|email|max:255',
            'applicant_phone' => 'required|string|max:20',
            'application_data' => 'required|array',
            'photo_id' => 'required|file|mimes:jpg,jpeg,png,pdf|max:10240',
            'relevant_files.*' => 'nullable|file|mimes:jpg,jpeg,png,pdf|max:10240',
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

        $appData = $request->application_data;
        $allFiles = []; // Collect all uploaded file paths for admin viewing

        // Store photo ID in private storage (sensitive document)
        if ($request->hasFile('photo_id')) {
            $path = $request->file('photo_id')->store('rental_applications/ids', 'local');
            $appData['photo_id_path'] = $path;
            $allFiles[] = ['type' => 'Photo ID', 'path' => $path, 'disk' => 'local', 'name' => $request->file('photo_id')->getClientOriginalName()];
        }

        // Store relevant files in private storage (sensitive documents)
        if ($request->hasFile('relevant_files')) {
            foreach ($request->file('relevant_files') as $file) {
                $path = $file->store('rental_applications/relevant_files', 'local');
                $appData['relevant_files_paths'][] = $path;
                $allFiles[] = ['type' => 'Document', 'path' => $path, 'disk' => 'local', 'name' => $file->getClientOriginalName()];
            }
        }

        // Create Application
        $application = RentalApplication::create([
            'applicant_name'  => $request->applicant_name,
            'applicant_email' => $request->applicant_email,
            'applicant_phone' => $request->applicant_phone,
            'application_data' => $appData,
            'files'           => $allFiles, // Store metadata for admin download
        ]);

        // Send Email
        $rentalEmail = Setting::get('rental_email', 'info@islandresidential.ca');
        Mail::to($rentalEmail)->send(new FormSubmittedNotification($application->toArray(), 'Rental Application'));

        return back()->with('success', 'Application submitted successfully.');
    }

    /**
     * Secure download of a rental application file (admin only).
     */
    public function downloadFile(Request $request)
    {
        $path = $request->query('path');
        abort_if(empty($path), 400);
        abort_unless(Storage::disk('local')->exists($path), 404);
        return Storage::disk('local')->download($path);
    }
}
