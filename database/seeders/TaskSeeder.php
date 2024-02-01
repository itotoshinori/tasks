<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Task;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class TaskSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $params = [];

        for ($i = 1; $i <= 3; $i++) {
            $params[] = [
                'title' => "テストデータ",
                'term' => Carbon::now(),
                'user_id' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }

        Task::insert($params);
    }
}
