import React, { useEffect } from 'react';

const SearchPage = () => {
  useEffect(() => {
    // 初始化 Google CSE
    const initGoogleSearch = () => {
      const cx = '02d8eddf1501844d2'; // 替换为您的实际搜索引擎ID
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

    // 解析 URL 哈希中的查询参数
    const parseHash = (hash) => {
      const params = new URLSearchParams(hash.slice(hash.indexOf('?')));
      return params.get('gsc.q'); // 从哈希中获取 'gsc.q' 参数的值
    };

    // 监听 URL 变化
    const loadHandler = () => {
      const searchQuery = parseHash(window.location.hash);
      if (searchQuery) {
        console.log("Search completed: " + decodeURIComponent(searchQuery));
        // 发送到 Google Analytics
        gtag('event', 'search', {
          'event_category': 'Search',
          'event_label': decodeURIComponent(searchQuery)
        });
      }
    };

    window.addEventListener('load', loadHandler);
    window.addEventListener('hashchange', loadHandler); // 监听哈希变化

    initGoogleSearch();

    return () => {
      window.removeEventListener('load', loadHandler);
      window.removeEventListener('hashchange', loadHandler);
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
