import React, { useState } from "react";
const SearchForm = (props: any) => {
    const [value, setValue] = useState('')
    // 親コンポーネントから受け取った関数を使って、inputの値を渡す
    const handleInputChange = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        props.handleSearchWord(value);
    };
    const reset = () => {
        setValue("")
        props.handleSearchWord("");
    }

    return (
        <>
            <form onSubmit={handleInputChange} className="align-center">
                <div>
                    <input
                        type="text"
                        className="input mr-2"
                        style={{ marginTop: "50px", width: "30%" }}
                        autoFocus
                        placeholder="タイトル及び本文の検索したいワードを入力してください。"
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                    />
                    <button className="btn-flat-simple mr-2">検索</button>
                    <button
                        className="btn-flat-simple"
                        onClick={() => reset()}
                    >リセット</button>
                </div>
            </form>
        </>
    );
};

export default SearchForm;


