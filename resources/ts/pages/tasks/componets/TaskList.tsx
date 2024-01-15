import React, { useState } from 'react'
import { useTasks } from '../../../queries/TaskQuery'
import TaskItem from './TaskItem'
import { Task } from '../../../types/Task'
import { getToday } from '../../../functions/dateSet'
import { toast } from 'react-toastify'
import TaskInput from './TaskInput'
import ModalForm from './ModalForm'
import ModalNewForm from './ModalNewForm'

const TaskList = () => {
    const searchParams: any = new URLSearchParams(window.location.search);
    const urlId: number = parseInt(searchParams.get("id"));
    const { data: tasks, status } = useTasks()
    const [condition, setCondition] = useState<boolean>(true)
    const [conditionLink, setConditionLink] = useState<string>("完了済に変更")
    const [searchTitle, setSearchTitle] = useState<string>("")
    const [compliteCssDis, setCompliteCssDis] = useState<string>("linethrough");

    const search = (title: string, body: string, minTerm: string, maxTerm: string): void => {
        setCompliteCssDis("")
        setSearchTitle(title)
    }

    const changeMode = () => {
        if (condition) {
            setCondition(false)
            setCompliteCssDis("")
            setConditionLink("仕掛に変更")
            toast.info("昨日までの完了済タスクが表示されました")
        } else {
            setConditionLink("完了済に変更")
            setCompliteCssDis("linethrough")
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
        return <div className="align-center" style={{ marginTop: '50px' }}>データが存在しません</div>
    }
    let tasks_array: Task[];
    const tasks_sort = () => {
        const tasksSort = [...tasks].sort((a, b) => {
            const dateA = new Date(a.term).getTime();
            const dateB = new Date(b.term).getTime();
            return dateB - dateA;
        });
        return tasksSort
    }
    if (searchTitle) {
        //検索と完了用に期限降順の配列を用意する
        const tasksSort = tasks_sort()
        tasks_array = tasksSort.filter((task) => {
            return task.title.includes(searchTitle);
        });
    }
    else if (condition) {
        tasks_array = tasks.filter((task) => {
            return String(task.finishday) == getToday() || task.finishday === null;
        });
    } else {
        const tasksSort = tasks_sort()
        tasks_array = tasksSort.filter((task) => {
            return String(task.finishday) != getToday() && task.is_done === true;
        });
    }
    return (
        <>
            <TaskInput />
            {!searchTitle && (
                <div className='change_mode_text' style={{ marginTop: '28px' }} onClick={changeMode}>{conditionLink}</div>
            )}
            <ModalForm handleClickChildSearch={search} />
            <ModalNewForm handleClickChildSearch={search} />
            <div className="inner">
                {tasks_array.length == 0 && (
                    <div>対象はありません</div>
                )}
                <ul className="task-list">
                    {tasks_array.map(task => (
                        <TaskItem key={task.id} task={task} compliteCss={compliteCssDis} />
                    ))}
                </ul>
            </div>
        </>
    )
}

export default TaskList
