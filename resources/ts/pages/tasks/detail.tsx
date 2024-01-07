import React, { useState } from 'react';
import { useTask, useUpdateTask } from '../../queries/TaskQuery'
import { formatDate, getWeek } from '../../functions/dateSet'
import { toast } from 'react-toastify';

export const DetailPage: React.VFC = () => {
    const searchParams: any = new URLSearchParams(window.location.search);
    const urlId: number = parseInt(searchParams.get("id"));
    const updateTask = useUpdateTask();
    const { data: task, status } = useTask(urlId);
    const [editMode, setEditMode] = useState<boolean>(false)
    const [title, setTitle] = useState('')
    const [body, setBody] = useState('')
    const [link, setLink] = useState('')
    const [term, setTerm] = useState<any>('')


    if (status === 'loading') {
        return <div className="loader" />
    } else if (status === 'error') {
        return (
            <div className="login-page">
                <div className="align-center">データの読み込みに失敗しました。<br />
                    ログインされてないのか該当データが存在しない可能性があります。
                </div>
            </div>
        )
    } else if (!task) {
        return <div className="align-center">データが存在しません</div>
    }

    const handleToggleEdit = () => {
        setEditMode(true)
        setTitle(task.title)
        setBody(task.body)
        setLink(task.link)
        setTerm(task.term)
    }

    const handleUpdate = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        if (!title) {
            toast.error('タイトルを入力してください')
            return
        } else if (!term) {
            toast.error('期限を入力してください')
            return
        }
        //const newTask = { ...task }
        task.title = title
        task.body = body
        task.link = link
        task.term = term
        updateTask.mutate({
            id: task.id,
            task: task
        });
        setEditMode(false)
        return
    }

    const itemText = () => {
        return (
            <>
                <div>■タイトル</div>
                <div>{task?.title}</div>
                {task.body && (
                    <>
                        <div className="mt-1">■本文</div>
                        <div>{task?.body}</div>
                    </>
                )}
                <div className="mt-1">■状況</div>
                <div>{task?.is_done ? "完了" : "未完了"}</div>
                {task.term && (
                    <>
                        <div className="mt-1">■期限</div>
                        <div>{task.term}({getWeek(task.term)})</div>
                    </>
                )}
                {task.link && (
                    <>
                        <div className="mt-1">■リンク</div>
                        <div><a href={task.link}>{task.link}</a></div>
                    </>
                )}
                <div className="mt-4">
                    <span className="change_mode_text" style={{ marginRight: "10px" }} onClick={handleToggleEdit}>編集</span>
                    <span onClick={() => window.close()}>📕</span>
                </div>
            </>
        );
    }
    const itemInput = () => {
        return (
            <>
                <form style={{ alignItems: 'center' }}>
                    <div>
                        <label>タイトル</label>
                        <input
                            type="text"
                            className="input"
                            defaultValue={task.title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>
                    <div>
                        <label>本文</label>
                        <textarea
                            className="input"
                            defaultValue={task.body}
                            onChange={(e) => setBody(e.target.value)}
                        />
                    </div>
                    <div>
                        <label>リンク</label>
                        <input
                            type="text"
                            className="input"
                            defaultValue={task.link}
                            onChange={(e) => setLink(e.target.value)}
                        />
                    </div>
                    <div>
                        <label>期限</label>
                        <input
                            type="date"
                            className="input"
                            defaultValue={task.term ? formatDate(task.term) : ''}
                            onChange={(e) => setTerm(e.target.value)}
                        >
                        </input>
                    </div>
                    <button className="btn" onClick={handleUpdate}>更新</button>
                    <div className='change_mode_text' onClick={() => { setEditMode(false) }}>編集モード解除</div>
                </form>
            </>
        )
    }
    return (
        <>
            <div className="login-page">
                <div className="login-panel">
                    {editMode ? itemInput() : itemText()}
                </div>
            </div>
        </>
    );
};
