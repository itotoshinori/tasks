import React from 'react';

export const TestPage: React.VFC = () => {
    const pathname = location.pathname.replace(/\/+$/, "").split('/').pop();
    const pathname2 = location.href;
    console.log(pathname2)

    return (
        <div className="login-page">
            <div className="login-panel">
                パスパラメーター：{pathname}
            </div>
        </div>
    );
};
