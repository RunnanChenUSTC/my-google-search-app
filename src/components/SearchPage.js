import React, { useEffect } from 'react';

const SearchPage = () => {
  useEffect(() => {
    // 确保全局的 __gcse 对象
    window.__gcse = {
      parsetags: 'explicit',
      initializationCallback: function() {
        if (document.readyState === 'complete') {
          // 初始化搜索元素
          google.search.cse.element.render({
            div: "search_container",
            tag: 'search'
          });

          // 获取搜索元素对象
          const searchControl = google.search.cse.element.getElement('search');
          
          // 设置搜索完成的回调
          searchControl.setSearchCompleteCallback(null, function() {
            const query = searchControl.getInputQuery();
            if (query) {
              console.log("Search completed: " + query);
              // 发送到 Google Analytics
              gtag('event', 'search', {
                'event_category': 'Search',
                'event_label': query
              });
            }
          }, null);
        } else {
          // 如果文档未完全加载，则设置加载回调
          google.setOnLoadCallback(function() {
            google.search.cse.element.render({
              div: "search_container",
              tag: 'search'
            });
          }, true);
        }
      }
    };

    // 加载 CSE 脚本，并指定您的搜索引擎ID
    const cx = '02d8eddf1501844d2';  // 替换为您的实际搜索引擎ID
    const gcseScript = document.createElement('script');
    gcseScript.type = 'text/javascript';
    gcseScript.async = true;
    gcseScript.src = `https://cse.google.com/cse.js?cx=${cx}`;
    document.body.appendChild(gcseScript);

    return () => {
      // 组件卸载时移除脚本
      document.body.removeChild(gcseScript);
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
