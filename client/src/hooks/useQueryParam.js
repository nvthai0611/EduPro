import { useLocation } from "react-router-dom";
import { useMemo } from "react";

export function useQueryParam(key, defaultValue = "") {
  const { search } = useLocation();

  return useMemo(() => {
    const params = new URLSearchParams(search);
    return params.get(key) ?? defaultValue;
  }, [search, key, defaultValue]);
}
