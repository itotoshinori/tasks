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

        for ($i = 1; $i <= 20; $i++) {
            $params[] = [
                'title' => "入力用",
                'term' => Carbon::now()->addMonths(3),
                'user_id' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }

        Task::insert($params);
    }
}
