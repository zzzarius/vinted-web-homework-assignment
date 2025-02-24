import { PEXELS_ENDPOINT, ITEMS_PER_PAGE } from "../constants";
import { authorizedFetch } from "./authorizedFetch";
import { PexelsResponse } from "./Pexels.types";

export async function getCuratedPhotos(page: number = 1, init?: RequestInit) {
    const url = new URL(PEXELS_ENDPOINT);
    url.searchParams.append("page", page.toString());
    url.searchParams.append("per_page", ITEMS_PER_PAGE.toString());
    return authorizedFetch<PexelsResponse>(url.toString(), init);
}