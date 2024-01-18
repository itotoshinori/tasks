import React, {
    forwardRef,
    useImperativeHandle,
    ForwardRefRenderFunction,
    useState
} from "react";
import Modal from 'react-modal'
import { formatDate } from "../../functions/dateSet";

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
    firstName: string;
    lastName: string;
    title: string;
}

const ChildComponent: ForwardRefRenderFunction<ChildHandles, ChildProps> = (
    props,
    ref
) => {
    const [modalIsOpen, setIsOpen] = useState<boolean>(false)

    function openModal() {
        setIsOpen(true)
    }

    function jikkou() {
        alert("実装はここで")
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
    return (
        <>
            <Modal
                contentLabel="検索条件"
                isOpen={modalIsOpen}
                style={customStyles}
                onRequestClose={closeModal}
            >
                <h3>検索条件</h3>
                <h4>{props.firstName}{props.lastName}さんようこそ！</h4>
                <div className="input-form">
                    <form>
                        <label className="ml-2">タイトル</label><br />
                        <input
                            type="text"
                            id="title"
                            className="input"
                            autoFocus
                            value={props.title}
                        />
                        <div>
                            <label>期限</label><br />
                            <input
                                type="date"
                                className="input"
                                defaultValue={formatDate(new Date())}
                            >
                            </input>
                        </div>
                    </form>
                    <div className="mt-2 ml-2">
                        <button className="mr-2" onClick={jikkou}>登録</button>
                        <button className="mr-2" onClick={closeModal}>閉じる</button>
                    </div>
                </div>
            </Modal>
        </>
    );
};

// コンポーネントを `forwardRef` でラップする必要があります。
export const ModalDis = forwardRef(ChildComponent);
