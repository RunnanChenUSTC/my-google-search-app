import React from 'react';

const SearchPage = () => {
    return (
        <div>
            <h1>Search with Google</h1>
            <script async src="https://cse.google.com/cse.js?cx=02d8eddf1501844d2"></script>
            <div className="gcse-search"></div>
        </div>
    );
};

export default SearchPage;
