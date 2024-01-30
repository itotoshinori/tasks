import React, { useState, useRef } from 'react'
import { useTasks } from '../../../queries/TaskQuery'
import TaskItem from './TaskItem'
import { Task } from '../../../types/Task'
import { getToday } from '../../../functions/dateSet'
import { toast } from 'react-toastify'
import ModalForm from './ModalForm'
import { ModalNew, ChildHandles } from "./ModalNew";
import SearchForm from './SearchForm'

const TaskList = () => {
    const searchParams: any = new URLSearchParams(window.location.search);
    const urlId: number = parseInt(searchParams.get("id"));
    const { data: tasks, status } = useTasks()
    const [condition, setCondition] = useState<boolean>(true)
    const [conditionLink, setConditionLink] = useState<string>("完了済に変更")
    const [searchTitle, setSearchTitle] = useState<string>("")
    const [compliteCssDis, setCompliteCssDis] = useState<string>("linethrough");
    const childRef = useRef<ChildHandles>(null);

    const search = (title: string): void => {
        setSearchTitle(title)
        setCompliteCssDis("")
    }

    const changeMode = () => {
        if (condition) {
            setCondition(false)
            setCompliteCssDis("")
            setConditionLink("仕掛に変更")
            toast.info("昨日までの完了済タスクが表示されました")
        } else {
            setCondition(true)
            setCompliteCssDis("linethrough")
            setConditionLink("完了済に変更")
            toast.info("仕掛及び本日完了済タスクが表示されました")
        }
        window.scroll({ top: 0, behavior: 'smooth' })
    }
    if (status === 'loading') {
        return (
            <div className="login-page">
                <div className="loader" />
            </div>
        )
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
            !task.body && (task.body = "　")
            return task.title.includes(searchTitle) || task.body.includes(searchTitle);
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

    const openModal = () => {
        childRef.current?.openModalFunc();
    };

    const handleSearchWord = async (newValue: string) => {
        setSearchTitle(newValue)
        newValue ? setCompliteCssDis("") : setCompliteCssDis("linethrough")
    };

    return (
        <>
            <SearchForm handleSearchWord={handleSearchWord} />
            {!searchTitle && (
                <div className='change_mode_text' style={{ marginTop: '10px' }} onClick={changeMode}>{conditionLink}</div>
            )}
            <ModalNew title="" body="" link="" term=""  {...{}} ref={childRef} />
            <button className="searchButton" style={{ marginTop: '10px' }} onClick={openModal}>新規</button>
            <div className="inner">
                {(tasks_array.length == 0 && status === 'success') && (
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
