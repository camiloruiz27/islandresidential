<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class AdminUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run(): void
    {
        \App\Models\User::factory()->create([
            'name' => 'Admin Island Residential',
            'email' => 'admin@islandresidential.ca',
            'password' => \Illuminate\Support\Facades\Hash::make('password123'),
        ]);
    }
}
