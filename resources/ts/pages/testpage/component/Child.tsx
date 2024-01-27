import React, { useState } from "react";
//propsで値を受け取る宣言。（忘れがちなので注意）
const Child = (props: any) => {
    const [value, setValue] = useState('')
    // 親コンポーネントから受け取った関数を使って、inputの値を渡す
    const handleInputChange = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        props.handleValueChange(value);
    };
    const reset = () => {
        setValue("")
        props.handleValueChange("");
    }

    return (
        <>
            <form onSubmit={handleInputChange} >
                <div>
                    <input
                        type="text"
                        style={{ marginTop: "50px" }}
                        autoFocus
                        placeholder="検索したいワードを入力してください。"
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                    />
                    <button className="btn-flat-simple">検索</button>
                </div>
            </form>
            <button
                className="btn-flat-simple"
                onClick={() => reset()}
            >リセット</button>
        </>
    );
};

export default Child;


