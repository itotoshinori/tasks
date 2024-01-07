<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class TaskFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'title' => $this->faker->realText(rand(15, 40)),
            'is_done' => $this->faker->boolean(10),
            'user_id' => 1,
            'term' => "2024-01-02",
            'created_at' => now(),
            'updated_at' => now()
        ];
    }
}
