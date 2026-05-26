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
            'apartments' => Apartment::latest()->get(),
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
            'images.*' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:10240',
        ]);

        $imageUrls = [];
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $image) {
                $path = $image->store('apartments', 'public');
                $imageUrls[] = Storage::url($path);
            }
        }

        $validated['images'] = $imageUrls;

        Apartment::create($validated);

        return redirect()->route('admin.apartments.index')->with('success', 'Apartment published successfully.');
    }

    public function show(Apartment $apartment)
    {
        return Inertia::render('Admin/Apartments/Show', ['apartment' => $apartment]);
    }

    public function edit(Apartment $apartment)
    {
        return Inertia::render('Admin/Apartments/Edit', [
            'apartment' => $apartment,
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
            'images.*' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:10240',
        ]);

        // Only replace images if new ones were uploaded
        if ($request->hasFile('images')) {
            // Delete old images from storage
            if ($apartment->images) {
                foreach ($apartment->images as $oldUrl) {
                    $path = str_replace('/storage/', '', $oldUrl);
                    Storage::disk('public')->delete($path);
                }
            }
            $imageUrls = [];
            foreach ($request->file('images') as $image) {
                $path = $image->store('apartments', 'public');
                $imageUrls[] = Storage::url($path);
            }
            $validated['images'] = $imageUrls;
        } else {
            unset($validated['images']);
        }

        $apartment->update($validated);

        return redirect()->route('admin.apartments.index')->with('success', 'Apartment updated successfully.');
    }

    public function destroy(Apartment $apartment)
    {
        // Delete images from storage
        if ($apartment->images) {
            foreach ($apartment->images as $oldUrl) {
                $path = str_replace('/storage/', '', $oldUrl);
                Storage::disk('public')->delete($path);
            }
        }
        $apartment->delete();
        return redirect()->route('admin.apartments.index')->with('success', 'Apartment deleted.');
    }
}
