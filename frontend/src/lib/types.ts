export interface NFT {
  id: string;
  token_id: number;
  contract_address: string;
  name: string;
  description: string | null;
  image: string | null;
  owner: string;
  collection_address: string | null;
  metadata_uri: string | null;
  created_at: number;
  updated_at: number;
}

export interface User {
  address: string;
  username: string | null;
  bio: string | null;
  avatar: string | null;
  twitter: string | null;
  website: string | null;
  created_at: number;
  updated_at: number;
}

export interface Collection {
  address: string;
  name: string;
  description: string | null;
  image: string | null;
  banner: string | null;
  owner: string;
  created_at: number;
  updated_at: number;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ListingFormData {
  nftContract: `0x${string}`;
  tokenId: number;
  price: string;
  name: string;
  description: string;
  image: string;
}
