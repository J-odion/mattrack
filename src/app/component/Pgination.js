import { LuChevronLeft, LuChevronRight } from "react-icons/lu";

export default function Pagination({ currentPage, totalPages, setCurrentPage, recordsPerPage = 15 }) {
  const pageNumbers = [];

  // Calculate total records for display
  const totalRecords = totalPages * recordsPerPage;
  const startRecord = (currentPage - 1) * recordsPerPage + 1;
  const endRecord = Math.min(currentPage * recordsPerPage, totalRecords);

  // Show 1, 2, 3 ... totalPages or similar
  if (totalPages <= 5) {
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
    }
  } else {
    if (currentPage <= 3) {
      pageNumbers.push(1, 2, 3, 4, "...", totalPages);
    } else if (currentPage >= totalPages - 2) {
      pageNumbers.push(1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
    } else {
      pageNumbers.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages);
    }
  }

  return (
    <div className="flex w-full items-center justify-between border-t border-gray-200 bg-white px-4 py-4 sm:px-6">
      {/* Mobile Layout */}
      <div className="flex flex-1 justify-between sm:hidden">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>

      {/* Desktop Layout */}
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-700">
            Showing <span className="font-medium">{startRecord}</span> to{" "}
            <span className="font-medium">{endRecord}</span> of{" "}
            <span className="font-medium">{totalRecords}</span> records
          </p>
        </div>
        <div>
          <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="relative inline-flex items-center rounded-l-md px-3 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-none focus:ring-2 focus:ring-[#123962] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="sr-only">Previous</span>
              <LuChevronLeft className="h-5 w-5" aria-hidden="true" />
            </button>

            {pageNumbers.map((number, idx) =>
              typeof number === "number" ? (
                <button
                  key={idx}
                  onClick={() => setCurrentPage(number)}
                  aria-current={number === currentPage ? "page" : undefined}
                  className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ring-1 ring-inset ring-gray-300 focus:z-20 focus:outline-none focus:ring-2 focus:ring-[#123962] ${
                    number === currentPage
                      ? "z-10 bg-[#123962] text-white"
                      : "text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  {number}
                </button>
              ) : (
                <span
                  key={idx}
                  className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300"
                >
                  ...
                </span>
              )
            )}

            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="relative inline-flex items-center rounded-r-md px-3 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-none focus:ring-2 focus:ring-[#123962] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="sr-only">Next</span>
              <LuChevronRight className="h-5 w-5" aria-hidden="true" />
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
}