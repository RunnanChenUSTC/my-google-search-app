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
                    if (node.nodeName === 'INPUT' && node.classList.contains('gsc-input')) {
                        // 查找搜索按钮
                        const form = node.closest('form');
                        if (form) {
                            const button = form.querySelector('input.gsc-search-button[type="submit"], button.gsc-search-button');
                            if (button) {
                                button.addEventListener('click', (event) => {
                                    event.preventDefault(); // 阻止表单默认提交
                                    const searchTerm = node.value;
                                    if (searchTerm) {
                                        gtag('event', 'search', {
                                            search_term: searchTerm,
                                        });
                                    }
                                    form.submit(); // 手动提交表单
                                });
                            }
                        }
                    }
                });
            });
        });

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
