<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('users')->insert([
            [
                'name' => 'admin',
                'email' => 'tito40358@gmil.com',
                'email_verified_at' => now(),
                'password' => Hash::make('okuwa3358'),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'test1',
                'email' => 'test1@test.com',
                'email_verified_at' => now(),
                'password' => Hash::make('123456789'),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'test2',
                'email' => 'test2@test.com',
                'email_verified_at' => now(),
                'password' => Hash::make('123456789'),
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
