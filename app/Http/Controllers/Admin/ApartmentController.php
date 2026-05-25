<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Apartment;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ApartmentController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Apartments/Index', [
            'apartments' => Apartment::latest()->get()
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
        ]);

        Apartment::create($validated);

        return redirect()->route('admin.apartments.index')->with('success', 'Apartment created successfully.');
    }

    public function show(Apartment $apartment)
    {
        return Inertia::render('Admin/Apartments/Show', ['apartment' => $apartment]);
    }

    public function edit(Apartment $apartment)
    {
        return Inertia::render('Admin/Apartments/Edit', ['apartment' => $apartment]);
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
        ]);

        $apartment->update($validated);

        return redirect()->route('admin.apartments.index')->with('success', 'Apartment updated successfully.');
    }

    public function destroy(Apartment $apartment)
    {
        $apartment->delete();
        return redirect()->route('admin.apartments.index')->with('success', 'Apartment deleted.');
    }
}
