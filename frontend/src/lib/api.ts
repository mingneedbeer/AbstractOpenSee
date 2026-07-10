import type { NFT, User, Collection, PaginatedResult } from "./types";

const API_URL = import.meta.env.PUBLIC_API_URL || "/api";

async function fetchAPI<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || "API request failed");
  }
  return res.json();
}

export const api = {
  // NFTs
  getNFTs(params?: {
    page?: number;
    limit?: number;
    search?: string;
    sort?: string;
    collection?: string;
    owner?: string;
  }) {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set("page", String(params.page));
    if (params?.limit) searchParams.set("limit", String(params.limit));
    if (params?.search) searchParams.set("search", params.search);
    if (params?.sort) searchParams.set("sort", params.sort);
    if (params?.collection) searchParams.set("collection", params.collection);
    if (params?.owner) searchParams.set("owner", params.owner);
    return fetchAPI<PaginatedResult<NFT>>(`/nfts?${searchParams}`);
  },

  getNFT(id: string) {
    return fetchAPI<NFT>(`/nfts/${id}`);
  },

  createNFT(data: {
    token_id: number;
    contract_address: string;
    name: string;
    description?: string;
    image?: string;
    owner: string;
    collection_address?: string;
    metadata_uri?: string;
  }) {
    return fetchAPI<NFT>("/nfts", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  // Users
  getUser(address: string) {
    return fetchAPI<User>(`/users/${address}`);
  },

  updateUser(address: string, data: Partial<Pick<User, "username" | "bio" | "avatar" | "twitter" | "website">>) {
    return fetchAPI<User>(`/users/${address}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  getUserNFTs(address: string, page?: number) {
    const params = page ? `?page=${page}` : "";
    return fetchAPI<PaginatedResult<NFT>>(`/users/${address}/nfts${params}`);
  },

  // Collections
  getCollections(page?: number) {
    const params = page ? `?page=${page}` : "";
    return fetchAPI<PaginatedResult<Collection>>(`/collections${params}`);
  },

  getCollection(address: string) {
    return fetchAPI<Collection>(`/collections/${address}`);
  },

  getCollectionNFTs(address: string, page?: number) {
    const params = page ? `?page=${page}` : "";
    return fetchAPI<PaginatedResult<NFT>>(`/collections/${address}/nfts${params}`);
  },
};
