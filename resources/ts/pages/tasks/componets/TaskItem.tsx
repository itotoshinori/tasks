import React, { useState } from 'react'
import { Task } from '../../../types/Task'
import { useUpdateDoneTask, useUpdateTask, useDeleteTask } from "../../../queries/TaskQuery"
import { toast } from "react-toastify"
import { formatDate, getWeek, shortDate, getToday } from '../../../functions/dateSet'

type Props = {
    task: Task
}

const TaskItem: React.VFC<Props> = ({ task }) => {
    const updateDoneTask = useUpdateDoneTask()

    const updateTask = useUpdateTask();

    const deleteTask = useDeleteTask()

    const [editTitle, setEditTitle] = useState<string | undefined>(undefined)

    const [editTerm, setEditTerm] = useState<any>(undefined)

    const handleToggleEdit = () => {
        setEditTitle(task.title)
        setEditTerm(task.term)
        toast.info("タイトル編集モードになりました。escで解除。")
    }

    const handleInputTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEditTitle(e.target.value)
    }

    const handleInputTermChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEditTerm(e.target.value)
    }

    const handleUpdate = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        if (!editTitle) {
            toast.error('タイトルを入力してください')
            return
        } else if (!editTerm) {
            toast.error('期限を入力してください')
            return
        }
        const newTask = { ...task }
        newTask.title = editTitle
        newTask.term = editTerm
        console.log(newTask)
        updateTask.mutate({
            id: task.id,
            task: newTask
        });
        setEditTitle(undefined)
    }

    const handleOnKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (['Escape', 'ESC'].includes(e.key)) {
            setEditTitle(undefined)
        }
    }

    const copyToClipboard = async () => {
        await global.navigator.clipboard.writeText(task.title);
        toast.info("タイトルをクリップボードにコピーしました")
    }

    const todayColor = (): string => {
        let textColor: string = ''
        String(task.term) == getToday() ? textColor = 'blue' : textColor = 'black'
        return textColor
    }

    const itemInput = () => {
        return (
            <>
                <form style={{ display: 'flex', alignItems: 'center' }}>
                    <input
                        type="text"
                        className="input"
                        autoFocus
                        defaultValue={task.title}
                        onChange={handleInputTitleChange}
                        onKeyDown={handleOnKey}
                    />
                    <input
                        type="date"
                        className="input"
                        defaultValue={task.term ? formatDate(task.term) : ''}
                        onChange={handleInputTermChange}
                        onKeyDown={handleOnKey}
                    />
                    <button className="btn" onClick={handleUpdate}>更新</button>
                </form>
            </>
        )
    }

    const itemText = () => {
        return (
            <>
                <div>
                    <span onClick={handleToggleEdit} className="list-title linethrough" style={{ color: todayColor() }}>{task.title}</span>
                    {task.term && (
                        <span onClick={handleToggleEdit} style={{ color: todayColor(), whiteSpace: 'nowrap' }}>
                            {shortDate(task.term)}({getWeek(task.term)})
                        </span>
                    )}
                    <span style={{ cursor: "pointer", marginRight: "5px" }} onClick={() => window.scroll({ top: 0, behavior: 'smooth' })}>☝</span>
                    <span style={{ cursor: "pointer", marginRight: "5px" }} onClick={() => copyToClipboard()}>📋</span>
                    <a href={`/detail?id=${task.id}`} target="_blank">📖</a>
                </div>
                <button
                    onClick={
                        () => {
                            if (window.confirm("本当に削除しますか？")) {
                                deleteTask.mutate(task.id)
                            }
                        }
                    }
                >
                    🗑️
                </button>
            </>
        )
    }

    return (
        <li className={task.is_done ? 'done' : ''}>
            <div>
                <li>
                    <label className="checkbox-label">
                        <input type="checkbox" className="checkbox-input" onClick={() => updateDoneTask.mutate(task)} />
                    </label>
                    {editTitle === undefined ? itemText() : itemInput()}
                </li>
            </div>
        </li>
    );
}

export default TaskItem
