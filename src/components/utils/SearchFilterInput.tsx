import React, { useState, useEffect } from "react";
import { SearchIcon } from "@heroicons/react/solid";
import debounce from "lodash/debounce";

export const SearchFilterInput: React.FC<{
  onChange: (value: string) => void;
  columnName: string;
  type: string;
  value: string;
  selectOptions?: string | null;
}> = ({ onChange, columnName, type, value, selectOptions }) => {
  const [inputValue, setInputValue] = useState(value);
  const options = selectOptions ? selectOptions.split(",") : [];
  const debouncedOnChange = debounce(onChange, 600);

  useEffect(() => {
    if (inputValue !== value) {
      debouncedOnChange(inputValue);
    }
    return () => {
      debouncedOnChange.cancel();
    };
  }, [inputValue, debouncedOnChange]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    if (type === "integer" || type === "numner") {
      const validInteger = newValue.match(/^\d*$/);
      if (validInteger) {
        setInputValue(newValue);
      }
    } else if (type === "timestamp(3) without time zone" || type === "Date") {
      const validTimestamp = newValue.match(/^[0-9:/\-]*$/);
      if (validTimestamp) {
        setInputValue(newValue);
      }
    } else {
      setInputValue(newValue);
    }
  };

  return (
    <div className="relative text-gray-400 focus-within:text-gray-600">
      {options.length > 0 ? (
        <select
          className="py-2 px-3 w-full text-sm bg-white border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
          value={value}
          onChange={(e) => setInputValue(e.target.value)}
        >
          <option value="">Select {columnName}</option>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      ) : (
        <input
          type="text"
          className="py-2 px-3 pl-8 w-full text-sm bg-white border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
          placeholder={`Filter ${columnName}...`}
          value={inputValue}
          onChange={handleInputChange}
        />
      )}
      <div className="absolute inset-y-0 left-0 flex items-center pl-2">
        <SearchIcon className="h-4 w-4" />
      </div>
    </div>
  );
};
