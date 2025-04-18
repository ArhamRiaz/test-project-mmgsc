export const NextPrev = ({itemsPerPage, currentPage, totalPages, transactions, setCurrentPage, setItemsPerPage, paginate}) => {
    return (
        <div className="flex items-center justify-between mt-4">

            <div className="flex items-center">
                <span className="mr-2 font-bold">Items per page:</span>
                <select 
                value={itemsPerPage}
                onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setCurrentPage(1); 
                }}
                className="bg-white shadow-md rounded px-4 py-3 mb-4 w-12 h-8
                                           hover:bg-gray-50 transition-colors duration-200"
                >
                {[15, 50, 100].map((size) => (
                    <option key={size} value={size}>
                    {size}
                    </option>
                ))}
                </select>
            </div>

            <div className="flex items-center gap-2">
                <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 border rounded disabled:opacity-50"
                >
                Previous
                </button>

                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                    pageNum = i + 1;
                } else if (currentPage <= 3) {
                    pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                } else {
                    pageNum = currentPage - 2 + i;
                }

                return (
                    <button
                    key={pageNum}
                    onClick={() => paginate(pageNum)}
                    className={`px-3 py-1 border rounded ${
                        currentPage === pageNum ? "bg-blue-500 text-white" : ""
                    }`}
                    >
                    {pageNum}
                    </button>
                );
                })}

                <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border rounded disabled:opacity-50"
                >
                Next
                </button>
            </div>
                <div>
                    <p className="font-bold">Returned {transactions.length} Items </p>
                </div>
    </div>
        )
}

