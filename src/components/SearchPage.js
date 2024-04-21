import React, { useState, useEffect } from 'react';

const SearchPage = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Function to fetch search results
  const fetchSearchResults = async () => {
    if (!query) return;  // Avoid empty queries
    setIsLoading(true);
    setError(null);
    const apiKey = 'b9050cb657d64fd7b3437309989c5a4e';  // Replace with your actual Bing API key
    const url = `https://api.bing.microsoft.com/v7.0/search?q=${encodeURIComponent(query)}`;

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: { 'Ocp-Apim-Subscription-Key': apiKey }
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setSearchResults(data.webPages ? data.webPages.value : []);
    } catch (error) {
      console.error('Error fetching search results:', error);
      setError('Failed to fetch results. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle the form submission
  const handleSubmit = (event) => {
    event.preventDefault();
    fetchSearchResults();
  };

  return (
    <div>
      <h1>Bing Web Search</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter search query..."
        />
        <button type="submit">Search</button>
      </form>
      {isLoading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      <ul>
        {searchResults.map((item, index) => (
          <li key={index}>
            <a href={item.url} target="_blank" rel="noopener noreferrer">
              {item.name}
            </a>
            <p>{item.snippet}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SearchPage;
