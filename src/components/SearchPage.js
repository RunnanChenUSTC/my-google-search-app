import React, { useState } from 'react';

const SearchWithGoogleAPI = () => {
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const resultsPerPage = 10;

  // 发送请求
  const fetchSearchResults = async () => {
    if (!query) return;
    setIsLoading(true);
    setError('');
    const offset = currentPage * resultsPerPage;

    try {
      // 发送 POST 请求到 Next.js API 路由
      const response = await fetch('/api/google-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          searchKey: query,
          start: offset + 1,  // 用于分页
          num: resultsPerPage,  // 每页的结果数量
        }),
      });

      if (!response.ok) throw new Error('Search failed');
      const data = await response.json();
      setSearchResults(data.items || []);  // 更新搜索结果
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
