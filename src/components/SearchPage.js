import React, { useEffect } from 'react';

const SearchPage = () => {
    useEffect(() => {
        // 创建脚本标签
        const script = document.createElement('script');
        script.src = "https://cse.google.com/cse.js?cx=02d8eddf1501844d2";
        script.async = true;
        document.body.appendChild(script);

        // 组件卸载时移除脚本
        return () => {
            document.body.removeChild(script);
        };
    }, []);

    return (
        <div>
            <h1>Search with Google</h1>
            <div className="gcse-search"></div>
        </div>
    );
};

export default SearchPage;
