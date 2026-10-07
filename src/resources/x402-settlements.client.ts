import type { CryptonlyContext } from '../client/context';
import { buildMerchantRequestFields } from '../http/merchant-request-options';
import { merchantRequest } from '../http/transport';
import type {
  GetX402SettlementsQuery,
  X402Settlement,
  X402SettlementDataResponse,
  X402SettlementListResponse,
} from '../types/x402-settlement';

/**
 * Read x402 settlements for the tenant that owns the API key.
 *
 * Requires the `x402.list` scope. A settlement is the on-chain payment:
 * the token was transferred to `payTo`, not credited to a Cryptonly balance.
 */
export class X402SettlementsClient {
  constructor(private readonly ctx: CryptonlyContext) {}

  private transportOpts() {
    return buildMerchantRequestFields(this.ctx);
  }

  /** `GET /x402/settlements` — newest first. */
  async list(query: GetX402SettlementsQuery = {}): Promise<X402SettlementListResponse> {
    const json = await merchantRequest<X402SettlementListResponse>({
      method: 'GET',
      path: '/x402/settlements',
      query: { ...query },
      ...this.transportOpts(),
    });
    if (json == null || !Array.isArray(json.data)) {
      throw new TypeError('x402Settlements.list: response missing `data` array');
    }
    return json;
  }

  /** `GET /x402/settlements/:id`. */
  async get(id: string): Promise<X402Settlement> {
    const json = await merchantRequest<X402SettlementDataResponse>({
      method: 'GET',
      path: `/x402/settlements/${encodeURIComponent(id)}`,
      ...this.transportOpts(),
    });
    if (json == null || json.data == null) {
      throw new TypeError('x402Settlements.get: response missing `data`');
    }
    return json.data;
  }
}
