import { SearchIcon, FilterIcon } from "@heroicons/react/solid";

const SearchBar = ({
  searchTerm,
  setSearchTerm,
  setShowAdvancedSearch,
  onSearch,
}) => {
  return (
    <>
      <input
        type="text"
        placeholder="Search users..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="px-4 py-2 border rounded w-full max-w-xs"
      />
      <button
        className="p-2 bg-gray-200 rounded hover:bg-gray-300"
        onClick={() => onSearch(searchTerm)}
      >
        <SearchIcon className="w-5 h-5 text-gray-600" />
      </button>
      <button
        className="p-2 bg-gray-200 rounded hover:bg-gray-300"
        onClick={() => setShowAdvancedSearch((prev) => !prev)}
      >
        <FilterIcon className="w-5 h-5 text-gray-600" />
      </button>
    </>
  );
};

export default SearchBar;
