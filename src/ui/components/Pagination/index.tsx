import classnames from 'classnames';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/outline';

import { usePagination, DOTS } from '@root/ui/hooks/usePagination';

interface Props {
  onPageChange: (page: number) => void;
  totalCount: number;
  siblingCount?: number;
  currentPage: number;
  pageSize: number;
}

const Pagination: React.FC<Props> = ({
  onPageChange,
  totalCount,
  siblingCount = 1,
  currentPage,
  pageSize,
}) => {
  const paginationRange = usePagination({
    currentPage,
    totalCount,
    siblingCount,
    pageSize,
  });

  if (currentPage === 0 || paginationRange!.length < 2) return null;

  const onNext = () => {
    onPageChange(currentPage + 1);
  };

  const onPrevious = () => {
    onPageChange(currentPage - 1);
  };

  let lastPage = paginationRange![paginationRange!.length - 1];

  return (
    <div className="mt-6 flex flex-row items-center justify-between border-t border-divider-900 space-y-4">
      <div>
        {currentPage * pageSize - pageSize + 1}-{currentPage * pageSize} of{' '}
        {totalCount.toLocaleString()} Total
      </div>
      <div className="flex flex-row items-center">
        <div
          className={classnames(
            'flex items-center justify-center text-sm hover:bg-green-960 h-9 w-9 rounded-full cursor-pointer',
            {
              hidden: currentPage === 1,
            }
          )}
          onClick={onPrevious}
        >
          <ChevronLeftIcon className="h-4 w-4" />
        </div>

        {paginationRange?.map((pageNumber, i) => {
          if (pageNumber === DOTS) {
            return (
              <div key={i} className="flex items-center justify-center h-9 w-9">
                &#8230;
              </div>
            );
          }

          return (
            <div
              key={i}
              className={classnames(
                'flex items-center justify-center text-sm hover:bg-green-960 h-9 w-9 rounded-full cursor-pointer',
                {
                  'bg-green-960': pageNumber === currentPage,
                }
              )}
              onClick={() => onPageChange(Number(pageNumber))}
            >
              {pageNumber}
            </div>
          );
        })}

        <div
          className={classnames(
            'flex items-center justify-center text-sm hover:bg-green-960 h-9 w-9 rounded-full cursor-pointer',
            { hidden: currentPage === lastPage }
          )}
          onClick={onNext}
        >
          <ChevronRightIcon className="h-4 w-4" />
        </div>
      </div>
    </div>
  );
};

export default Pagination;
