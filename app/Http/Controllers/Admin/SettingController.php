<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;

class SettingController extends Controller
{
    public function update(Request $request)
    {
        $request->validate([
            'maintenance_email' => 'required|email|max:255',
            'rental_email'      => 'required|email|max:255',
        ]);

        Setting::set('maintenance_email', $request->maintenance_email);
        Setting::set('rental_email',      $request->rental_email);

        return back()->with('success', 'Settings saved successfully.');
    }
}
