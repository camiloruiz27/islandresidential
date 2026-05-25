<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::middleware(['auth', 'verified'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/dashboard', [\App\Http\Controllers\Admin\DashboardController::class, 'index'])->name('dashboard');
    Route::resource('apartments', \App\Http\Controllers\Admin\ApartmentController::class);
});

// Public properties and forms
Route::get('/properties', function () {
    return Inertia::render('Properties/Index', [
        'apartments' => \App\Models\Apartment::where('status', 'available')->get()
    ]);
})->name('properties.index');

Route::get('/forms/rental', function () {
    return Inertia::render('Forms/RentalApplication');
})->name('forms.rental');

Route::get('/privacy-policy', function () {
    return Inertia::render('PrivacyPolicy');
})->name('privacy.policy');

Route::post('/forms/rental', function (\Illuminate\Http\Request $request) {
    // Basic store logic
    $data = $request->validate([
        'applicant_name' => 'required|string|max:255',
        'applicant_email' => 'required|email|max:255',
        'applicant_phone' => 'required|string|max:20',
        'application_data' => 'required|array',
    ]);
    
    $application = \App\Models\RentalApplication::create($data);
    
    // Send email
    \Illuminate\Support\Facades\Mail::to('admin@islandresidential.ca')
        ->send(new \App\Mail\FormSubmittedNotification($data, 'Rental Application'));
    
    return back()->with('success', 'Application submitted successfully.');
})->name('forms.rental.store');

Route::get('/forms/maintenance', function () {
    return Inertia::render('Forms/MaintenanceRequest');
})->name('forms.maintenance');

Route::post('/forms/maintenance', function (\Illuminate\Http\Request $request) {
    $data = $request->validate([
        'tenant_name' => 'required|string|max:255',
        'tenant_email' => 'required|email|max:255',
        'tenant_phone' => 'required|string|max:20',
        'apartment_unit' => 'required|string|max:50',
        'issue_description' => 'required|string',
        'priority' => 'required|string|in:low,medium,high,emergency',
    ]);

    \App\Models\MaintenanceRequest::create($data);
    
    // Send email
    \Illuminate\Support\Facades\Mail::to('admin@islandresidential.ca')
        ->send(new \App\Mail\FormSubmittedNotification($data, 'Maintenance Request'));
    
    return back()->with('success', 'Maintenance request submitted.');
})->name('forms.maintenance.store');

require __DIR__.'/auth.php';
