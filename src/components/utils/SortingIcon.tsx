import { ChevronUpIcon, ChevronDownIcon } from "@heroicons/react/solid";
import React from "react";

export const SortingIcon: React.FC<{ direction?: string }> = ({
  direction,
}) => (
  <>
    {direction === "asc" ? (
      <ChevronUpIcon className="inline-block ml-2 w-5 h-5" />
    ) : (
      <ChevronDownIcon className="inline-block ml-2 w-5 h-5" />
    )}
  </>
);
