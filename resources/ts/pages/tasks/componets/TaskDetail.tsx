import React, { useState } from 'react'
import { Task } from '../../../types/Task'
import { useUpdateDoneTask, useUpdateTask, useDeleteTask } from "../../../queries/TaskQuery"
import { toast } from "react-toastify"

type Props = {
    task: Task
}

const TaskDetail: React.VFC<Props> = ({ task }) => {
    const [editMode, setEditMode] = useState<string | undefined>(undefined)
    const handleToggleEdit = () => {
        setEditMode(task.title)
    }
    const formatDate = (date: Date) => {
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');

        return `${year}-${month}-${day}`;
    };
    const itemText = () => {
        return (
            <>
                <div>【タイトル】</div>
                <div>{task.title}</div>
                {task.body && (
                    <>
                        <div className="mt-1">【本文】</div>
                        <div>{task.body}</div>
                    </>
                )}
                <div className="mt-1">【状況】</div>
                <div>{task.is_done ? "完了" : "未完了"}</div>
                <div className="mt-1">【期限】</div>
                <div>{task.term}</div>
                <div className="mt-1">【作成日】</div>
                <div>{task.created_at}</div>
                <div className="mt-1">【更新日】</div>
                <div>{task.updated_at}</div>
                <button className="btn mt-4" onClick={handleToggleEdit}>ssss編集</button>
                <div onClick={() => window.close()}>閉じる</div>
            </>
        );
    }
    const itemInput = () => {
        return (
            <>
                <form style={{ alignItems: 'center' }}>
                    <div>

                        <input
                            type="text"
                            className="input"
                            defaultValue={task.title}
                        />
                    </div>
                    <label>期限</label>
                    <div>
                        <input
                            type="date"
                            className="input"
                            defaultValue={task.term ? formatDate(task.term) : ''}>
                        </input>
                    </div>
                    <div><button className="btn mt-4" onClick={() => { setEditMode(undefined) }}>テキストモード解除</button></div>
                </form >
            </>
        )
    }
    return (
        <div>
            <div className="main_box">
                {editMode === undefined ? itemText() : itemInput()}
            </div>
        </div>
    );
}

export default TaskDetail
