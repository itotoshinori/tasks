import React, { useState } from "react";
import Modal from 'react-modal'

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
    },
}

const Child = (props: any) => {
    let subtitle: HTMLHeadingElement | null
    const [modalIsOpen, setIsOpen] = useState<boolean>(false)

    function openModal() {
        setIsOpen(true)
    }

    function afterOpenModal() {
        if (subtitle) subtitle.style.color = '#f00'
    }

    function closeModal() {
        setIsOpen(false)
    }
    return (
        <div>
            <button onClick={() => props.handleClickChild('test')}>Click</button>
            <button onClick={openModal}>Open Modal</button>
            <Modal
                contentLabel="Example Modal"
                isOpen={modalIsOpen}
                style={customStyles}
                onAfterOpen={afterOpenModal}
                onRequestClose={closeModal}
            >
                <h2 ref={(_subtitle) => (subtitle = _subtitle)}>Hello</h2>
                <button onClick={closeModal}>close</button>
                <div>I am a modal</div>
                <form>
                    <input />
                    <button>tab navigation</button>
                    <button>stays</button>
                    <button>inside</button>
                    <button>the modal</button>
                </form>
            </Modal>
        </div>
    );
}

export default Child;