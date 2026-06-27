<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class Apartment extends Model
{
    use HasFactory;

    protected $fillable = [
        'title', 'description', 'location', 'price', 
        'bedrooms', 'bathrooms', 'images', 'status', 'has_parking'
    ];

    protected $casts = [
        'images' => 'array',
        'has_parking' => 'boolean',
    ];

    public function resolveImages(): self
    {
        $this->images = collect($this->images ?? [])
            ->filter()
            ->map(function (string $image): string {
                if (preg_match('/^https?:\/\//i', $image) || str_starts_with($image, '/storage/')) {
                    return $image;
                }

                $normalized = ltrim($image, '/');

                if (str_starts_with($normalized, 'storage/')) {
                    return '/'.$normalized;
                }

                return Storage::url($normalized);
            })
            ->values()
            ->all();

        return $this;
    }
}
