import React, { useState } from 'react';

const SearchWithGoogleAPI = () => {
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [nextPageQuery, setNextPageQuery] = useState(null);  // 存储下一页查询参数
  const [previousPageQuery, setPreviousPageQuery] = useState(null);  // 存储上一页查询参数
  const resultsPerPage = 10;

  // 发送请求
  const fetchSearchResults = async () => {
    if (!query) return;
    setIsLoading(true);
    setError('');

    try {
      // 发送 POST 请求到 Next.js API 路由
      const response = await fetch('/api/google-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          searchKey: query,
          start: currentPage * resultsPerPage + 1,  // 根据当前页数计算 start 参数
          num: resultsPerPage,  // 每页的结果数量
        }),
      });

      if (!response.ok) throw new Error('Search failed');
      const data = await response.json();
      setSearchResults(data.items || []);  // 更新搜索结果

      // 获取分页信息并更新状态
      const nextPage = data.queries?.nextPage?.[0];
      const previousPage = data.queries?.previousPage?.[0];

      setNextPageQuery(nextPage ? nextPage.start : null);  // 更新下一页的查询
      setPreviousPageQuery(previousPage ? previousPage.start : null);  // 更新上一页的查询
    } catch (error) {
      console.error('Error fetching search results:', error);
      setError('Failed to fetch results');
    } finally {
      setIsLoading(false);
    }
  };

  // 当页码改变时，触发新的搜索
  const handleSubmit = (event) => {
    event.preventDefault();
    setCurrentPage(0);
    fetchSearchResults();
  };

  const goToNextPage = () => {
    if (nextPageQuery) {
      setCurrentPage((prevPage) => prevPage + 1);
      fetchSearchResults();  // 获取下一页的结果
    }
  };

  const goToPreviousPage = () => {
    if (previousPageQuery) {
      setCurrentPage((prevPage) => prevPage - 1);
      fetchSearchResults();  // 获取上一页的结果
    }
  };

  return (
    <div>
      <h1>Google Search Results</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Type to search..."
        />
        <button type="submit">Search</button>
      </form>
      {isLoading && <p>Loading results...</p>}
      {error && <p>{error}</p>}
      <ul>
        {searchResults.map((result, index) => (
          <li key={index}>
            <p>{result.title}</p>
            <a href={result.link} target="_blank" rel="noopener noreferrer">
              {result.link}
            </a>
            <p>{result.snippet}</p>
          </li>
        ))}
      </ul>
      <button onClick={goToPreviousPage} disabled={!previousPageQuery}>
        Previous
      </button>
      <button onClick={goToNextPage} disabled={!nextPageQuery}>
        Next
      </button>
    </div>
  );
};

export default SearchWithGoogleAPI;
s