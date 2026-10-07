import type { PaginatedList, PaginationQuery } from './pagination';
import type { X402PaymentWebhookData } from '../webhook/types';

/** One x402 settlement. Same JSON as the `x402.payment.*` webhook `data`. */
export type X402Settlement = X402PaymentWebhookData;

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
