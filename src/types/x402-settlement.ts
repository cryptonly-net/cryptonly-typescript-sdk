import type { PaginatedList, PaginationQuery } from './pagination';

/** One x402 settlement from `GET /x402/settlements`. */
export interface X402Settlement {
  id: string;
  status: 'submitted' | 'confirmed' | 'failed';
  /** CAIP-2, e.g. `eip155:8453`. */
  network: string;
  /** Token contract. */
  asset: string;
  /** Atomic units. */
  amount: string;
  payer: string;
  payTo: string;
  /** Empty until the settlement is broadcast. */
  transaction: string;
  errorReason: string | null;
  createdAt: string;
  confirmedAt: string | null;
}

export type X402SettlementStatus = X402Settlement['status'];

export interface X402SettlementDataResponse {
  data: X402Settlement;
}

export type X402SettlementListResponse = PaginatedList<X402Settlement>;

/** Query for `GET /x402/settlements`. */
export interface GetX402SettlementsQuery extends PaginationQuery {
  status?: X402SettlementStatus;
  /** ISO-8601. Settlements created at or after this instant. */
  from?: string;
  /** ISO-8601. Settlements created at or before this instant. */
  to?: string;
  payer?: string;
  payTo?: string;
  /** Transaction hash, exact match. */
  transaction?: string;
}
