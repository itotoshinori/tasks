import React, { useRef, useState } from 'react'
import { Task } from '../../../types/Task'
import { useUpdateDoneTask, useUpdateTask, useDeleteTask } from "../../../queries/TaskQuery"
import { toast } from "react-toastify"
import { formatDate, getWeek, shortDate, getToday } from '../../../functions/dateSet'
import { ModalNew, ChildHandles } from "./ModalNew";

type Props = {
    task: Task
    compliteCss: string
    handleSearchWord: any
}
const TaskItemBox: React.VFC<Props> = ({ task, compliteCss, handleSearchWord }) => {
    const childRef = useRef<ChildHandles>(null);
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
        }
        if (editTitle.length >= 30) {
            toast.error('タイトルは30文字未満でお願いします')
            return
        }
        if (!editTerm) {
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
        if (task.title.includes('定期') && !task.is_done) {
            childRef.current?.openModalFunc()
            toast.info("タイトルに定期が含まれますのでコピー登録用フォームが表示されます。登録不要なら閉じて下さい。")
        }
    }

    const updateImportant = () => {
        if (task.title.length >= 30) {
            toast.error('タイトルは30文字未満でお願いします')
            return
        }
        task.title.includes("🔥") ? task.title = task.title.replace("🔥", "") : task.title = "🔥" + task.title
        updateTask.mutate({
            id: task.id,
            task: task
        });
    }

    const searchTitle = (value: string) => {
        handleSearchWord(value)
    }

    const itemInput = () => {
        return (
            <>
                <form style={{ alignItems: 'center' }}>

                    <input
                        type="text"
                        className="input_short"
                        autoFocus
                        defaultValue={task.title}
                        onChange={handleInputTitleChange}
                        onKeyDown={handleOnKey}
                    />
                    <input
                        type="date"
                        className="input_short"
                        style={{ marginTop: '20px' }}
                        defaultValue={task.term ? formatDate(task.term) : ''}
                        onChange={handleInputTermChange}
                        onKeyDown={handleOnKey}
                    />
                    <p>
                        <button
                            style={{ height: "25px", width: "50px", fontSize: "12px", marginRight: "5px" }}
                            onClick={handleUpdate}>
                            更新
                        </button>
                        <button
                            style={{ height: "25px", width: "50px", fontSize: "12px" }}
                            onClick={() => setEditTitle(undefined)}>
                            Close
                        </button>
                    </p>
                </form>
            </>
        )
    }

    const itemText = () => {
        let is_done: boolean;
        task.is_done ? is_done = true : is_done = false;
        return (
            <>
                <div className="menu-title">
                    <input
                        type="checkbox"
                        checked={is_done}
                        onChange={() => updateDone()}
                    />
                    <a
                        style={{ marginRight: "5px", textDecoration: "none" }}
                        href={`/detail?id=${task.id}`} target="_blank">
                        <span style={{ color: todayColor() }}>{task.title}</span>
                    </a>
                </div>
                <div className="menu-text">
                    期限:{shortDate(task.term)}({getWeek(task.term)})
                </div>
                <div className="menu-text">
                    完了:
                    {task.finishday ? `${shortDate(task.finishday)}(${getWeek(task.finishday)})` : "未完了"}
                </div>
                <ModalNew title={task.title} body={task.body} link={task.link} term={task.term}  {...{}} ref={childRef} />
                <div className="menu-text">
                    <span
                        onClick={handleToggleEdit}
                        style={{ cursor: "pointer", marginRight: "3px" }}
                    >
                        ✎</span>
                    <span
                        className="balloonoya"
                        style={{ cursor: "pointer", marginRight: "3px" }}
                        onClick={() => searchTitle(task.title)}>🔎
                        <span className="balloon" style={{ fontSize: "10px" }}>タイトルで検索</span>
                    </span>
                    <span
                        className="balloonoya"
                        style={{ cursor: "pointer", marginRight: "3px" }}
                        onClick={() => updateImportant()}>🔥
                        <span className="balloon" style={{ fontSize: "10px" }}>
                            {task.title.includes("🔥") ? "重要マークを除去" : "重要マークを付ける"}
                        </span>
                    </span>
                    <span
                        className="balloonoya"
                        style={{ cursor: "pointer", marginRight: "3px" }}
                        onClick={() => copyToClipboard()}>📋
                        <span className="balloon" style={{ fontSize: "10px" }}>タイトルをコピー</span>
                    </span>
                    <ModalNew title={task.title} body={task.body} link={task.link} term={task.term}  {...{}} ref={childRef} />
                    <button
                        onClick={openModal}
                        style={{ height: "25px", width: "30px" }}
                        className="ml-1">
                        <span className="balloonoya">
                            ☸
                            <span className="balloon" style={{ fontSize: "10px" }}>データコピー新規</span>
                        </span>
                    </button>
                    <button
                        style={{ height: "25px", width: "30px", fontSize: "12px" }}
                        className="ml-2"
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
                </div>
            </>
        )
    }
    const openModal = () => {
        childRef.current?.openModalFunc();
    };

    const backGroundColor = (done: boolean) => {
        if (done) {
            return "#faf5a6"
        } else if (task.title.includes("🔥")) {
            return "#A9E688"
        } else if (String(task.term) == getToday()) {
            return "#c1fff3"
        }
    }
    return (
        <>
            <div
                className="menu-card-inner"
                style={{ backgroundColor: backGroundColor(task.is_done) }}
            >
                {editTitle === undefined ? itemText() : itemInput()}
            </div >
        </>
    );
}

export default TaskItemBox
