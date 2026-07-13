<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Arr;

class Setting extends Model
{
    protected $fillable = ['key', 'value', 'label'];

    /**
     * Get a setting value by key, with optional default.
     */
    public static function get(string $key, $default = null): mixed
    {
        $setting = static::where('key', $key)->first();
        return $setting ? $setting->value : $default;
    }

    /**
     * Set a setting value by key.
     */
    public static function set(string $key, $value): void
    {
        static::updateOrCreate(['key' => $key], ['value' => $value]);
    }

    /**
     * Get a setting as a normalized email list.
     */
    public static function getEmailList(string $key, array $default = []): array
    {
        $value = static::get($key);

        if (blank($value)) {
            return static::normalizeEmailList($default);
        }

        if (is_string($value)) {
            $decoded = json_decode($value, true);

            if (json_last_error() === JSON_ERROR_NONE && is_array($decoded)) {
                return static::normalizeEmailList($decoded);
            }
        }

        return static::normalizeEmailList(Arr::wrap($value));
    }

    /**
     * Store a normalized email list as JSON.
     */
    public static function setEmailList(string $key, array $emails): void
    {
        static::set($key, json_encode(static::normalizeEmailList($emails)));
    }

    /**
     * Normalize an email list for storage and sending.
     */
    public static function normalizeEmailList(array $emails): array
    {
        $normalized = [];

        foreach ($emails as $email) {
            $email = trim((string) $email);

            if ($email === '') {
                continue;
            }

            $key = strtolower($email);

            if (!array_key_exists($key, $normalized)) {
                $normalized[$key] = $email;
            }
        }

        return array_values($normalized);
    }
}
