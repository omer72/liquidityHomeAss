
import React from 'react';
import { Button } from "@/components/ui/button"

interface Props{
    count:number;
    currentPage:number;
    setCurrentPage: (value:number) => void;
}
const Pagination = ({ count, currentPage, setCurrentPage }:Props) => {
  const totalPages = Math.ceil(count / 10);
  const maxButtons = 5;

  const handlePageChange = (page:number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const getPageNumbers = () => {
    const pages = [];
    let startPage = Math.max(currentPage - Math.floor(maxButtons / 2), 1);
    let endPage = startPage + maxButtons - 1;

    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = Math.max(endPage - maxButtons + 1, 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };

  return (
    <div className="flex space-x-1 mt-4">
      <Button variant="outline"
        className={`px-3 py-1 border rounded ${currentPage === 1 ? 'text-gray-400' : 'text-blue-600'}`}
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        &laquo;
      </Button>
      {getPageNumbers().map((page) => (
        <Button variant="outline"
          key={page}
          className={`px-3 py-1 border rounded ${currentPage === page ? 'bg-blue-600 text-white' : 'text-blue-600'}`}
          onClick={() => handlePageChange(page)}
        >
          {page}
        </Button>
      ))}
      <Button variant="outline"
        className={`px-3 py-1 border rounded ${currentPage === totalPages ? 'text-gray-400' : 'text-blue-600'}`}
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        &raquo;
      </Button>
    </div>
  );
};

export default Pagination;