import React, { useRef, useState } from 'react'
import { Task } from '../../../types/Task'
import { useUpdateDoneTask, useUpdateTask, useDeleteTask } from "../../../queries/TaskQuery"
import { toast } from "react-toastify"
import { formatDate, getWeek, shortDate, getToday } from '../../../functions/dateSet'
import { ModalNew, ChildHandles } from "./ModalNew";

type Props = {
    task: Task
    compliteCss: string
}
const TaskItem: React.VFC<Props> = ({ task, compliteCss }) => {
    const childRef = useRef<ChildHandles>(null);

    const updateDoneTask = useUpdateDoneTask()

    const updateTask = useUpdateTask();

    const deleteTask = useDeleteTask()

    const [editTitle, setEditTitle] = useState<string | undefined>(undefined)

    const [editTerm, setEditTerm] = useState<any>(undefined)

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

    const toBottom = () => {
        const element = document.documentElement;
        const bottom = element.scrollHeight - element.clientHeight;
        window.scroll(0, bottom);
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

    const updateDone = () => {
        updateDoneTask.mutate(task)
        if (task.title.includes('定期')) {
            childRef.current?.openModalFunc();
            toast.info("タイトルに定期が含まれますのでコピー登録用フォームが表示されます。登録不要なら閉じて下さい。")
        }
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
                    <span className={`list-title ${compliteCss}`} style={{ color: todayColor() }}>{task.title}</span>
                    {task.term && (
                        <span style={{ color: todayColor(), whiteSpace: 'nowrap' }}>
                            {shortDate(task.term)}({getWeek(task.term)})
                        </span>
                    )}
                    <span style={{ cursor: "pointer", marginRight: "5px" }} onClick={() => window.scroll({ top: 0, behavior: 'smooth' })}>☝</span>
                    <span style={{ cursor: "pointer", marginRight: "5px" }} onClick={() => toBottom()}>☟</span>
                    <span style={{ cursor: "pointer", marginRight: "5px" }} onClick={() => copyToClipboard()}>📋</span>
                    <a href={`/detail?id=${task.id}`} target="_blank">📖</a>
                </div>
                <ModalNew title={task.title} body={task.body} link={task.link}  {...{}} ref={childRef} />
                <button className="mr-2" onClick={openModal}>Copy</button>
                <button
                    onClick={
                        () => {
                            if (task.title == "入力用") {
                                toast.error("入力用 は削除できません")
                                return
                            }
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
    const openModal = () => {
        childRef.current?.openModalFunc();
    };
    return (
        <li className={task.is_done ? 'done' : ''}>
            <div>
                <li>
                    <label className="checkbox-label">
                        <input type="checkbox" className="checkbox-input" onClick={updateDone} />
                    </label>
                    {editTitle === undefined ? itemText() : itemInput()}
                </li>
            </div>
        </li>
    );
}

export default TaskItem
