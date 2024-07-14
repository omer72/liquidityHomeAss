import React, { useCallback, useEffect, useState } from 'react'
import { Input } from "@/components/ui/input"
import { useQuery } from '@tanstack/react-query';
import _ from 'lodash';
import "./SwaTable.css";
import { Link } from 'react-router-dom';


const fetchSearchResults = async (searchTerm:string) => {
    const endpoints = ['people', 'films', 'planets', 'species', 'vehicles', 'starships'];
    const responses = await Promise.all(
      endpoints.map((endpoint) =>
        fetch(`https://swapi.dev/api/${endpoint}?search=${searchTerm}`).then((res) => res.json())
      )
    );
  
    const resultsByType = responses.reduce((acc, res, index) => {
        const type = endpoints[index];
        if (res.results.length > 0) {
          acc[type] = res.results;
        }
        return acc;
      }, {});
    
      return resultsByType;
  };

  // Function to highlight the search term in the results
const highlightText = (text:string, query:string) => {
    if (!query) return text;
    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return parts.map((part, index) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <span key={index} className="highlight">{part}</span>
      ) : (
        part
      )
    );
  };


function SwaTable() {


    const [query, setQuery] = useState('');
    const [debouncedQuery, setDebouncedQuery] = useState('');
  
    const { data: results, isFetching } = useQuery({queryKey:['searchResults', debouncedQuery], queryFn:() => fetchSearchResults(debouncedQuery)});
  
    const handleSearch = useCallback(
      _.debounce((searchTerm) => {
        setDebouncedQuery(searchTerm);
      }, 300),
      []
    );
  
    useEffect(() => {
      handleSearch(query);
    }, [query, handleSearch]);



    
    return (
        <div className='className="search-container"'>
            <div>SwaTable</div>
            <Input  onChange={(e: { target: { value: React.SetStateAction<string>; }; }) => setQuery(e.target.value)} value={query}/>
            {isFetching && <p>Loading...</p>}
            {isFetching && <p>Loading...</p>}
            {results && query && (
                <div className="results-popup">
                {Object.keys(results).map((type) => (
                    <div key={type} className="result-category">
                    <h3>{type.charAt(0).toUpperCase() + type.slice(1)}</h3>
                    {results[type].slice(0, 3).map((result, index) => (
                         <Link
                         to={`/${type}/${result.url.split('/').slice(-2, -1)[0]}`}
                         key={index}
                         className="result-item"
                       >
                        <p>{highlightText(result.name || result.title, query)}</p>
                        </Link>
                    ))}
                    {results[type].length > 3 &&<button
                        className="view-all-button"
                        onClick={() => window.location.href = `/${type}`}
                    >
                        View All
                    </button>}
                    </div>
                ))}
                </div>
            )}
      
        </div>
    )
}

export default SwaTable