import {
  ArrowNarrowLeftIcon,
  ArrowNarrowRightIcon,
} from "@heroicons/react/solid";

type PaginationProps = {
  totalPage: number;
  currentPage: number;
  goToPage: (page: number) => void;
};

const Pagination: React.FC<PaginationProps> = ({
  totalPage,
  currentPage,
  goToPage,
}) => {
  return (
    <div className="flex justify-center items-center space-x-1 mt-4">
      {totalPage > 1 && (
        <div className="flex justify-center items-center space-x-1 mt-4">
          {currentPage > 1 && (
            <button onClick={() => goToPage(1)} className="p-1">
              <ArrowNarrowLeftIcon className="w-5 h-5 text-gray-600" />
            </button>
          )}

          {[...Array(totalPage)].map((_, index) => (
            <button
              key={index}
              onClick={() => goToPage(index + 1)}
              className={`px-3 py-1 rounded ${
                currentPage === index + 1
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-600"
              }`}
            >
              {index + 1}
            </button>
          ))}

          {currentPage < totalPage && (
            <button onClick={() => goToPage(totalPage)} className="p-1">
              <ArrowNarrowRightIcon className="w-5 h-5 text-gray-600" />
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default Pagination;
