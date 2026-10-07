/** On-chain settlement breakdown when an invoice or deposit is paid/completed. */
export interface SettlementBreakdown {
  amountPaid: number;
  amountPaidUsd: number;
  commissionAmount: number;
  commissionAmountUsd: number;
  /** Fee of the payer's inbound transaction, paid by the payer's wallet. */
  networkFeeAmount: number;
  networkFeeAmountUsd: number;
  networkFeeCurrencyCode: string;
  /** Payer network fee withheld to sweep the deposit address, in the deposit currency. */
  depositNetworkFeeAmount: number;
  depositNetworkFeeAmountUsd: number;
  /** `amountPaid - depositNetworkFeeAmount - commissionAmount`. */
  netAmount: number;
  netAmountUsd: number;
  txHash?: string;
  completedAt: string;
}
