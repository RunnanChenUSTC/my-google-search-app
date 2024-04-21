import React, { useState, useEffect, useCallback } from 'react';

const SearchPage = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [query, setQuery] = useState('');

  const fetchSearchResults = useCallback((query) => {
    const endpoint = `https://api.bing.microsoft.com/v7.0/custom/search`;
    const apiKey = '66f4e1b1d31e475b8c09bd056ccc1945';  // Your actual Bing API Key
    const customConfigId = '09383300-fa71-4444-8a62-b5250c445569';  // Your Custom Config ID
    const url = `${endpoint}?q=${encodeURIComponent(query)}&customConfig=${customConfigId}`;

    fetch(url, {
      method: 'GET',
      headers: { 'Ocp-Apim-Subscription-Key': apiKey }
    })
    .then(response => response.json())
    .then(data => {
      setSearchResults(data.webPages.value);  // assuming the data is in webPages.value
    })
    .catch(error => console.error('Error fetching search results:', error));
  }, []);

  useEffect(() => {
    const form = document.getElementById('searchForm');
    const handleSubmit = (event) => {
      event.preventDefault();
      fetchSearchResults(query);
    };

    form.addEventListener('submit', handleSubmit);

    return () => {
      form.removeEventListener('submit', handleSubmit);
    };
  }, [fetchSearchResults, query]);

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
