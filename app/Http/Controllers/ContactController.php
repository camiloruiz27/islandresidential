<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use App\Mail\ContactMessage;

class ContactController extends Controller
{
    public function store(Request $request)
    {
        // Basic bot protection if we implement reCAPTCHA
        $rules = [
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'nullable|string|max:50',
            'message' => 'required|string|max:5000',
        ];

        // Ensure captcha validation is only strictly required in production
        if (app()->environment('production') || app()->environment('staging')) {
            $rules['captcha_token'] = ['required', new \App\Rules\Recaptcha];
        }

        $validated = $request->validate($rules);

        // Send email
        Mail::to('rent@islandresidential.ca')->send(new ContactMessage($validated));

        return back()->with('success', 'Your message has been sent successfully. We will get back to you soon!');
    }
}
