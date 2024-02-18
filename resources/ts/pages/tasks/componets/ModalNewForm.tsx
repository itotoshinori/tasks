import React, { useState } from "react";
import Modal from 'react-modal'
import { toast } from "react-toastify";
import { useTasks, useUpdateTask } from "../../../queries/TaskQuery";
import { Task } from '../../../types/Task'
import { formatDate } from "../../../functions/DateSet";

const customStyles = {
    content: {
        width: '50%',
        height: '80%',
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: '#FFDBDB',
    },
}

const ModalNewForm = () => {
    let subtitle: HTMLHeadingElement | null
    const [modalIsOpen, setIsOpen] = useState<boolean>(false)
    const [title, setTitle] = useState<string>('')
    const [body, setBody] = useState<string>('')
    const [link, setLink] = useState<string>('')
    const [term, setTerm] = useState<any>('')
    const updateTask = useUpdateTask();
    const { data: tasks } = useTasks()
    function openModal() {
        setIsOpen(true)
        setTitle(task.title)
        setBody(task.body)
        setLink(task.link)
        setTerm(formatDate(new Date()))
    }

    function afterOpenModal() {
        if (subtitle) subtitle.style.color = '#f00'
    }

    function closeModal() {
        setIsOpen(false)
    }

    if (!tasks || tasks.length <= 0) {
        return <div className="align-center" style={{ marginTop: '50px' }}>データが存在しません</div>
    }
    let tasks_array: Task[];
    tasks_array = tasks.filter((taskCall) => {
        return taskCall.title == "入力用";
    });
    const task: Task = tasks_array[0]
    const handleUpdate = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        if (title == "入力用" || !title || !term) {
            toast.error('タイトル及び期限を入力してください')
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
        setIsOpen(false)
        return
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
                            autoFocus
                            defaultValue=''
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>
                    <div>
                        <label>本文</label>
                        <textarea
                            className="input"
                            defaultValue=''
                            onChange={(e) => setBody(e.target.value)}
                        />
                    </div>
                    <div>
                        <label>リンク</label>
                        <input
                            type="text"
                            className="input"
                            defaultValue=''
                            onChange={(e) => setLink(e.target.value)}
                        />
                    </div>
                    <div>
                        <label>期限</label>
                        <input
                            type="date"
                            className="input"
                            defaultValue={formatDate(new Date())}
                            onChange={(e) => setTerm(e.target.value)}
                        >
                        </input>
                    </div>
                    <div className="mt-2">
                        <button className="mr-2 border_btn01" onClick={handleUpdate}>登録</button>
                        <button onClick={closeModal} className="border_btn01">閉じる</button>
                    </div>
                </form>
            </>
        )
    }
    return (
        <div>
            <button onClick={openModal} className="searchButton" style={{ marginTop: '10px' }}>新規登録</button>
            <Modal
                contentLabel="新規フォーム"
                isOpen={modalIsOpen}
                style={customStyles}
                onAfterOpen={afterOpenModal}
                onRequestClose={closeModal}
            >
                <div className="login-panel">
                    <h3>新規登録</h3>
                    {itemInput()}
                </div>
            </Modal>
        </div>
    );
}

export default ModalNewForm;