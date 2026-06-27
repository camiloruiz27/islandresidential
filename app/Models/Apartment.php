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
                $normalized = $this->normalizeImagePath($image);

                if ($normalized === null) {
                    return $image;
                }

                return route('public.apartment-image', ['path' => $normalized]);
            })
            ->values()
            ->all();

        return $this;
    }

    private function normalizeImagePath(string $image): ?string
    {
        $image = trim($image);
        $appUrl = rtrim((string) config('app.url'), '/');

        if ($appUrl !== '' && str_starts_with($image, $appUrl.'/storage/')) {
            return ltrim(substr($image, strlen($appUrl.'/storage/')), '/');
        }

        if (preg_match('/^https?:\/\//i', $image)) {
            return null;
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
