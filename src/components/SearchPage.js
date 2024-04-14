import React, { useEffect } from 'react';

const SearchPage = () => {
    useEffect(() => {
        // 创建 Google CSE 脚本标签
        const script = document.createElement('script');
        script.src = "https://cse.google.com/cse.js?cx=02d8eddf1501844d2";
        script.async = true;
        document.body.appendChild(script);

        // 监听搜索表单的提交
        const captureSearchQuery = () => {
            const searchForms = document.querySelectorAll('form.gsc-search-box');
            searchForms.forEach(form => {
                form.addEventListener('submit', (event) => {
                    // 阻止表单默认提交以捕获搜索词
                    event.preventDefault();
                    const input = form.querySelector('input.gsc-input');
                    if (input && input.value) {
                        // 发送搜索词到 Google Analytics
                        gtag('event', 'search', {
                            search_term: input.value,
                        });
                        // 手动触发搜索
                        google.search.cse.element.getElement('standard0').execute(input.value);
                    }
                });
            });
        };

        // 确保 CSE 脚本加载后添加事件监听器
        script.onload = () => {
            setTimeout(captureSearchQuery, 1000); // 延时以确保 DOM 元素已渲染
        };

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
