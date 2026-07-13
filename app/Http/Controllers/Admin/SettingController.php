<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;

class SettingController extends Controller
{
    public function update(Request $request)
    {
        $input = [
            'maintenance_emails' => Setting::normalizeEmailList($request->input('maintenance_emails', [])),
            'rental_emails'      => Setting::normalizeEmailList($request->input('rental_emails', [])),
        ];

        validator($input, [
            'maintenance_emails'   => ['required', 'array', 'min:1', 'max:4'],
            'maintenance_emails.*' => ['required', 'email', 'max:255'],
            'rental_emails'        => ['required', 'array', 'min:1', 'max:4'],
            'rental_emails.*'      => ['required', 'email', 'max:255'],
        ])->validate();

        Setting::setEmailList('maintenance_email', $input['maintenance_emails']);
        Setting::setEmailList('rental_email', $input['rental_emails']);

        return back()->with('success', 'Settings saved successfully.');
    }
}
