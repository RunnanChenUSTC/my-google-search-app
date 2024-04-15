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
        // 确保搜索框被正确加载
        if (window.google && window.google.search && window.google.search.cse) {
          window.google.search.cse.element.render({
            div: "storesearch_box",
            tag: 'searchbox',
            attributes: { gname: 'storesearch' }
          });
          window.google.search.cse.element.render({
            div: "storesearch_results",
            tag: 'searchresults',
            attributes: { gname: 'storesearch' }
          });
        }
      };
    };

    // 从 Google CSE 获取当前搜索查询
    const getSearchQuery = () => {
      const cseElement = window.google.search.cse.element.getElement('storesearch');
      if (cseElement) {
        const query = cseElement.getInputQuery();
        console.log("Current search query: ", query);
        // 可以在这里将查询发送到 Google Analytics
        gtag('event', 'search', {
          'event_category': 'Search',
          'event_label': query
        });
      }
    };

    initGoogleSearch();

    // 在适当时监听事件或设置定时检查
    window.addEventListener('hashchange', getSearchQuery);

    return () => {
      window.removeEventListener('hashchange', getSearchQuery);
    };
  }, []);

  return (
    <div>
      <h1>Search with Google</h1>
      <div id="storesearch_box" className="gcse-searchbox" data-gname="storesearch"></div>
      <div id="storesearch_results" className="gcse-searchresults" data-gname="storesearch"></div>
    </div>
  );
};

export default SearchPage;
