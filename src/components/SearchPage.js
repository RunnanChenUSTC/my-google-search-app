import React, { useEffect } from 'react';

const SearchPage = () => {
  useEffect(() => {
    // 初始化 Google CSE 脚本
    const initGoogleSearch = () => {
      const cx = '02d8eddf1501844d2'; // 您的实际搜索引擎ID
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

        // // 发送查询到自己的服务器
        // fetch('http://localhost:3000/api/search', {
        //   method: 'POST',
        //   headers: {
        //     'Content-Type': 'application/json',
        //   },
        //   body: JSON.stringify({ searchTerm: query })
        // })
        // .then(response => response.json())
        // .then(data => console.log("Response from server: ", data))
        // .catch(error => console.error('Error posting search query:', error));
      }
    };

    // 设置定时检查以捕获搜索词
    const intervalId = setInterval(getSearchQuery, 5000); // 每5秒检查一次

    initGoogleSearch();

    return () => {
      clearInterval(intervalId); // 清除定时器
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
