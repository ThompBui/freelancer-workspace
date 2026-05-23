import { useState, useEffect, useMemo } from 'react';
import { paginate } from '../utils/pagination.js';
import { PAGE_SIZE } from '../constants/app.js';

/** Reset về trang 1 khi filter/tab đổi; trả slice 20 mục + meta */
export function usePagination(items, deps = [], pageSize = PAGE_SIZE) {
  const [page, setPage] = useState(1);

  useEffect(() => {
    setPage(1);
  }, deps);

  const result = useMemo(() => paginate(items, page, pageSize), [items, page, pageSize]);

  useEffect(() => {
    if (page > result.totalPages) setPage(result.totalPages);
  }, [page, result.totalPages]);

  return {
    ...result,
    setPage,
    next: () => setPage((p) => Math.min(p + 1, result.totalPages)),
    prev: () => setPage((p) => Math.max(p - 1, 1)),
  };
}
