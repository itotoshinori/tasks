import React, { useState } from 'react';
import Child from './component/child'


export const TestPage: React.VFC = () => {
    const pathname = location.pathname.replace(/\/+$/, "").split('/').pop();
    const pathname2 = location.href;
    console.log(pathname2)
    const [message, setMessage] = useState<string>('')
    const handleClick = (word: string) => {
        !message ? setMessage(word) : setMessage("")
        console.log(message)
    };
    return (
        <div className="login-page">
            <div className="login-panel">
                パスパラメーター：{pathname}
            </div>
            <Child handleClickChild={handleClick} />
            <div>{message}</div>
        </div>
    );
};
