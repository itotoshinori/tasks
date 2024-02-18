import React, { useRef } from "react";
import { ModalDis, ChildHandles } from "./ModalDis";

export const TestPage2: React.VFC = () => {
    const childRef = useRef<ChildHandles>(null);

    const openModal = async () => {
        const sleep = (second: number) => new Promise(resolve => setTimeout(resolve, second * 1000))
        await sleep(10)
        childRef.current?.openModalFunc();
    };
    return (
        <>
            <div className="login-page">
                <ModalDis firstName="伊藤" lastName="利典" title="テスト送信用"  {...{}} ref={childRef} />
                <button onClick={openModal}>Modal</button>
            </div>
        </>
    );
};
