import { useEffect, useState } from "react";

export function usePageParam() {
    const [page, setPage] = useState<number>(0);

    useEffect(() => {
        const searchParams = new URL(window.location.href).searchParams;
        const page = parseInt(searchParams.get("page") || "1", 10);
        if (Number.isNaN(page)) {
            setPage(1);
            history.replaceState({ page }, "", new URL(`?page=${page}`, location.href));
            return;
        }
        setPage(page);
    }, []);

    function nextPage() {
        setPage((prev) => prev + 1);
    }

    function prevPage() {
        setPage((prev) => prev > 1 ? prev - 1 : 1);
    }

    return { page, nextPage, prevPage };
}