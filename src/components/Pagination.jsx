import React from "react";
import "./Pagination.css";

/**
 * Pagination component for navigating through podcast pages
 * @param {Object} props - Component props
 * @param {number} props.currentPage - Current page number
 * @param {number} props.totalPages - Total number of pages
 * @param {number} props.itemsPerPage - Number of items per page
 * @param {Function} props.onPageChange - Callback for page changes
 * @returns {JSX.Element} The pagination component
 */
function Pagination({ currentPage, totalPages, itemsPerPage, onPageChange }) {
  /**
   * Handle page number click
   * @param {number} pageNumber - The page number to navigate to
   */
  const handlePageClick = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      onPageChange(pageNumber);
    }
  };

  /**
   * Generate page numbers to display
   * @returns {Array} Array of page numbers to show
   */
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show a subset of pages with ellipsis
      if (currentPage <= 3) {
        // Near the beginning
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        // Near the end
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        // In the middle
        pages.push(1);
        pages.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  if (totalPages <= 1) {
    return null;
  }

  return (
    <section className="pagination">
      <div className="pagination__container">
        {/* Previous button */}
        <button
          className={`pagination__button pagination__button--prev ${
            currentPage === 1 ? "pagination__button--disabled" : ""
          }`}
          onClick={() => handlePageClick(currentPage - 1)}
          disabled={currentPage === 1}
          aria-label="Previous page"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="15,18 9,12 15,6" />
          </svg>
        </button>

        {/* Page numbers */}
        <div className="pagination__pages">
          {getPageNumbers().map((page, index) => (
            <button
              key={index}
              className={`pagination__page ${
                page === currentPage ? "pagination__page--active" : ""
              } ${page === "..." ? "pagination__page--ellipsis" : ""}`}
              onClick={() => typeof page === "number" && handlePageClick(page)}
              disabled={page === "..."}
              aria-label={page === "..." ? "More pages" : `Page ${page}`}
            >
              {page}
            </button>
          ))}
        </div>

        {/* Next button */}
        <button
          className={`pagination__button pagination__button--next ${
            currentPage === totalPages ? "pagination__button--disabled" : ""
          }`}
          onClick={() => handlePageClick(currentPage + 1)}
          disabled={currentPage === totalPages}
          aria-label="Next page"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="9,18 15,12 9,6" />
          </svg>
        </button>
      </div>

      {/* Page info */}
      <div className="pagination__info">
        Page {currentPage} of {totalPages}
      </div>
    </section>
  );
}

export default Pagination;
