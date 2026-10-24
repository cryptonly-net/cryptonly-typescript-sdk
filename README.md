<img src="https://raw.githubusercontent.com/cryptonly-net/.github/main/profile/assets/header-banner.svg" alt="Cryptonly" width="100%" />

<div align="center">

# Cryptonly — Merchant API SDK

Official JavaScript/TypeScript SDK for the Cryptonly merchant API.

[Website](https://cryptonly.net) · [Documentation](https://docs.cryptonly.net/integration/sdk/) · [Contact](https://cryptonly.net/contact/)

</div>

---

## Install

```bash
npm install @cryptonly/sdk
```

Requires Node.js 18 or later. TypeScript users need TypeScript 4.5 or later.

## Quick start

```ts
import { Cryptonly } from '@cryptonly/sdk';

const client = new Cryptonly({ apiKey: process.env.CRYPTONLY_API_KEY! });

const invoice = await client.invoice.create({
  amount: 100,
  fiatCurrencyCode: 'USD',
  description: 'Order #123',
  orderId: 'order_123',
});
```

## Options

| Option | Default | |
| --- | --- | --- |
| `apiKey` | required | Your Cryptonly API key. It selects the account. |
| `sandbox` | `false` | Call the [sandbox](https://docs.cryptonly.net/guides/sandbox-environment/) API instead of production. |
| `baseUrl` | `https://api-merchant.cryptonly.net` | Another API origin. Takes precedence over `sandbox`. |
| `timeout` | `60000` | Request timeout in milliseconds. |
| `fetch` | `globalThis.fetch` | A custom `fetch`, for tests or older runtimes. |

## Resources

| Client | Methods | Guide |
| --- | --- | --- |
| `client.invoice` | `create`, `list`, `get`, `cancel` | [Invoices](https://docs.cryptonly.net/guides/invoices/) |
| `client.deposit` | `create`, `list`, `get` | [Deposits](https://docs.cryptonly.net/guides/deposits/) |
| `client.withdrawal` | `quote`, `commit`, `list`, `get` | [Withdrawals](https://docs.cryptonly.net/guides/withdrawals/) |
| `client.currencies` | `list`, `listFiat` | [Supported currencies](https://docs.cryptonly.net/guides/supported-currencies/) |
| `client.x402Settlements` | `list`, `get` | [x402 payments](https://docs.cryptonly.net/guides/x402/) |

`get` and `cancel` take `{ id }` or `{ orderId }`. `list` methods return `{ data, total, page, limit, hasMore }`. Request and response types are exported from the package.

### Create a deposit address

```ts
const deposit = await client.deposit.create({
  cryptoCurrencyCode: 'USDT_TRC20',
  orderId: 'deposit_123',
});

console.log(deposit.address, deposit.qrCode);
```

### Send a withdrawal

A withdrawal takes two calls. `quote` returns the fee and a short-lived `quoteId`, and `commit` sends it.

```ts
const quote = await client.withdrawal.quote({
  amount: '50',
  cryptoCurrencyCode: 'USDT_TRC20',
  address: 'TJn22ewJPN89yNtrnBkagsunbrLnPyQCgs',
  orderId: 'withdrawal_123',
});

const withdrawal = await client.withdrawal.commit({ quoteId: quote.quoteId });
```

Pass `allowAutoConvert: true` to the quote to cover a shortfall by converting another asset on your balance. `quote.autoConvert` then shows the conversion.

### List x402 payments

```ts
const { data } = await client.x402Settlements.list({ status: 'confirmed' });
```

The API key needs the `x402.list` scope.

## Idempotency

`orderId` makes `invoice.create`, `deposit.create` and `withdrawal.quote` safe to retry. A retry with the same `orderId` returns the original instead of creating a duplicate. See [idempotency](https://docs.cryptonly.net/api-reference/idempotency/).

## Verify webhooks

Cryptonly signs each webhook with your account's signing key. Pass the raw request body, the `x-webhook-signature` header and the key to the verifier for the event:

```ts
import express from 'express';
import { verifyInvoiceWebhook } from '@cryptonly/sdk';

app.post('/webhooks/cryptonly', express.raw({ type: 'application/json' }), (req, res) => {
  const result = verifyInvoiceWebhook(
    req.body, // the raw Buffer, not parsed JSON
    req.header('x-webhook-signature'),
    process.env.CRYPTONLY_WEBHOOK_SECRET!,
  );
  if (!result.ok) return res.sendStatus(401);

  console.log(result.envelope.data.status);
  res.sendStatus(200);
});
```

| Event | Verifier |
| --- | --- |
| `invoice.statusChanged` | `verifyInvoiceWebhook` |
| `deposit.statusChanged` | `verifyDepositWebhook` |
| `withdrawal.statusChanged` | `verifyWithdrawalWebhook` |

On failure, `result.reason` is `missing_signature`, `invalid_signature`, `invalid_json` or `wrong_event`. Get the signing key in the dashboard under **Security**. See [webhooks](https://docs.cryptonly.net/api-reference/webhooks/) for payloads and retries.

## Errors

Every failed request throws a `CryptonlyApiError`:

| Field | |
| --- | --- |
| `status` | HTTP status, or `0` for network errors and timeouts. |
| `code` | Stable error code, such as `exceptions.withdrawal.insufficientBalance`. Branch on this. |
| `message` | Human-readable message. |
| `extension` | Extra data, such as `{ msBeforeNext }` on rate limits. |
| `requestId` | Include it when you contact support. |
| `path`, `body` | The request path and the parsed response body. |

```ts
import { CryptonlyApiError, CRYPTONLY_EXCEPTION_WITHDRAWAL_INSUFFICIENT_BALANCE } from '@cryptonly/sdk';

try {
  await client.withdrawal.commit({ quoteId });
} catch (error) {
  if (error instanceof CryptonlyApiError && error.code === CRYPTONLY_EXCEPTION_WITHDRAWAL_INSUFFICIENT_BALANCE) {
    // top up, then retry
  }
  throw error;
}
```

Error codes are exported as `CRYPTONLY_EXCEPTION_*` constants.

## Contributing

Bug reports and pull requests are welcome on [GitHub](https://github.com/cryptonly-net/cryptonly-typescript-sdk). For larger changes, open an issue first. See [CONTRIBUTING.md](CONTRIBUTING.md) and, for vulnerabilities, [SECURITY.md](SECURITY.md).

## License

[MIT](LICENSE)
