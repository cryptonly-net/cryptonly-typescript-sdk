# Changelog

All notable changes to `@cryptonly/sdk` are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.9.0] - 2026-10-22

### Added

- `'spl'` in `TokenType`, for the Solana `USDC_SOL` and `USDT_SOL` currencies. Native `SOL` has no token type, and withdrawal fees on Solana are quoted in `SOL`.
- `WithdrawalAutoConvertPreview.commissionAmount`: the conversion commission in `fromAssetCode`, already included in `fromAmount`. It is 0 for USDT ↔ USDC and 0.05% of `fromAmount` for every other pair.
- `Invoice.x402Url`: a URL AI agents pay with an x402 client. A request without payment answers `402 Payment Required`, and a paid retry settles the invoice. Present unless x402 is off for the invoice.
- `Invoice.paymentChannel` (`InvoicePaymentChannel`): `address` or `x402`, once the invoice was paid.
- `CreateInvoiceApiKeyRequest.x402Enabled`: set `false` to create an invoice without an `x402Url`.

## [1.7.0] - 2026-10-17

### Removed

- `SettlementBreakdown.depositNetworkFeeAmount` and `SettlementBreakdown.depositNetworkFeeAmountUsd`.

## [1.6.0] - 2026-10-17

### Removed

- `client.addressProvision`, the `AddressProvision*` types, the `ADDRESS_PROVISION_*` constants, and `CRYPTONLY_EXCEPTION_ADDRESS_PROVISION_TEMPORARILY_DISABLED`.
- `DepositStatusChangedWebhookData.addressProvisionId`.
- `CRYPTONLY_WEBHOOK_EVENT_X402_PAYMENT_SETTLED`, `CRYPTONLY_WEBHOOK_EVENT_X402_PAYMENT_FAILED`, and the `CryptonlyX402Payment*WebhookBody` types. x402 settlement outcomes are read with `x402Settlements.list` and `x402Settlements.get`.

## [1.5.0] - 2026-10-06

### Changed

- `MerchantCurrency.minDepositAmount` is now always above the current network fee.
- Invoice crypto amounts at checkout include the network fee.

### Deprecated

- `client.addressProvision`, the `AddressProvision*` types and the `ADDRESS_PROVISION_*` constants. Address provisioning is temporarily disabled and both calls fail with HTTP 503; use `deposit.create` instead.
- `DepositStatusChangedWebhookData.addressProvisionId` is no longer sent.

## [1.4.0] - 2026-10-01

### Added

- `'Base'` in `SupportedNetwork`, for the new `USDC_BASE` and `ETH_BASE` currencies.

## [1.3.0] - 2026-07-26

### Added

- Optional `successUrl` and `failedUrl` on invoice create and invoice responses. Status mapping: `returnUrl` for `cancelled` / `expired`, `successUrl` for `paid` / `overpaid`, `failedUrl` for `failed` / `suspended` / `partially_paid`. No CTA while `created` or `processing`.

## [1.2.0] - 2026-07-24

### Removed

- Removed the `converting` resource (`client.converting`) and related types and error codes. Use `allowAutoConvert` on `withdrawal.quote` when a withdrawal needs funding from another balance.

### Changed

- `WithdrawalAutoConvertPreview` now uses `fromAssetCode` / `toAssetCode`.

## [1.1.0] - 2026-07-19

### Removed

- Removed `commissionAmount` and `commissionUsd` from `ConvertingPreview`, `ConvertingQuote`, and `ConvertingCommitResult` (`converting` resource). Conversions no longer charge a separate commission line item.
- Removed `commissionAmount` from `WithdrawalAutoConvertPreview` (the `autoConvert` field on `WithdrawalQuote`).
- Removed `principalFromAmount` and `totalFromDebit` from `ConvertingPreview`, `ConvertingQuote`, and `ConvertingCommitResult`. Use `fromAmount` as the single source debit field on all conversion responses.
- Removed `totalFromDebit` from `WithdrawalAutoConvertPreview` (redundant with `fromAmount`).

## [1.0.1] - 2026-06-25

### Changed

- `Invoice.paymentPageUrl` is now required on all merchant invoice surfaces: `POST /invoice` (create), `GET /invoice`, `GET /invoice/list`, and invoice status webhooks.

## [1.0.2] - 2026-07-04

### Changed

- `Invoice.status` remove unused status from the related type

## [1.0.3] - 2026-07-06

### Changed

- changed repository and documentation url
