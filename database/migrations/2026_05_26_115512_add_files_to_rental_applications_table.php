<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Column was already added by a previous migration (115358), skip if exists
        if (!Schema::hasColumn('rental_applications', 'files')) {
            Schema::table('rental_applications', function (Blueprint $table) {
                $table->json('files')->nullable()->after('application_data');
            });
        }
    }

    public function down(): void
    {
        if (Schema::hasColumn('rental_applications', 'files')) {
            Schema::table('rental_applications', function (Blueprint $table) {
                $table->dropColumn('files');
            });
        }
    }
};
