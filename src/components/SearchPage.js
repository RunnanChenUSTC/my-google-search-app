import React, { useEffect } from 'react';

const SearchPage = () => {
  useEffect(() => {
    // 监听 window 的 'load' 和 'popstate' 事件来捕获 URL 变化
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
