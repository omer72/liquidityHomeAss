import React, { useCallback, useEffect, useState } from 'react'
import { Input, Button } from "@/components/ui/input"
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
  
    const { data: results, isFetching } = useQuery(
      {
        queryKey:['searchResults', debouncedQuery], 
        queryFn:() => fetchSearchResults(debouncedQuery),
        enabled:debouncedQuery !== ''
      });
  
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
      <div className="flex items-center justify-center min-h-screen min-w-full w-96">
      <div className="w-full min-w-full">
        <div className="relative">
        <Input
            className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
            onChange={(e: { target: { value: React.SetStateAction<string>; }; }) => setQuery(e.target.value)}
            value={query} />
          
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg
              className="w-5 h-5 text-gray-500"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1111.447 3.032l4.243 4.244a1 1 0 01-1.414 1.414l-4.243-4.244A6 6 0 012 8z"
                clipRule="evenodd"
              ></path>
            </svg>
          </div>
        </div>
        {isFetching && <p>Loading...</p>}
        {results && query && (
          <div className="mt-4 bg-white border border-gray-300">
             {Object.keys(results).map((type) => (
            <div className="mb-4">
              <div className="bg-gray-400 p-2">
                <h2 className="text-lg font-semibold">{type.charAt(0).toUpperCase() + type.slice(1)}</h2>
              </div>
              <div className="p-2">
                {results[type].slice(0, 3).map((result, index) => (
                  <Link
                  to={`/${type}/id/${result.url.split('/').slice(-2, -1)[0]}`}
                  key={index}
                  className="result-item font-mono"
                >
                  <p key={index}>{highlightText(result.name || result.title, query)}</p>
                </Link>
                  
                ))}
              </div>
              <div className="flex justify-end border-gray-300 p-2">
                <Link className="text-blue-600 hover:underline font-mono" to={`/${type}`}>View all &#45;&#45;&gt;</Link>
              </div>
            </div>
             ))}
          </div>
        )}
      </div>
    </div>
    )
}

export default SwaTable