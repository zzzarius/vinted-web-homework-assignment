import { authorizedFetch } from "./authorizedFetch";
import { PexelsResponse } from "./Pexels.types";

const PEXELS_ENDPOINT = "https://api.pexels.com/v1/curated";

export async function getCuratedPhotos(page: number = 1, init?: RequestInit) {
    const url = new URL(PEXELS_ENDPOINT);
    url.searchParams.append("page", page.toString());
    url.searchParams.append("per_page", "40");
    return authorizedFetch<PexelsResponse>(url.toString(), init);
}