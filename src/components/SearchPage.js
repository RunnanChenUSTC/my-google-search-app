import React, { useEffect } from 'react';

const SearchPage = () => {
  useEffect(() => {
    // 初始化 Google CSE
    const initGoogleSearch = () => {
      const cx = '您的搜索引擎ID'; // 替换为您的实际搜索引擎ID
      const gcseScript = document.createElement('script');
      gcseScript.type = 'text/javascript';
      gcseScript.async = true;
      gcseScript.src = `https://cse.google.com/cse.js?cx=${cx}`;
      document.body.appendChild(gcseScript);

      gcseScript.onload = () => {
        // 确保搜索框被正确加载
        if (window.google && window.google.search && window.google.search.cse) {
          window.google.search.cse.element.render({
            div: "search_container",
            tag: 'search'
          });
        }
      };
    };

    // 监听 URL 变化
    const loadHandler = () => {
      const params = new URLSearchParams(window.location.search);
      const searchQuery = params.get('gsc.q');  // 获取 'gsc.q' 参数的值
      if (searchQuery) {
        console.log("Search completed: " + searchQuery);
        // 发送到 Google Analytics
        gtag('event', 'search', {
          'event_category': 'Search',
          'event_label': searchQuery
        });
      }
    };

    window.addEventListener('load', loadHandler);
    window.addEventListener('popstate', loadHandler);

    initGoogleSearch();

    return () => {
      window.removeEventListener('load', loadHandler);
      window.removeEventListener('popstate', loadHandler);
    };
  }, []);

  return (
    <div>
      <h1>Search with Google</h1>
      <div id="search_container" className="gcse-search"></div>
    </div>
  );
};

export default SearchPage;
