import { newSdkOrderId } from './util-id';
import type { CreateInvoiceApiKeyRequest, CreateInvoiceParams } from '../types/invoice';

/**
 * Builds the wire JSON body for `POST /invoice`. Fills `orderId` when missing
 * and requires `fiatCurrencyCode`.
 */
export function finalizeInvoiceCreateBody(
  params: CreateInvoiceParams,
): CreateInvoiceApiKeyRequest {
  const fiat = params.fiatCurrencyCode;
  if (!fiat) {
    throw new TypeError('invoice.create: set `fiatCurrencyCode` (e.g. "USD").');
  }
  const orderId = params.orderId ?? newSdkOrderId();
  return {
    ...params,
    orderId,
    fiatCurrencyCode: fiat,
  };
}
