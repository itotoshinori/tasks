import React, {
    forwardRef,
    useImperativeHandle,
    ForwardRefRenderFunction,
    useState
} from "react";
import Modal from 'react-modal'
import { formatDate } from "../../../functions/dateSet";
import { useTasks, useUpdateTask } from "../../../queries/TaskQuery";
import { Task } from "../../../types/Task";
import { toast } from "react-toastify";

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

// 公開したいメソッドの定義
export interface ChildHandles {
    openModalFunc: () => void;
}

export interface ChildProps {
    title: string;
    body: string;
    link: string;
}

const ChildComponent: ForwardRefRenderFunction<ChildHandles, ChildProps> = (
    props,
    ref
) => {
    const [modalIsOpen, setIsOpen] = useState<boolean>(false)
    const [title, setTitle] = useState<string>('')
    const [body, setBody] = useState<string>('')
    const [link, setLink] = useState<string>('')
    const [term, setTerm] = useState<any>('')
    const updateTask = useUpdateTask();
    const { data: tasks } = useTasks()
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

    function openModal() {
        setIsOpen(true)
        setTitle(props.title)
        setBody(props.link)
        setLink(props.link)
        setTerm(formatDate(new Date()))
    }

    function closeModal() {
        setIsOpen(false)
    }
    // コンポーネントのインスタンスが拡張されます
    // 第2引数として渡されたコールバックから返されたもので拡張されます
    useImperativeHandle(ref, () => ({
        openModalFunc() {
            openModal()
        }
    }));
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
                            defaultValue={props.title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>
                    <div>
                        <label>本文</label>
                        <textarea
                            className="input"
                            defaultValue={props.body}
                            onChange={(e) => setBody(e.target.value)}
                        />
                    </div>
                    <div>
                        <label>リンク</label>
                        <input
                            type="text"
                            className="input"
                            defaultValue={props.body}
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
                        <button className="mr-2 btn-square-little-rich" onClick={handleUpdate}>登録</button>
                        <button className="mr-2 btn-square-little-rich" onClick={closeModal}>閉じる</button>
                    </div>
                </form>
            </>
        )
    }
    return (
        <>
            <Modal
                contentLabel="新規フォーム"
                isOpen={modalIsOpen}
                style={customStyles}
                onRequestClose={closeModal}
            >
                <div className="login-panel">
                    <h3>新規登録</h3>
                    {itemInput()}
                </div>
            </Modal>
        </>
    );
};

// コンポーネントを `forwardRef` でラップする必要があります。
export const ModalNew = forwardRef(ChildComponent);
