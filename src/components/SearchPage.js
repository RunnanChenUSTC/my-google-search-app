import React, { useEffect } from 'react';

const SearchPage = () => {
    useEffect(() => {
        // 创建并加载 Google CSE 脚本
        const script = document.createElement('script');
        script.src = "https://cse.google.com/cse.js?cx=02d8eddf1501844d2";
        script.async = true;
        document.body.appendChild(script);

        // 监听动态加载的 iframe 和其他动态元素来提取搜索词
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach(node => {
                    // 检查是否是 iframe 或其他相关元素
                    if (node.nodeName === 'IFRAME' && node.src && node.name.startsWith('master-')) {
                        node.onload = () => {
                            const srcURL = new URL(node.src);
                            const queryParam = srcURL.searchParams.get('query');
                            if (queryParam) {
                                // 发送搜索词到 Google Analytics
                                gtag('event', 'search', {
                                    search_term: queryParam,
                                });
                            }
                        };
                    }
                });
            });
        });

        // 监听含 iframe 的容器或其他相关容器
        observer.observe(document.body, { childList: true, subtree: true });

        return () => {
            observer.disconnect();
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
