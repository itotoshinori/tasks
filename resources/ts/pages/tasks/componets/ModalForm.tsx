import React, { useState } from "react";
import Modal from 'react-modal'

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
            !title ? setTileWarning("タイトル及び本文は必須です") : setTileWarning("")
            return
        }
        if (title.indexOf("　") != -1) {
            alert("全角空欄を含んでます。除去して下さい。")
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
        setTileWarning('')
        setIsOpen(false)
    }
    return (
        <div>
            <button onClick={openModal} className="searchButton" style={{ marginTop: '10px' }}>検索</button>
            {resetLink && (
                <button className="searchButton" style={{ marginTop: '10px' }}><a href="/">リセット</a></button>
            )}
            <Modal
                contentLabel="検索条件"
                isOpen={modalIsOpen}
                style={customStyles}
                onAfterOpen={afterOpenModal}
                onRequestClose={closeModal}
            >
                <h3>検索条件</h3>
                <div className="input-form">
                    <form onSubmit={toSearch}>
                        <label className="ml-2">タイトル及び本文</label><br />
                        {titleWarning && (
                            <div className="text-warning">{titleWarning}</div>
                        )}
                        <input
                            type="text"
                            id="title"
                            className="input"
                            autoFocus
                            placeholder="検索したいワードを入力してください。"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                        <div className="mt-2 ml-2">
                            <button>検索</button>
                        </div>
                    </form>
                    <div className="mt-2 ml-2">
                        <button className="mr-2" onClick={closeModal}>閉じる</button>
                        {title && (
                            <button onClick={() => { setTitle("") }}>リセット</button>
                        )}
                    </div>
                </div>
            </Modal>
        </div>
    );
}

export default ModalForm;