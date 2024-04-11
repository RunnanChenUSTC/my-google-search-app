import React, { useEffect } from 'react';

const SearchPage = () => {
    useEffect(() => {
        // 创建脚本标签
        const script = document.createElement('script');
        script.src = "https://cse.google.com/cse.js?cx=02d8eddf1501844d2";
        script.async = true;
        document.body.appendChild(script);

        // 创建点击事件监听器
        const clickListener = (event) => {
            // 检查是否点击了搜索结果链接
            if (event.target && event.target.matches("a.gs-title")) {
                const url = event.target.href; // 获取链接的URL

                // 使用gtag发送点击事件到Google Analytics
                gtag('event', 'select_content', {
                    content_type: 'search_result',
                    item_id: url,
                });
            }
        };

        // 添加事件监听器到文档
        document.addEventListener('click', clickListener);

        // 组件卸载时移除脚本和事件监听器
        return () => {
            document.body.removeChild(script);
            document.removeEventListener('click', clickListener);
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
