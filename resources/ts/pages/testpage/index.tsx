import React, { useState } from 'react';
import Child from './component/Child'


export const TestPage: React.VFC = () => {
    const [text, setText] = useState("");
    const handleValueChange = (newValue: string) => {
        setText(newValue);
    };

    return (
        <div>
            <Child handleValueChange={handleValueChange} />
            {/* textを子コンポーネント側の値で更新するためにpropsで渡す */}
            <h1>{text}</h1>
            {/* ↑textはここに表示 */}
        </div>
    );
};
