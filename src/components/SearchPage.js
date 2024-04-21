import React, { useState, useEffect } from 'react';

const AutoSuggestSearch = () => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  // 处理输入变化并请求自动完成建议
  const handleInputChange = async (event) => {
    setQuery(event.target.value);
    if (event.target.value.length > 1) {
      const endpoint = `https://api.bing.microsoft.com/v7.0/suggestions?q=${encodeURIComponent(event.target.value)}`;
      const apiKey = 'b9050cb657d64fd7b3437309989c5a4e'; // 替换为您的API密钥
      try {
        const response = await fetch(endpoint, {
          headers: { 'Ocp-Apim-Subscription-Key': apiKey }
        });
        const data = await response.json();
        if (data.suggestionGroups && data.suggestionGroups.length > 0) {
          setSuggestions(data.suggestionGroups[0].searchSuggestions);
        }
      } catch (error) {
        console.error('Error fetching suggestions:', error);
      }
    } else {
      setSuggestions([]);
    }
  };

  return (
    <div>
      <input
        type="text"
        value={query}
        onChange={handleInputChange}
        placeholder="Type to search..."
      />
      {suggestions.length > 0 && (
        <ul>
          {suggestions.map((suggestion, index) => (
            <li key={index} onClick={() => setQuery(suggestion.query)}>
              {suggestion.displayText}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AutoSuggestSearch;
