import React, { useState, useEffect } from 'react';

const SearchWithGoogleAPI = () => {
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const resultsPerPage = 10; 
  // 如何申请，参考 https://zhuanlan.zhihu.com/p/174666017
  const googleSearchKey = 'AIzaSyBT6bUL1Fxp9eGhivDqMSjPcDLVnC5ZLlI';
  const googleCxId = '133bf954924984aee';
  const baseurl = 'https://customsearch.googleapis.com/customsearch/v1';

  const fetchSearchResults = async () => {
    if (!query) return;
    setIsLoading(true);
    setError('');
    const offset = currentPage * resultsPerPage;

    try {
      const response = await fetch(baseurl, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        // 使用 URL 查询参数传递搜索关键词、API 密钥和 Cx ID
        // 请求参数：搜索关键词、Google API 密钥、CSE ID
        body: JSON.stringify({
          q: query,
          cx: googleCxId,
          key: googleSearchKey,
          start: offset + 1,  // 用于分页
          num: resultsPerPage,
        })
      });

      if (!response.ok) throw new Error('Search failed');
      const data = await response.json();
      setSearchResults(data.items || []);  // 设置搜索结果
    } catch (error) {
      console.error('Error fetching search results:', error);
      setError('Failed to fetch results');
    } finally {
      setIsLoading(false);
    }
  };

  // 当页码改变时，触发新的搜索
  useEffect(() => {
    fetchSearchResults();
  }, [currentPage]);

  const handleSubmit = (event) => {
    event.preventDefault();
    setCurrentPage(0);
    fetchSearchResults();
  };

  const goToNextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  const goToPreviousPage = () => {
    if (currentPage > 0) setCurrentPage(currentPage - 1);
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
      <button onClick={goToPreviousPage} disabled={currentPage === 0}>
        Previous
      </button>
      <button onClick={goToNextPage}>Next</button>
    </div>
  );
};

export default SearchWithGoogleAPI;
