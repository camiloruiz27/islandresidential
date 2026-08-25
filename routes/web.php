<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Storage;
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
    ]);
});

Route::get('/apartment-images/{path}', function (string $path) {
    abort_if(str_contains($path, '..'), 404);
    abort_unless(Storage::disk('public')->exists($path), 404);

    return Storage::disk('public')->response($path);
})->where('path', '.*')->name('public.apartment-image');

Route::get('/sitemap.xml', function () {
    $baseUrl = rtrim(config('app.url'), '/');
    $urls = collect([
        [
            'loc' => $baseUrl.'/',
            'lastmod' => now()->toAtomString(),
            'changefreq' => 'weekly',
            'priority' => '1.0',
        ],
        [
            'loc' => $baseUrl.'/properties',
            'lastmod' => now()->toAtomString(),
            'changefreq' => 'daily',
            'priority' => '0.9',
        ],
    ]);

    $propertyUrls = \App\Models\Apartment::query()
        ->where('status', 'available')
        ->latest('updated_at')
        ->get(['id', 'updated_at'])
        ->map(fn ($apartment) => [
            'loc' => $baseUrl.'/properties/'.$apartment->id,
            'lastmod' => optional($apartment->updated_at)->toAtomString() ?? now()->toAtomString(),
            'changefreq' => 'weekly',
            'priority' => '0.8',
        ]);

    $xml = view('sitemap', ['urls' => $urls->merge($propertyUrls)])->render();

    return response($xml, 200)->header('Content-Type', 'application/xml');
})->name('sitemap');

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

    // Rental Applications
    Route::get('/applications', [\App\Http\Controllers\Admin\ApplicationController::class, 'index'])->name('applications.index');
    Route::patch('/applications/{application}/status', [\App\Http\Controllers\Admin\ApplicationController::class, 'updateStatus'])->name('applications.status');

    // Maintenance Requests
    Route::get('/maintenance', [\App\Http\Controllers\Admin\MaintenanceController::class, 'index'])->name('maintenance.index');
    Route::patch('/maintenance/{maintenanceRequest}/status', [\App\Http\Controllers\Admin\MaintenanceController::class, 'updateStatus'])->name('maintenance.status');

    // Settings
    Route::post('/settings', [\App\Http\Controllers\Admin\SettingController::class, 'update'])->name('settings.update');
});

// Public properties and forms
Route::get('/properties', function () {
    return Inertia::render('Properties/Index', [
        'apartments' => \App\Models\Apartment::where('status', 'available')->get()->map->resolveImages()
    ]);
})->name('properties.index');

Route::get('/properties/{apartment}', function (\App\Models\Apartment $apartment) {
    abort_if($apartment->status === 'hidden', 404);

    return Inertia::render('Properties/Show', [
        'apartment' => $apartment->resolveImages()
    ]);
})->name('properties.show');

Route::get('/forms/rental', function () {
    return Inertia::render('Forms/RentalApplication');
})->name('forms.rental');

Route::post('/contact', [\App\Http\Controllers\ContactController::class, 'store'])->name('contact.store');

Route::get('/privacy-policy', function () {
    return Inertia::render('PrivacyPolicy');
})->name('privacy.policy');

Route::post('/forms/rental', [\App\Http\Controllers\RentalApplicationController::class, 'store'])->name('forms.rental.store');

Route::get('/forms/maintenance', function () {
    return Inertia::render('Forms/MaintenanceRequest');
})->name('forms.maintenance');

Route::post('/forms/maintenance', [\App\Http\Controllers\MaintenanceRequestController::class, 'store'])->name('forms.maintenance.store');

// Admin secure file downloads (auth protected)
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/admin/files/rental', [\App\Http\Controllers\RentalApplicationController::class, 'downloadFile'])->name('admin.files.rental');
});

require __DIR__.'/auth.php';
