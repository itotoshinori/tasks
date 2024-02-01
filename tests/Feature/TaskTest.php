<?php

namespace Tests\Feature;

use App\Models\Task;
use App\Models\User;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

use function PHPUnit\Framework\assertSame;

class TaskTest extends TestCase
{
    use RefreshDatabase;
    private $user;
    public function setUp(): void
    {
        parent::setUP();
        $this->user = User::factory()->create();
        $this->actingAs($this->user);
    }
    /**
     *  @test
     */
    public function 一覧を取得できる()
    {
        $tasks = Task::factory()->count(10)->create();

        $response = $this->getJson('api/tasks');
        $response
            ->assertOk()
            ->assertJsonCount($tasks->count());
    }
    /**
     *  @test
     */
    public function 登録を確認できる()
    {
        $data = ['title' => 'テストデータ', 'user_id' => $this->user->id, 'term' => "2024-01-02"];
        $response = $this->postJson('api/tasks', $data);
        $response
            ->assertOk()
            ->assertJsonFragment($data);
    }
    /**
     *  @test
     */
    public function 更新を確認できる()
    {
        $task = Task::factory()->create();
        $task->title = "更新";
        $data = $task->toArray();
        $response = $this->put("api/tasks/{$task->id}", $data);
        $response
            ->assertOk()
            ->assertJsonFragment($data);
    }
    /**
     *  @test
     */
    public function 削除を確認できる()
    {
        // タスクを10個作成
        $tasks = Task::factory()->count(10)->create();

        // 削除対象のタスクを選択
        $taskToDelete = $tasks->first();

        // 対象のタスクを削除
        $response = $this->deleteJson("api/tasks/{$taskToDelete->id}");
        $response->assertOk();
        // 削除されたタスクが含まれていないことを確認
        $this->assertDatabaseMissing('tasks', ['id' => $taskToDelete->id]);
    }

    /**
     *  @test
     */
    public function タイトルがブランクだったら登録できないを確認できる()
    {
        $data = ['title' => ''];
        $response = $this->postJson('api/tasks', $data);
        $response
            ->assertJsonValidationErrors([
                'title' => 'タイトルは必ず指定してください。'
            ]);
    }
    /**
     *  @test
     */
    public function タイトルが31文字以上だったら登録できないを確認できる()
    {
        $str = bin2hex(openssl_random_pseudo_bytes(31));
        $data = ['title' => $str];
        $response = $this->postJson('api/tasks', $data);
        $response
            ->assertJsonValidationErrors([
                'title' => 'タイトルは、30文字以下で指定してください。'
            ]);
    }
    /**
     *  @test
     */
    public function タイトルがブランクだったら更新できないを確認できる()
    {
        $task = Task::factory()->create();
        $task->title = '';
        $data = $task->toArray();
        $response = $this->put("api/tasks/{$task->id}", $data);
        $response->assertStatus(302);
    }
    /**
     *  @test
     */
    public function タイトルが31文字以上だったら更新できないを確認できる()
    {
        $task = Task::factory()->create();
        $str = bin2hex(openssl_random_pseudo_bytes(31));
        $task->title = $str;
        $data = $task->toArray();
        $response = $this->put("api/tasks/{$task->id}", $data);
        $response->assertStatus(302);
    }
    /**
     *  @test
     */
    public function 完了が更新できることを確認できる()
    {
        $task = Task::factory()->create();
        $task->is_done = true;
        $data = $task->toArray();
        $response = $this->patch("api/tasks/update-done/{$task->id}", $data);
        $response
            ->assertStatus(200)
            ->assertJson(['is_done' => true]);
    }
}
