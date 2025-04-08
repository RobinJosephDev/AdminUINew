import React from 'react';

interface PaginationProps {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ totalPages, currentPage, onPageChange }) => {
  const getPageNumbers = () => {
    let startPage = Math.max(1, currentPage - 3);
    let endPage = Math.min(totalPages, startPage + 6);

    if (endPage === totalPages) {
      startPage = Math.max(1, totalPages - 6);
    }

    let pages = [];
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div className="pagination">
      <button disabled={currentPage === 1} onClick={() => onPageChange(1)}>
        <svg viewBox="0 0 24 24" className="svg-icon">
          <path d="M19 6L5 12l14 6V6z"></path> {/* First page icon */}
        </svg>
      </button>
      <button disabled={currentPage === 1} onClick={() => onPageChange(currentPage - 1)}>
        <svg viewBox="0 0 24 24" className="svg-icon">
          <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"></path>
        </svg>
      </button>
      {getPageNumbers().map((page) => (
        <button key={page} onClick={() => onPageChange(page)} className={page === currentPage ? 'currentPageLabel' : ''}>
          {page}
        </button>
      ))}
      <button disabled={currentPage === totalPages} onClick={() => onPageChange(currentPage + 1)}>
        <svg viewBox="0 0 24 24" className="svg-icon" style={{ transform: 'rotate(180deg)' }}>
          <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"></path>
        </svg>
      </button>
      <button disabled={currentPage === totalPages} onClick={() => onPageChange(totalPages)}>
        <svg viewBox="0 0 24 24" className="svg-icon" style={{ transform: 'rotate(180deg)' }}>
          <path d="M19 6L5 12l14 6V6z"></path> {/* Last page icon */}
        </svg>
      </button>
    </div>
  );
};

export default Pagination;
