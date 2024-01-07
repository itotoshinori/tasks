import React, { useState } from 'react'
import { useCreateTask } from '../../../queries/TaskQuery'
import { toast } from "react-toastify"

const TaskInput: React.VFC = () => {
    const [title, setTitle] = useState<string>('')
    const [term, setTerm] = useState<string>('')
    const [body, setBody] = useState<string>('')
    const [link, setLink] = useState<string>('')
    const [inputSimple, setInputSimple] = useState<boolean>(true)
    const [changeText, setchangeText] = useState<string>("詳細フォームに変更")
    const [changeTextTop, setchangeTextTop] = useState<number>(-70)
    const createTask = useCreateTask()
    const changeMode = () => {
        if (inputSimple) {
            setInputSimple(false)
            setchangeText("簡易フォームに変更")
            setchangeTextTop(-130)
        } else {
            setInputSimple(true)
            setchangeText("詳細フォームに変更")
            setchangeTextTop(-70)
        }
        window.scroll({ top: 0, behavior: 'smooth' })
    }
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!title || !term) {
            toast.error('タイトル及び期限を入力してください')
            return
        }
        createTask.mutate({ title, body, link, term })
        setTitle('')
        setTerm('')
        setBody('')
        setLink('')
        setInputSimple(true)
        setchangeText("詳細フォームに変更")
    }
    const itemInput = () => {
        return (
            <>
                <form className="input-form" onSubmit={handleSubmit}>
                    {!urlId && (
                        <div className="inner">
                            <input
                                type="text"
                                className="input"
                                placeholder="ここにはタイトルを右には期限を入力してください。"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                            <div>
                                <input
                                    type="date"
                                    className="input"
                                    value={term}
                                    onChange={(e) => setTerm(e.target.value)}
                                />
                            </div>
                            <button type="submit" className="btn is-primary">追加</button>
                        </div>
                    )}
                </form>
            </>
        );
    }
    const itemInputSimple = () => {
        return (
            <div className="login-page">
                <div className="login-panel">
                    <form style={{ alignItems: 'center' }} onSubmit={handleSubmit}>
                        <div>
                            <label>タイトル</label>
                            <input
                                type="text"
                                className="input"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                        </div>
                        <div>
                            <label>本文</label>
                            <textarea
                                className="input"
                                defaultValue={body}
                                onChange={(e) => setBody(e.target.value)}
                            />
                        </div>
                        <div>
                            <label>リンク</label>
                            <input
                                className="input"
                                defaultValue={link}
                                onChange={(e) => setLink(e.target.value)}
                            />
                        </div>
                        <div>
                            <label>期限</label>
                            <input
                                type="date"
                                className="input"
                                value={term}
                                onChange={(e) => setTerm(e.target.value)}
                            />
                        </div>
                        <button type="submit" className="btn is-primary">追加</button>
                    </form>
                </div>
            </div>
        )
    }
    const searchParams: any = new URLSearchParams(window.location.search);
    const urlId = parseInt(searchParams.get("id") || '', 10);
    return (
        <>
            <div>{inputSimple ? itemInput() : itemInputSimple()}</div >
            <div
                className='change_mode_text'
                style={{ marginTop: changeTextTop }}
                onClick={changeMode}>
                {changeText}
            </div>
        </>
    )
}
export default TaskInput

