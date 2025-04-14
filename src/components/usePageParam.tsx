import { useEffect, useState } from "react";

export function usePageParam() {
  const [page, setPage] = useState<number>(0);

  useEffect(() => {
    const searchParams = new URL(window.location.href).searchParams;
    const pageNumber = Number.parseInt(searchParams.get("page") || "1", 10);
    if (Number.isNaN(pageNumber)) {
      setPage(1);
      history.replaceState({ page: 1 }, "", new URL("?page=1", location.href));
      return;
    }
    setPage(pageNumber);
  }, []);

  function nextPage() {
    setPage((prev) => prev + 1);
  }

  function prevPage() {
    setPage((prev) => (prev > 1 ? prev - 1 : 1));
  }

  return { page, nextPage, prevPage };
}
