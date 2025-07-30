import { useEffect, useRef, useState, useMemo } from "react";
import { User, ApiResponse } from "@/types/api.types";
import { SortModel } from "@/types/grid.types";

interface UseApiParams {
  page: number;
  pageSize: number;
  search?: string;
  sortModel?: SortModel[];
}

type CacheKey = string; // key for cache map


export function useApi({
  page,
  pageSize,
  search = "",
  sortModel = [],
}: UseApiParams) {
  const [data, setData] = useState<User[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 🔒 Cache ref to store already fetched results
  const cache = useRef<Map<CacheKey, ApiResponse<User>>>(new Map());

  // 🧠 Create memoized cache key (only changes when relevant values change)
  const cacheKey = useMemo(() => {
    const sortKey =
      sortModel.length > 0
        ? `${sortModel[0].key}_${sortModel[0].direction}`
        : "";
    return `page=${page}&size=${pageSize}&search=${search}&sort=${sortKey}`;
  }, [page, pageSize, search, sortModel]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      // ✅ Check cache first
      if (cache.current.has(cacheKey)) {
        const cached = cache.current.get(cacheKey)!;
        setData(cached.data);
        setTotal(cached.total);
        setLoading(false);
        return;
      }

      try {
        const params = new URLSearchParams({
          page: String(page),
          pageSize: String(pageSize),
        });

        if (search) {
          params.append("search", search);
        }

        if (sortModel.length > 0) {
          const { key, direction } = sortModel[0];
          params.append("sort", `${key}_${direction}`);
        }

        const response = await fetch(
          `https://backend-datagrid.onrender.com/api/users?${params.toString()}`
        );
        if (!response.ok) throw new Error("API error");

        const json: ApiResponse<User> = await response.json();

        // ✅ Save to cache
        cache.current.set(cacheKey, json);

        setData(json.data);
        setTotal(json.total);
      } catch  {
        setError("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [cacheKey , page , pageSize ,search , sortModel]);

  return { data, total, loading, error };
}

