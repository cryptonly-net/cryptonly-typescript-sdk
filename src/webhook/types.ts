import type { Deposit } from '../types/deposit';
import type { Invoice } from '../types/invoice';
import type { InitiationSource } from '../types/initiation';
import type { DepositStatus, InvoiceStatus, WithdrawalStatus } from '../types/status';
import {
  CRYPTONLY_WEBHOOK_EVENT_DEPOSIT_STATUS_CHANGED,
  CRYPTONLY_WEBHOOK_EVENT_INVOICE_STATUS_CHANGED,
  CRYPTONLY_WEBHOOK_EVENT_WITHDRAWAL_STATUS_CHANGED,
  CRYPTONLY_WEBHOOK_EVENT_X402_PAYMENT_FAILED,
  CRYPTONLY_WEBHOOK_EVENT_X402_PAYMENT_SETTLED,
} from './constants';

type CryptonlyWebhookEvent =
  | typeof CRYPTONLY_WEBHOOK_EVENT_INVOICE_STATUS_CHANGED
  | typeof CRYPTONLY_WEBHOOK_EVENT_WITHDRAWAL_STATUS_CHANGED
  | typeof CRYPTONLY_WEBHOOK_EVENT_DEPOSIT_STATUS_CHANGED
  | typeof CRYPTONLY_WEBHOOK_EVENT_X402_PAYMENT_SETTLED
  | typeof CRYPTONLY_WEBHOOK_EVENT_X402_PAYMENT_FAILED;

/**
 * JSON body Cryptonly POSTs to merchant `webhookUrl` (UTF-8, same string that is HMAC-signed).
 * Field order when built by the API is always `event`, `data`, `timestamp`.
 */
export interface CryptonlyOutboundWebhookBody<TData = unknown> {
  event: CryptonlyWebhookEvent;
  data: TData;
  /** ISO 8601 string from `new Date().toISOString()`. */
  timestamp: string;
}

/** `data` for {@link CRYPTONLY_WEBHOOK_EVENT_INVOICE_STATUS_CHANGED}. */
export interface InvoiceStatusChangedWebhookData extends Invoice {
  /** Status immediately before this transition. */
  previousStatus?: InvoiceStatus;
}

/**
 * Withdrawal snapshot aligned with merchant GET withdrawal (`WithdrawalDto`),
 * except `tenantAccountId` is sent as `accountId`.
 * Date fields are ISO strings on the wire.
 */
export interface WithdrawalMerchantWebhookSnapshot {
  id: string;
  orderId: string;
  /** Merchant-scoped account UUID (same value as `tenantAccountId` on GET withdrawal). */
  accountId: string;
  cryptoCurrencyCode: string;
  address: string;
  amount: number;
  transactionHash?: string | null;
  status: WithdrawalStatus;
  /** Optional funding conversion for auto-convert. */
  convertId: string | null;
  feeAmount: number;
  feeAmountUsd: number;
  amountUsd: number;
  debitedAmount: number;
  customData?: Record<string, unknown>;
  webhookUrl?: string;
  source?: InitiationSource;
  createdAt: string;
  updatedAt: string;
  quoteId: string | null;
  transferId: string | null;
}

/** `data` for {@link CRYPTONLY_WEBHOOK_EVENT_WITHDRAWAL_STATUS_CHANGED}. */
export interface WithdrawalStatusChangedWebhookData extends WithdrawalMerchantWebhookSnapshot {
  /** Status immediately before this transition. */
  previousStatus?: WithdrawalStatus;
}

export type CryptonlyInvoiceStatusChangedWebhookBody =
  CryptonlyOutboundWebhookBody<InvoiceStatusChangedWebhookData> & {
    event: typeof CRYPTONLY_WEBHOOK_EVENT_INVOICE_STATUS_CHANGED;
  };

export type CryptonlyWithdrawalStatusChangedWebhookBody =
  CryptonlyOutboundWebhookBody<WithdrawalStatusChangedWebhookData> & {
    event: typeof CRYPTONLY_WEBHOOK_EVENT_WITHDRAWAL_STATUS_CHANGED;
  };

/** `data` for {@link CRYPTONLY_WEBHOOK_EVENT_DEPOSIT_STATUS_CHANGED}. */
export interface DepositStatusChangedWebhookData extends Deposit {
  /** Status immediately before this transition. */
  previousStatus?: DepositStatus;
  /**
   * @deprecated No longer sent: address provisioning is disabled and every
   * deposit gets its own address.
   */
  addressProvisionId?: string;
  depositTransactionHash?: string | null;
  actuallyReceivedAmount?: number | null;
  actuallyReceivedAmountUsd?: number | null;
}

export type CryptonlyDepositStatusChangedWebhookBody =
  CryptonlyOutboundWebhookBody<DepositStatusChangedWebhookData> & {
    event: typeof CRYPTONLY_WEBHOOK_EVENT_DEPOSIT_STATUS_CHANGED;
  };

/**
 * `data` for {@link CRYPTONLY_WEBHOOK_EVENT_X402_PAYMENT_SETTLED} and
 * {@link CRYPTONLY_WEBHOOK_EVENT_X402_PAYMENT_FAILED}. Same shape as
 * `GET /x402/settlements/:id`. Non-custodial: the token went straight to
 * `payTo`; the merchant's Cryptonly balance does not change.
 */
export interface X402PaymentWebhookData {
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

export type CryptonlyX402PaymentSettledWebhookBody =
  CryptonlyOutboundWebhookBody<X402PaymentWebhookData> & {
    event: typeof CRYPTONLY_WEBHOOK_EVENT_X402_PAYMENT_SETTLED;
  };

export type CryptonlyX402PaymentFailedWebhookBody =
  CryptonlyOutboundWebhookBody<X402PaymentWebhookData> & {
    event: typeof CRYPTONLY_WEBHOOK_EVENT_X402_PAYMENT_FAILED;
  };
