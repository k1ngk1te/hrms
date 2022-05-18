import { useEffect, useState } from "react";

export type PaginationType = {
  totalItems: number;
  current?: number;
  pageSize?: number;
  maxPages?: number;
};

const usePagination = ({
  current = 1,
  maxPages = 10,
  pageSize = 10,
  totalItems,
}: PaginationType) => {
  // Calculate total pages
  const totalPages = Math.ceil(totalItems / pageSize);
  const [currentPage, setCurrentPage] = useState(current);
  const [endPage, setEndPage] = useState(
    maxPages > totalPages ? totalPages : maxPages
  );
  const [startPage, setStartPage] = useState(1);

  // Ensure current page isn't out of range
  useEffect(() => {
    if (currentPage < 1) setCurrentPage(1);
    else if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [currentPage, totalPages]);

  useEffect(() => {
    if (totalPages <= maxPages) {
      // Total pages less than max so show all pages
      setStartPage(1);
      setEndPage(totalPages);
    } else {
      // Total pages more than max so calculate start and end pages
      const maxPagesBeforeCurrentPage = Math.floor(maxPages / 2);
      const maxPagesAfterCurrentPage = Math.ceil(maxPages / 2) - 1;

      if (currentPage <= maxPagesBeforeCurrentPage) {
        // Current page near the start
        setStartPage(1);
        setEndPage(maxPages);
      } else if (currentPage + maxPagesAfterCurrentPage >= totalPages) {
        // Current page near the end
        setStartPage(totalPages - maxPages + 1);
        setEndPage(totalPages);
      } else {
        // Current page somewhere in the middle
        setStartPage(currentPage - maxPagesBeforeCurrentPage);
        setEndPage(currentPage + maxPagesAfterCurrentPage);
      }
    }
  }, [currentPage, maxPages, totalPages]);

  // Calculate start and end item indexes
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize - 1, totalItems - 1);

  // Create an array of pages to ng-repeat in the pager control
  const pages = Array.from(Array(endPage + 1 - startPage).keys()).map(
    (i) => startPage + i
  );

  // return object with all pager properties required by the view
  return {
    changePage: (pageNo: number) => setCurrentPage(pageNo),
    currentPage,
    endIndex,
    endPage,
    pageSize,
    pages,
    startIndex,
    startPage,
    totalItems,
    totalPages,
  };
};

export default usePagination;
