import React, { useEffect } from 'react';

const SearchPage = () => {
    useEffect(() => {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeName === 'IFRAME' && node.name.startsWith('master-')) {
                        const srcURL = new URL(node.src);
                        const queryParam = srcURL.searchParams.get('query');
                        if (queryParam) {
                            // 发送搜索词到 Google Analytics
                            gtag('event', 'search', {
                                search_term: queryParam,
                            });
                        }
                    }
                });
            });
        });

        // 监听含 iframe 的容器
        const container = document.querySelector('.gsc-wrapper');
        if (container) {
            observer.observe(container, { childList: true, subtree: true });
        }

        return () => {
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
