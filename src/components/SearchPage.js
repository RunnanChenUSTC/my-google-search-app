import React, { useEffect } from 'react';

const SearchPage = () => {
    useEffect(() => {
        // 创建 Google CSE 脚本标签
        const script = document.createElement('script');
        script.src = "https://cse.google.com/cse.js?cx=02d8eddf1501844d2";
        script.async = true;
        document.body.appendChild(script);

        // 脚本加载完成后初始化 CSE 并添加事件监听
        script.onload = () => {
            // 确保全局的 google 搜索对象存在
            if (window.google && window.google.search && window.google.search.cse) {
                const element = google.search.cse.element.getElement('standard0'); // 通常的 CSE 元素ID
                if (element) {
                    element.setSearchCompleteCallback((context, results) => {
                        // 获取搜索词并发送到 Google Analytics
                        const query = results && results.formattedQuery ? results.formattedQuery : '';
                        gtag('event', 'search', {
                            search_term: query,
                        });
                    });
                }
            }
        };

        // 组件卸载时移除脚本和清理事件
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
