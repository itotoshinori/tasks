import React, { useState } from "react";
import Modal from 'react-modal'

const customStyles = {
    content: {
        width: '30%',
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

const ModalForm = (props: any) => {
    let subtitle: HTMLHeadingElement | null
    const [modalIsOpen, setIsOpen] = useState<boolean>(false)
    const [title, setTitle] = useState<string>('')
    const [titleWarning, setTileWarning] = useState<string>('')
    const [resetLink, setResetLink] = useState<boolean>(false)

    function openModal() {
        setIsOpen(true)
    }

    const toSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!title) {
            !title ? setTileWarning("タイトルは必須です") : setTileWarning("")
            return
        }
        setTileWarning("")
        props.handleClickChildSearch(title)
        setIsOpen(false)
        setResetLink(true)
    }

    function afterOpenModal() {
        if (subtitle) subtitle.style.color = '#f00'
    }

    function closeModal() {
        setIsOpen(false)
    }
    return (
        <div>
            <button onClick={openModal} className="serchButton mt-4" style={{ marginTop: '10px' }}>タイトル検索</button>
            {resetLink && (
                <button onClick={openModal} className="serchButton" style={{ marginTop: '10px' }}><a href="/">リセット</a></button>
            )}
            <Modal
                contentLabel="検索条件"
                isOpen={modalIsOpen}
                style={customStyles}
                onAfterOpen={afterOpenModal}
                onRequestClose={closeModal}
            >
                <h3>検索条件</h3>
                <form className="input-form" onSubmit={toSearch}>
                    <label>タイトル</label><br />
                    {titleWarning && (
                        <div className="text-warning">{titleWarning}</div>
                    )}
                    <input
                        type="text"
                        className="input"
                        placeholder="検索したいタイトルを入力してください。"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    /><br />
                    <div className="mt-4">
                        <button className="mr-2">検索</button>
                        <button onClick={closeModal}>閉じる</button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}

export default ModalForm;