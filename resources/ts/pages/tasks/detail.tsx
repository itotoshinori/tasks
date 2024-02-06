import React, { useState } from 'react';
import { useTask, useUpdateTask } from '../../queries/TaskQuery'
import { formatDate, getWeek, getYearDate } from '../../functions/dateSet'
import { toast } from 'react-toastify';
import { toShortText } from '../../functions/textSet'

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

    const llikGoogleCalendar = (): string => {
        return `https://calendar.google.com/calendar/u/0/r/eventedit?text=${task.title}&&dates=${getYearDate(task.term)}T120000/${getYearDate(task.term)}T130000`
    }

    const handleUpdate = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        toast.error(title)
        if (!title) {
            toast.error('タイトルを入力してください')
            return
        }
        if (!term) {
            toast.error('期限を入力してください')
            return
        }
        if (title.length >= 30) {
            toast.error('タイトルは30文字未満でお願いします')
            return
        }
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
                        <div className="body_text">{task?.body}</div>
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
                {task.finishday && (
                    <>
                        <div className="mt-1">■完了日</div>
                        <div>{task.finishday}({getWeek(task.finishday)})</div>
                    </>
                )}
                {task.link && (
                    <>
                        <div className="mt-1">■リンク</div>
                        <div><a href={task.link}>{toShortText(task.link, 30)}</a></div>
                    </>
                )}
                <div className="mt-2">
                    <span className="change_mode_text mr-2" onClick={handleToggleEdit}>編集</span>
                    <span className="change_mode_text mr-2" onClick={() => window.close()}>閉じる</span>
                    <a href={llikGoogleCalendar()}>GoogleCalendar登録</a>
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
            <div className="space_box">
            </div>
            <div className="middle-display-page">
                <div className="middle-display-panel">
                    {editMode ? itemInput() : itemText()}
                </div>
            </div>
        </>
    );
};
