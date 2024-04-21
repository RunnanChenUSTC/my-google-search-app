import React, { useState, useEffect } from 'react';

const SearchWithAutosuggest = () => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const resultsPerPage = 10;

  const handleInputChange = async (event) => {
    const newText = event.target.value;
    setQuery(newText);

    if (newText.length > 1) {
      try {
        const suggestEndpoint = `https://api.bing.microsoft.com/v7.0/suggestions?q=${encodeURIComponent(newText)}`;
        const suggestResponse = await fetch(suggestEndpoint, {
          headers: { 'Ocp-Apim-Subscription-Key': 'b9050cb657d64fd7b3437309989c5a4e' } // 替换为您的API密钥
        });
        const suggestData = await suggestResponse.json();
        if (suggestData.suggestionGroups && suggestData.suggestionGroups.length > 0) {
          setSuggestions(suggestData.suggestionGroups[0].searchSuggestions);
        } else {
          setSuggestions([]);
        }
      } catch (error) {
        console.error('Error fetching suggestions:', error);
      }
    } else {
      setSuggestions([]);
    }
  };

  const fetchSearchResults = async () => {
    if (!query) return;
    setIsLoading(true);
    setError('');
    const offset = currentPage * resultsPerPage;
    try {
      const searchEndpoint = `https://api.bing.microsoft.com/v7.0/search?q=${encodeURIComponent(query)}&count=${resultsPerPage}&offset=${offset}`;
      const response = await fetch(searchEndpoint, {
        headers: { 'Ocp-Apim-Subscription-Key': 'b9050cb657d64fd7b3437309989c5a4e' }
      });
      if (!response.ok) throw new Error('Search failed');
      const data = await response.json();
      setSearchResults(data.webPages ? data.webPages.value : []);
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
      <h1>Bing Search with Suggestions</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          placeholder="Type to search..."
        />
        <button type="submit">Search</button>
      </form>
      {suggestions.length > 0 && (
        <ul>
          {suggestions.map((suggestion, index) => (
            <li key={index} onClick={() => setQuery(suggestion.query)}>
              {suggestion.displayText}
            </li>
          ))}
        </ul>
      )}
      {isLoading && <p>Loading results...</p>}
      {error && <p>{error}</p>}
      <ul>
        {searchResults.map((result, index) => (
          <li key={index}>
            <a href={result.url} target="_blank" rel="noopener noreferrer">{result.name}</a>
            <p>{result.snippet}</p>
          </li>
        ))}
      </ul>
      <button onClick={goToPreviousPage} disabled={currentPage === 0}>Previous</button>
      <button onClick={goToNextPage}>Next</button>
    </div>
  );
};

export default SearchWithAutosuggest;
