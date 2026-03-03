import React, { useRef, useState } from 'react'
import { Task } from '../../../types/Task'
import { useUpdateDoneTask, useUpdateTask, useDeleteTask } from "../../../queries/TaskQuery"
import { toast } from "react-toastify"
import { formatDate, getWeek, shortDate, getToday } from '../../../functions/DateSet'
import { ModalNew, ChildHandles } from "./ModalNew";

type Props = {
    task: Task
    compliteCss: string
    handleSearchWord: any
}
const TaskItem: React.VFC<Props> = ({ task, compliteCss, handleSearchWord }) => {
    const childRef = useRef<ChildHandles>(null);
    const updateDoneTask = useUpdateDoneTask()
    const updateTask = useUpdateTask();
    const deleteTask = useDeleteTask()
    const [editTitle, setEditTitle] = useState<string | undefined>(undefined)
    const [editLink, setEditLink] = useState<string | undefined>(undefined)
    const [editTerm, setEditTerm] = useState<any>(undefined)

    const handleToggleEdit = () => {
        setEditTitle(task.title)
        setEditLink(task.link)
        setEditTerm(task.term)
        toast.info("タイトル編集モードになりました。escで解除。")
    }

    const handleInputTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEditTitle(e.target.value)
    }

    const handleInputLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEditLink(e.target.value)
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
                <form style={{ display: 'flex', alignItems: 'center' }}>
                    <input
                        type="text"
                        className="input_short"
                        autoFocus
                        defaultValue={task.title}
                        onChange={handleInputTitleChange}
                        onKeyDown={handleOnKey}
                    /><br />
                    <input
                        type="text"
                        className="input_short"
                        defaultValue={task.link}
                        onChange={handleInputLinkChange}
                        onKeyDown={handleOnKey}
                    /><br />
                    <input
                        type="date"
                        className="input"
                        defaultValue={task.term ? formatDate(task.term) : ''}
                        onChange={handleInputTermChange}
                        onKeyDown={handleOnKey}
                    />
                    <button className="btn" onClick={handleUpdate}>更新111</button>
                </form>
            </>
        )
    }

    const itemText = () => {
        return (
            <>
                <div>
                    <span onClick={handleToggleEdit} className={`list-title ${compliteCss}`} style={{ color: todayColor() }}>{task.title}</span>
                    {task.term && (
                        <span onClick={handleToggleEdit} style={{ color: todayColor(), whiteSpace: 'nowrap' }}>
                            {shortDate(task.term)}({getWeek(task.term)})
                        </span>
                    )}
                    <span
                        className="balloonoya"
                        style={{ cursor: "pointer", marginRight: "5px" }}
                        onClick={() => window.scroll({ top: 0, behavior: 'smooth' })}
                    >☝
                        <span className="balloon">ページのトップへ</span>
                    </span>
                    <span
                        className="balloonoya"
                        style={{ cursor: "pointer", marginRight: "5px" }}
                        onClick={() => updateImportant()}>🔥
                        <span className="balloon">
                            {task.title.includes("🔥") ? "重要マークを除去" : "重要マークを付ける"}
                        </span>
                    </span>
                    <span
                        className="balloonoya"
                        style={{ cursor: "pointer", marginRight: "5px" }}
                        onClick={() => copyToClipboard()}>📋
                        <span className="balloon">タイトルをコピー</span>
                    </span>
                    <span
                        className="balloonoya"
                        style={{ cursor: "pointer", marginRight: "5px" }}
                        onClick={() => searchTitle(task.title)}>🔎
                        <span className="balloon">タイトルで検索</span>
                    </span>
                    <a
                        className="balloonoya"
                        style={{ marginRight: "5px", textDecoration: "none" }}
                        href={`/detail?id=${task.id}`} target="_blank">📖
                        <span className="balloon">詳細へ</span>
                    </a>
                    {task.link && (
                        <a
                            className="balloonoya"
                            href={task.link}
                            style={{ textDecoration: "none" }}
                            target="_blank">📎
                            <span className="balloon">リンク</span>
                        </a>
                    )}
                </div>
                <span id="rewardId" />
                <ModalNew title={task.title} body={task.body} link={task.link} term={task.term}  {...{}} ref={childRef} />
                <button onClick={openModal}>
                    <span className="balloonoya">
                        ☸
                        <span className="balloon" style={{ fontSize: "10px" }}>データコピー新規</span>
                    </span>
                </button>
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
                        <input
                            type="checkbox"
                            className="checkbox-input"
                            onClick={updateDone} />
                    </label>
                    {editTitle === undefined ? itemText() : itemInput()}
                </li>
            </div>
        </li>
    );
}

export default TaskItem
