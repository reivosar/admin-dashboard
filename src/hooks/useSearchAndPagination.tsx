import { useState, useEffect, useCallback } from "react";

type SortConfig = {
  key: string;
  direction: "asc" | "desc";
} | null;

type UseSearchAndPaginationHookReturnType<T> = {
  states: {
    data: T[];
    currentPage: number;
    totalPage: number;
    isLoading: boolean;
    error: string;
    filter: Record<string, string>;
    sortConfig: { key: string; direction: "asc" | "desc" } | null;
  };
  setFilter: (newFilter: Record<string, string>) => void;
  goToPage: (page: number) => void;
  handleSort: (key: string) => void;
};

export const useSearchAndPaginationHook = <T,>(
  initialUrl = "",
  itemsPerPage = 10,
  initialTotalPage = 0
): UseSearchAndPaginationHookReturnType<T> => {
  const [states, setStates] = useState({
    data: [],
    totalPage: initialTotalPage,
    currentPage: 1,
    isLoading: false,
    error: "",
    filter: {},
    sortConfig: null as SortConfig,
  });

  const fetchData = useCallback(async () => {
    setStates((prev) => ({ ...prev, isLoading: true }));
    try {
      const url = new URL(initialUrl, window.location.origin);
      Object.entries(states.filter).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          url.searchParams.append(`filter[${key}]`, value.toString());
        }
      });
      if (states.sortConfig) {
        url.searchParams.append("sort", states.sortConfig.key);
        url.searchParams.append("direction", states.sortConfig.direction);
      }
      url.searchParams.append("page", states.currentPage.toString());

      const response = await fetch(url.toString());
      if (!response.ok) throw new Error("Failed to fetch data");
      const result = await response.json();

      setStates((prev) => ({
        ...prev,
        data: result,
        totalPages: Math.ceil(result.total / itemsPerPage),
        isLoading: false,
      }));
    } catch (err) {
      setStates((prev) => {
        const errorMessage =
          err instanceof Error ? err.message : "An unknown error occurred";
        return {
          ...prev,
          data: [],
          error: errorMessage,
          isLoading: false,
        };
      });
    }
  }, [
    initialUrl,
    itemsPerPage,
    states.filter,
    states.sortConfig,
    states.currentPage,
  ]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    states,
    setFilter: (newFilter: Record<string, string>) =>
      setStates((prev) => ({
        ...prev,
        filter: { ...prev.filter, ...newFilter },
        currentPage: 1,
      })),
    goToPage: (page: number) => {
      setStates((prev) => ({ ...prev, currentPage: page }));
    },
    handleSort: (key: string) => {
      let direction: "asc" | "desc" = "asc";
      if (
        states.sortConfig &&
        states.sortConfig.key === key &&
        states.sortConfig.direction === "asc"
      ) {
        direction = "desc";
      }
      setStates((prev) => ({
        ...prev,
        sortConfig: { key, direction },
      }));
    },
  };
};
