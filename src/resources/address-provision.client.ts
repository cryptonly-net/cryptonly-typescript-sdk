import type { CryptonlyContext } from '../client/context';
import { buildMerchantRequestFields } from '../http/merchant-request-options';
import { merchantRequest } from '../http/transport';
import type {
  AddressProvisionCreateData,
  AddressProvisionCreatedResponse,
  AddressProvisionGetData,
  AddressProvisionGetResponse,
  CreateAddressProvisionParams,
  GetAddressProvisionQuery,
} from '../types/address-provision';

/**
 * @deprecated Address provisioning is temporarily disabled; the server answers
 * HTTP 503 `exceptions.addressProvision.temporarilyDisabled`. Use
 * `DepositClient.create` for each payment instead.
 */
export class AddressProvisionClient {
  constructor(private readonly ctx: CryptonlyContext) {}

  private transportOpts() {
    return buildMerchantRequestFields(this.ctx);
  }

  private route(suffix: string): string {
    return `/address-provision${suffix}`;
  }

  /** @deprecated `POST /address-provision` - currently fails with HTTP 503. */
  async create(
    params: CreateAddressProvisionParams,
  ): Promise<AddressProvisionCreateData> {
    const json = await merchantRequest<AddressProvisionCreatedResponse>({
      method: 'POST',
      path: this.route(''),
      body: params,
      ...this.transportOpts(),
    });
    if (!json?.data) {
      throw new TypeError('addressProvision.create: response missing `data`');
    }
    return json.data;
  }

  /** @deprecated `GET /address-provision` - currently fails with HTTP 503. */
  async get(q: GetAddressProvisionQuery): Promise<AddressProvisionGetData> {
    const { accountId, id } = q;
    const json = await merchantRequest<AddressProvisionGetResponse>({
      method: 'GET',
      path: this.route(''),
      query: { accountId, id },
      ...this.transportOpts(),
    });
    if (!json?.data) {
      throw new TypeError('addressProvision.get: response missing `data`');
    }
    return json.data;
  }
}
