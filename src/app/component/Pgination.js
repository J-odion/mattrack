import { LuChevronLeft, LuChevronRight } from "react-icons/lu";


export default function Pagination({ currentPage, totalPages, setCurrentPage }) {
  const pageNumbers = [];

  // Show 1, 2, 3 ... totalPages or similar
  if (totalPages <= 5) {
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
    }
  } else {
    if (currentPage <= 3) {
      pageNumbers.push(1, 2, 3, 4, '...', totalPages);
    } else if (currentPage >= totalPages - 2) {
      pageNumbers.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
    } else {
      pageNumbers.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
    }
  }

  return (
    <div className="flex w-full items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
      <div className="flex flex-1 justify-between sm:hidden">
        <button
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
        >
          Previous
        </button>
        <button
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
        >
          Next
        </button>
      </div>
      <div className="hidden sm:flex sm:flex-1 sm:items-center justify-between">
        <div className="">
          <p className="text-sm text-gray-700">
            Showing page <span className="font-medium">{(currentPage) }</span> {' '} of {' '}
            <span className="font-medium">{totalPages }</span> pages
          </p>
        </div>
        <div>
          <nav className="isolate inline-flex -space-x-px rounded-md shadow-xs" aria-label="Pagination">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-gray-300 ring-inset hover:bg-gray-50 focus:z-20 disabled:opacity-50"
            >
              <span className="sr-only">Previous</span>
              <LuChevronLeft className="size-5" aria-hidden="true" />
            </button>

            {pageNumbers.map((number, idx) =>
              typeof number === 'number' ? (
                <button
                  key={idx}
                  onClick={() => setCurrentPage(number)}
                  aria-current={number === currentPage ? 'page' : undefined}
                  className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ring-1 ring-inset ring-[#EEF2FF] focus:z-20 ${
                    number === currentPage
                      ? 'z-10 bg-[#EEF2FF] text-black'
                      : 'text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  {number}
                </button>
              ) : (
                <span
                  key={idx}
                  className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-[#EEF2FF]"
                >
                  ...
                </span>
              )
            )}

            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-gray-300 ring-inset hover:bg-gray-50 focus:z-20 disabled:opacity-50"
            >
              <span className="sr-only">Next</span>
              <LuChevronRight className="size-5" aria-hidden="true" />
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
}
