<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Apartment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ApartmentController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Apartments/Index', [
            'apartments' => Apartment::latest()->get()->map->resolveImages(),
            'flash' => session()->only(['success']),
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Apartments/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'location' => 'nullable|string|max:255',
            'price' => 'required|numeric|min:0',
            'bedrooms' => 'required|integer|min:0',
            'bathrooms' => 'required|integer|min:0',
            'status' => 'required|in:available,rented,hidden',
            'has_parking' => 'boolean',
            'images.*' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:10240',
        ]);

        $imageUrls = [];
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $image) {
                $path = $image->store('apartments', 'public');
                $imageUrls[] = $path;
            }
        }

        $validated['images'] = $imageUrls;

        Apartment::create($validated);

        return redirect()->route('admin.apartments.index')->with('success', 'Apartment published successfully.');
    }

    public function show(Apartment $apartment)
    {
        return Inertia::render('Admin/Apartments/Show', ['apartment' => $apartment->resolveImages()]);
    }

    public function edit(Apartment $apartment)
    {
        return Inertia::render('Admin/Apartments/Edit', [
            'apartment' => $apartment->resolveImages(),
        ]);
    }

    public function update(Request $request, Apartment $apartment)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'location' => 'nullable|string|max:255',
            'price' => 'required|numeric|min:0',
            'bedrooms' => 'required|integer|min:0',
            'bathrooms' => 'required|integer|min:0',
            'status' => 'required|in:available,rented,hidden',
            'has_parking' => 'boolean',
            'images_to_keep' => 'nullable|array',
            'images_to_keep.*' => 'string',
            'images.*' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:10240',
        ]);

        $currentImages = $apartment->images ?: [];
        $imagesToKeep = $request->input('images_to_keep', []);

        // Find images that were removed by the admin and delete them from storage
        $imagesToDelete = array_diff($currentImages, $imagesToKeep);
        foreach ($imagesToDelete as $oldUrl) {
            $path = $this->normalizeStoredImagePath($oldUrl);
            Storage::disk('public')->delete($path);
        }

        // Start with the images we are keeping
        $finalImages = $imagesToKeep;

        // Add any newly uploaded images
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $image) {
                $path = $image->store('apartments', 'public');
                $finalImages[] = $path;
            }
        }

        $validated['images'] = $finalImages;
        unset($validated['images_to_keep']);

        $apartment->update($validated);

        return redirect()->route('admin.apartments.index')->with('success', 'Apartment updated successfully.');
    }

    public function destroy(Apartment $apartment)
    {
        // Delete images from storage
        if ($apartment->images) {
            foreach ($apartment->images as $oldUrl) {
                $path = $this->normalizeStoredImagePath($oldUrl);
                Storage::disk('public')->delete($path);
            }
        }
        $apartment->delete();
        return redirect()->route('admin.apartments.index')->with('success', 'Apartment deleted.');
    }

    private function normalizeStoredImagePath(string $image): string
    {
        $image = trim($image);
        $appUrl = rtrim((string) config('app.url'), '/');

        if ($appUrl !== '' && str_starts_with($image, $appUrl.'/storage/')) {
            return ltrim(substr($image, strlen($appUrl.'/storage/')), '/');
        }

        if (str_starts_with($image, '/storage/')) {
            return ltrim(substr($image, strlen('/storage/')), '/');
        }

        if (str_starts_with($image, 'storage/')) {
            return ltrim(substr($image, strlen('storage/')), '/');
        }

        return ltrim($image, '/');
    }
}
