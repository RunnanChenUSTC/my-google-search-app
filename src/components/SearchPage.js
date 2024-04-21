import React, { useState, useEffect } from 'react';

const SearchPage = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [query, setQuery] = useState('');

  const fetchSearchResults = (query) => {
    const endpoint = `https://api.bing.microsoft.com/v7.0/custom/search`;
    const apiKey = '66f4e1b1d31e475b8c09bd056ccc1945'; // 替换为你的 Bing API 密钥
    const customConfigId = '09383300-fa71-4444-8a62-b5250c445569'; // 替换为你的自定义配置ID
    const url = `${endpoint}?q=${encodeURIComponent(query)}&customConfig=${customConfigId}`;

    fetch(url, {
      method: 'GET',
      headers: { 'Ocp-Apim-Subscription-Key': apiKey }
    })
    .then(response => response.json())
    .then(data => {
      setSearchResults(data.webPages.value); // 假设结果存储在 webPages.value 中
    })
    .catch(error => console.error('Error fetching search results:', error));
  };

  useEffect(() => {
    // 例如，可以添加一个事件监听器来处理表单提交
    const form = document.getElementById('searchForm');
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      fetchSearchResults(query);
    });

    return () => {
      form.removeEventListener('submit');
    };
  }, [query]);

  return (
    <div>
      <h1>Search with Bing</h1>
      <form id="searchForm">
        <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search here..." />
        <button type="submit">Search</button>
      </form>
      <div>
        {searchResults.map((item, index) => (
          <div key={index}>
            <a href={item.url} target="_blank" rel="noopener noreferrer">{item.name}</a>
            <p>{item.snippet}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchPage;
