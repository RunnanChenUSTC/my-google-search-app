import React, { useEffect } from 'react';

const SearchPage = () => {
    useEffect(() => {
        // 创建 Google CSE 脚本标签
        const script = document.createElement('script');
        script.src = "https://cse.google.com/cse.js?cx=02d8eddf1501844d2";
        script.async = true;
        document.body.appendChild(script);

        // 设置 MutationObserver 来监听 DOM 变化
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach(node => {
                    // 检查是否是搜索输入框
                    if (node.nodeName === 'INPUT' && node.classList.contains('gsc-input')) {
                        // 设置输入事件监听器
                        node.addEventListener('input', (event) => {
                            // 将搜索词发送到 Google Analytics
                            const searchTerm = event.target.value;
                            if (searchTerm) {
                                gtag('event', 'search', {
                                    search_term: searchTerm,
                                });
                            }
                        });
                    }
                });
            });
        });

        // 开始监听 document.body 的子元素变化
        observer.observe(document.body, { childList: true, subtree: true });

        // 组件卸载时清理
        return () => {
            document.body.removeChild(script);
            observer.disconnect();
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
