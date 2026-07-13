<?php

namespace App\Http\Controllers;

use App\Mail\FormSubmittedNotification;
use App\Models\RentalApplication;
use App\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

class RentalApplicationController extends Controller
{
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'applicant_name' => 'required|string|max:255',
            'applicant_email' => 'required|email|max:255',
            'applicant_phone' => 'required|string|max:20',
            'application_data' => 'required|array',
            'application_data.property_id' => [
                'nullable',
                'integer',
                Rule::exists('apartments', 'id')->where(fn ($query) => $query->where('status', 'available')),
            ],
            'application_data.property_title' => 'required|string|max:255',
            'application_data.first_name' => 'required|string|max:255',
            'application_data.last_name' => 'required|string|max:255',
            'application_data.current_address' => 'required|string|max:255',
            'application_data.city' => 'required|string|max:255',
            'application_data.state' => 'required|string|max:255',
            'application_data.date_of_birth' => 'required|date',
            'application_data.occupants_count' => 'required|integer|min:1',
            'application_data.pets' => ['required', Rule::in(['Yes', 'No'])],
            'application_data.pets_count' => 'nullable|integer|min:1',
            'application_data.viewed_property' => ['required', Rule::in(['Yes', 'No'])],
            'application_data.viewing_availability' => 'nullable|string',
            'application_data.rented_before' => ['required', Rule::in(['Yes', 'No'])],
            'application_data.current_rental_address' => 'nullable|string|max:255',
            'application_data.manager_name' => 'nullable|string|max:255',
            'application_data.manager_contact' => 'nullable|string|max:255',
            'application_data.rental_length' => 'nullable|string|max:255',
            'application_data.reason_for_moving' => 'nullable|string|max:500',
            'application_data.previous_rental_address' => 'nullable|string|max:255',
            'application_data.previous_manager_name' => 'nullable|string|max:255',
            'application_data.previous_manager_contact' => 'nullable|string|max:255',
            'application_data.previous_rental_length' => 'nullable|string|max:255',
            'application_data.vehicles' => 'nullable|string|max:255',
            'application_data.employed' => ['required', Rule::in(['Yes', 'No'])],
            'application_data.employer_name' => 'nullable|string|max:255',
            'application_data.income' => 'nullable|string|max:255',
            'application_data.supervisor_name' => 'nullable|string|max:255',
            'application_data.supervisor_contact' => 'nullable|string|max:255',
            'application_data.current_income_source' => 'nullable|string|max:1000',
            'application_data.co_applicants' => 'nullable|array',
            'application_data.why_consider_you' => 'required|string|max:2000',
            'application_data.criminal_offense' => ['required', Rule::in(['Yes', 'No'])],
            'application_data.bankruptcy_or_consumer_proposal' => ['required', Rule::in(['Yes', 'No'])],
            'application_data.terms_agreed' => 'accepted',
            'photo_id' => 'required|file|mimes:jpg,jpeg,png,pdf|max:10240',
            'relevant_files.*' => 'nullable|file|mimes:jpg,jpeg,png,pdf|max:10240',
            'pet_photo' => 'nullable|file|mimes:jpg,jpeg,png|max:10240',
        ]);

        if (app()->environment('production')) {
            $validator->addRules([
                'captcha_token' => 'required|string',
            ]);
        }

        $validator->after(function ($validator) use ($request) {
            $appData = (array) $request->input('application_data', []);

            if (($appData['pets'] ?? null) === 'Yes') {
                if (blank($appData['pets_count'] ?? null)) {
                    $validator->errors()->add('application_data.pets_count', 'The pets count field is required when pets is Yes.');
                }

                if (!$request->hasFile('pet_photo')) {
                    $validator->errors()->add('pet_photo', 'The pet photo field is required when pets is Yes.');
                }
            }

            if (($appData['viewed_property'] ?? null) === 'No' && blank($appData['viewing_availability'] ?? null)) {
                $validator->errors()->add('application_data.viewing_availability', 'Please share your viewing availability.');
            }

            if (($appData['rented_before'] ?? null) === 'Yes') {
                foreach (['current_rental_address', 'manager_name', 'manager_contact', 'rental_length', 'reason_for_moving'] as $field) {
                    if (blank($appData[$field] ?? null)) {
                        $validator->errors()->add("application_data.{$field}", "The {$field} field is required when rented before is Yes.");
                    }
                }
            }

            if (($appData['employed'] ?? null) === 'Yes') {
                foreach (['employer_name', 'income', 'supervisor_name', 'supervisor_contact'] as $field) {
                    if (blank($appData[$field] ?? null)) {
                        $validator->errors()->add("application_data.{$field}", "The {$field} field is required when employed is Yes.");
                    }
                }
            }

            if (($appData['employed'] ?? null) === 'No' && blank($appData['current_income_source'] ?? null)) {
                $validator->errors()->add('application_data.current_income_source', 'The current income source field is required when employed is No.');
            }

            foreach ((array) ($appData['co_applicants'] ?? []) as $index => $coApplicant) {
                foreach (['name', 'last_name', 'email', 'employed'] as $field) {
                    if (blank($coApplicant[$field] ?? null)) {
                        $validator->errors()->add("application_data.co_applicants.{$index}.{$field}", "The co-applicant {$field} field is required.");
                    }
                }

                if (!blank($coApplicant['email'] ?? null) && !filter_var($coApplicant['email'], FILTER_VALIDATE_EMAIL)) {
                    $validator->errors()->add("application_data.co_applicants.{$index}.email", 'The co-applicant email must be a valid email address.');
                }

                if (($coApplicant['employed'] ?? null) === 'Yes') {
                    foreach (['employer_name', 'income', 'supervisor_name', 'supervisor_contact'] as $field) {
                        if (blank($coApplicant[$field] ?? null)) {
                            $validator->errors()->add("application_data.co_applicants.{$index}.{$field}", "The co-applicant {$field} field is required when employed is Yes.");
                        }
                    }
                }

                if (($coApplicant['employed'] ?? null) === 'No' && blank($coApplicant['current_income_source'] ?? null)) {
                    $validator->errors()->add("application_data.co_applicants.{$index}.current_income_source", 'The co-applicant current income source field is required when employed is No.');
                }
            }
        });

        $validated = $validator->validate();

        // Verify reCAPTCHA
        if (app()->environment('production')) {
            $secret = config('services.recaptcha.secret_key');

            if (blank($secret)) {
                throw ValidationException::withMessages([
                    'captcha_token' => 'reCAPTCHA is not configured on the server.',
                ]);
            }

            $response = Http::asForm()->post('https://www.google.com/recaptcha/api/siteverify', [
                'secret' => $secret,
                'response' => $validated['captcha_token'],
                'remoteip' => $request->ip(),
            ]);

            if (!$response->json('success')) {
                return back()->withErrors(['captcha_token' => 'ReCAPTCHA validation failed. Please try again.']);
            }
        }

        $appData = $validated['application_data'];
        $allFiles = []; // Collect all uploaded file paths for admin viewing

        // Store photo ID in private storage (sensitive document)
        if ($request->hasFile('photo_id')) {
            $path = $request->file('photo_id')->store('rental_applications/ids', 'local');
            $appData['photo_id_path'] = $path;
            $allFiles[] = ['type' => 'Photo ID', 'path' => $path, 'disk' => 'local', 'name' => $request->file('photo_id')->getClientOriginalName()];
        }

        // Store Pet Photo if provided
        if ($request->hasFile('pet_photo')) {
            $path = $request->file('pet_photo')->store('rental_applications/pets', 'local');
            $appData['pet_photo_path'] = $path;
            $allFiles[] = ['type' => 'Pet Photo', 'path' => $path, 'disk' => 'local', 'name' => $request->file('pet_photo')->getClientOriginalName()];
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
            'apartment_id'    => $appData['property_id'] ?? null,
            'applicant_name'  => $request->applicant_name,
            'applicant_email' => $request->applicant_email,
            'applicant_phone' => $request->applicant_phone,
            'application_data' => $appData,
            'files'           => $allFiles, // Store metadata for admin download
        ]);

        // Send Email
        $rentalEmails = Setting::getEmailList('rental_email', ['info@islandresidential.ca']);
        Mail::to($rentalEmails)->send(new FormSubmittedNotification($application->toArray(), 'Rental Application'));

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
