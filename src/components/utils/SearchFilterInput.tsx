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
  }, [inputValue]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (validateInput(event.target.value)) {
      setInputValue(event.target.value);
    }
  };

  const getInputType = () => {
    if (type.includes("integer")) {
      return "text";
    } else if (type.includes("timestamp")) {
      return "text";
    }
    return "text";
  };

  const validateInput = (value: string) => {
    if (type.includes("integer") && !/^\d*$/.test(value)) {
      return false;
    } else if (type.includes("timestamp") && !/^[0-9:/ \\-]*$/.test(value)) {
      return false;
    }
    return true;
  };

  return (
    <div className="relative text-gray-400 focus-within:text-gray-600">
      {options.length > 0 ? (
        <select
          className="py-2 px-3 w-full text-sm bg-white border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
          value={inputValue}
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
          type={getInputType()}
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
