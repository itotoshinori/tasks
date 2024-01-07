import React, { useState } from 'react'
import { useTasks } from '../../../queries/TaskQuery'
import TaskItem from './TaskItem'
import { Task } from '../../../types/Task'
import { dateDigi } from '../../../functions/dateSet'
import { toast } from 'react-toastify'
import TaskInput from './TaskInput'

const TaskList = () => {
    const searchParams: any = new URLSearchParams(window.location.search);
    const urlId: number = parseInt(searchParams.get("id"));
    const { data: tasks, status } = useTasks()
    const [condition, setCondition] = useState<boolean>(true)
    const [conditionLink, setConditionLink] = useState<string>("完了済に変更")

    const changeMode = () => {
        if (condition) {
            setCondition(false)
            setConditionLink("仕掛に変更")
            toast.info("昨日までの完了済タスクが表示されました")
        } else {
            setCondition(true)
            setConditionLink("完了済に変更")
            toast.info("仕掛及び本日完了済タスクが表示されました")
        }
        window.scroll({ top: 0, behavior: 'smooth' })
    }
    if (status === 'loading') {
        return <div className="loader" />
    } else if (status === 'error') {
        return (
            <div className="login-page">
                <div className="align-center" style={{ marginTop: '50px' }}>
                    データの読み込みに失敗しました。
                </div>
            </div>
        )
    } else if (!tasks || tasks.length <= 0) {
        return <div className="align-center">データが存在しません</div>
    }
    let tasks_array: Task[];
    // 今日の日付を取得できるnew Dateを格納
    const today: Date = new Date();
    const year: string = String(today.getFullYear());
    const month: string = dateDigi(today.getMonth() + 1);
    const date: string = dateDigi(today.getDate());
    const todayString: string = year + "-" + month + "-" + date
    if (condition) {
        tasks_array = tasks.filter((task) => {
            return String(task.finishday) == todayString || task.finishday === null;
        });
    } else {
        // termでタスクをソート
        const tasks_sort = [...tasks].sort((a, b) => {
            const dateA = new Date(a.term).getTime();
            const dateB = new Date(b.term).getTime();
            return dateB - dateA;
        });
        tasks_array = tasks_sort.filter((task) => {
            return String(task.finishday) != todayString && task.is_done === true;
        });
    }

    return (
        <>
            <TaskInput />
            <div className='change_mode_text' style={{ marginTop: '28px' }} onClick={changeMode}>{conditionLink}</div>
            <div className="inner">
                <ul className="task-list">
                    {tasks_array.map(task => (
                        <TaskItem key={task.id} task={task} />
                    ))}
                </ul>
            </div>
        </>
    )
}

export default TaskList
