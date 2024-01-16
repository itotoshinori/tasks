<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Task;
use Carbon\Carbon;
use Exception;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class TaskController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $tasks = Task::orderBy('term')->orderByDESC('created_at')->where('user_id', '=',  Auth::user()->id)->get();
        // created_atとupdated_atを配列として取得
        $formattedTasks = $tasks->map(function ($task) {
            return [
                'id' => $task->id,
                'title' => $task->title,
                'is_done' => $task->is_done,
                'body' => $task->body,
                'term' => $task->term,
                'link' => $task->link,
                'finishday' => $task->finishday,
                'created_at' => $task->created_at->toDateTimeString(),
                'updated_at' => $task->updated_at->toDateTimeString(),
            ];
        });
        return $formattedTasks;
    }


    /**
     * Store a newly created resource in storage.
     *
     * @param  \App\Http\Requests\StoreTaskRequest  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        Log::info($request->all());
        $request->merge(['user_id' => Auth::user()->id]);
        $request->validate([
            'title' => 'required|max:30',
            'user_id' => 'required',
            'term' => 'required',
        ]);
        Log::info($request);
        $task = Task::create($request->all());
        return $task ? response()->json($task) : response()->json([], 500);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Task  $task
     * @return \Illuminate\Http\Response
     */
    public function show(Task $task)
    {
        $task = Task::find($task);
        return response()->json($task);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \App\Http\Requests\UpdateTaskRequest  $request
     * @param  \App\Models\Task  $task
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Task $task)
    {
        $request->validate([
            'title' => 'required|max:30',
        ]);
        Log::info($request);
        #新規登録ができないため入力用の箱を作っておいて新規登録時はそのデータを変更する
        $task_before = Task::find($request->id);
        if ($task_before->title == "入力用") {
            Task::create(['title' => "入力用", 'term' => Carbon::now()->addMonths(6), 'user_id' => Auth::user()->id]);
        }
        return $task->update($request->all())
            ? response()->json($task)
            : response()->json([], 500);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Task  $task
     * @return \Illuminate\Http\Response
     */
    public function destroy(Task $task)
    {
        return $task->delete()
            ? response()->json($task)
            : response()->json([], 500);
    }

    /**
     * is_doneの更新
     *
     * @param  $request
     * @param  \App\Models\Task  $task
     * @return \Illuminate\Http\Response
     */
    public function updatedone(Task $task, Request $request)
    {
        $task->is_done = $request->is_done;
        $task->is_done ? $task->finishday = date('Y-m-d') : $task->finishday = null;
        return $task->update()
            ? response()->json($task)
            : response()->json([], 500);
    }
}
