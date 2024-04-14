import React, { useEffect } from 'react';

const SearchPage = () => {
    useEffect(() => {
        const script = document.createElement('script');
        script.src = "https://cse.google.com/cse.js?cx=02d8eddf1501844d2";
        script.async = true;
        document.body.appendChild(script);

        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach(node => {
                    // 检查是否是搜索建议容器
                    if (node.nodeName === 'TABLE' && node.classList.contains('gssb_c')) {
                        // 给搜索建议的每一项添加点击事件监听器
                        node.querySelectorAll('td.gssb_a').forEach(suggestion => {
                            suggestion.addEventListener('click', () => {
                                const searchText = suggestion.innerText;
                                // 发送搜索建议到 Google Analytics
                                gtag('event', 'autocomplete_click', {
                                    search_term: searchText,
                                });
                            });
                        });
                    }
                });
            });
        });

        // 监听可能包含搜索建议的容器
        observer.observe(document.body, { childList: true, subtree: true });

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
