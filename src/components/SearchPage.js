import React, { useEffect } from 'react';

const SearchPage = () => {
  useEffect(() => {
    // 初始化 Google CSE 脚本
    const initGoogleSearch = () => {
      const cx = '02d8eddf1501844d2'; // 替换为您的实际搜索引擎ID
      const gcseScript = document.createElement('script');
      gcseScript.type = 'text/javascript';
      gcseScript.async = true;
      gcseScript.src = `https://cse.google.com/cse.js?cx=${cx}`;
      document.body.appendChild(gcseScript);

      gcseScript.onload = () => {
        if (window.google && window.google.search && window.google.search.cse) {
          window.google.search.cse.element.render({
            div: "search_container",
            tag: 'search'
          });
        }
      };
    };

    // 解析当前 URL 的哈希部分中的查询参数
    const parseHashParams = (hash) => {
      const queryString = hash.substring(hash.indexOf('?') + 1);
      if (!queryString) return {};

      const params = {};
      const queries = queryString.split('&');
      queries.forEach((query) => {
        const [key, value] = query.split('=');
        if (key && value) {
          params[key] = decodeURIComponent(value.replace(/\+/g, ' '));
        }
      });
      return params;
    };

    // 监听 URL 哈希变化，并处理搜索查询
    const handleHashChange = () => {
      const queryParams = parseHashParams(window.location.hash);
      const searchQuery = queryParams['gsc.q'];
      if (searchQuery) {
        console.log("搜索词:", searchQuery);
        // 这里可以调用任何处理或跟踪函数，例如发送到 Google Analytics
        window.gtag('event', 'search', {
          'event_category': 'Search',
          'event_label': searchQuery
        });
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    window.addEventListener('load', handleHashChange); // 确保初次加载时也执行

    initGoogleSearch();  // 初始化 Google CSE

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      window.removeEventListener('load', handleHashChange);
    };
  }, []);

  return (
    <div>
      <h1>搜索页面</h1>
      <div id="search_container" className="gcse-search"></div>
    </div>
  );
};

export default SearchPage;
