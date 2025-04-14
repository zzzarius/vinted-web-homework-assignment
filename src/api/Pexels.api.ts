import { ITEMS_PER_PAGE, PEXELS_ENDPOINT } from "../constants";
import type { PexelsResponse } from "./Pexels.types";
import { authorizedFetch } from "./authorizedFetch";

export async function getCuratedPhotos(page = 1, init?: RequestInit) {
  const url = new URL(PEXELS_ENDPOINT);
  url.searchParams.append("page", page.toString());
  url.searchParams.append("per_page", ITEMS_PER_PAGE.toString());
  return authorizedFetch<PexelsResponse>(url.toString(), init);
}
