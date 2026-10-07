import { Cryptonly } from '../client/cryptonly';
import { createFakeFetch } from './__test-helpers__/fake-fetch';

const BASE = 'https://api.test.example';

function buildClient(fetchImpl: typeof fetch) {
  return new Cryptonly({
    apiKey: 'sk_live_test',
    baseUrl: BASE,
    fetch: fetchImpl,
  });
}

const settlement = {
  id: '00000000-0000-4000-8000-000000000001',
  status: 'confirmed',
  network: 'eip155:84532',
  asset: '0x036CbD53842c5426634e7929541eC2318f3dCF7e',
  amount: '1000',
  payer: '0x857b06519E91e3A54538791bDbb0E22373e36b66',
  payTo: '0x209693Bc6afc0C5328bA36FaF03C514EF312287C',
  transaction: '0x' + 'ab'.repeat(32),
  errorReason: null,
  createdAt: '2026-10-03T00:00:00.000Z',
  confirmedAt: '2026-10-03T00:00:20.000Z',
};

describe('X402SettlementsClient', () => {
  it('lists with the merchant query and unwraps nothing', async () => {
    const fake = createFakeFetch();
    fake.setResponse({
      body: {
        data: [settlement],
        total: 1,
        page: 1,
        limit: 20,
        hasMore: false,
      },
    });
    const client = buildClient(fake.fetch);
    const page = await client.x402Settlements.list({
      status: 'confirmed',
      payer: settlement.payer,
    });

    expect(page.data).toEqual([settlement]);
    const request = fake.lastRequest();
    expect(request.method).toBe('GET');
    expect(request.url).toBe(
      `${BASE}/x402/settlements?status=confirmed&payer=${settlement.payer}`,
    );
    expect(request.headers['x-tenant-api-key']).toBe('sk_live_test');
  });

  it('gets one settlement from data', async () => {
    const fake = createFakeFetch();
    fake.setResponse({ body: { data: settlement } });
    const client = buildClient(fake.fetch);
    await expect(client.x402Settlements.get(settlement.id)).resolves.toEqual(
      settlement,
    );
    expect(fake.lastRequest().url).toBe(
      `${BASE}/x402/settlements/${settlement.id}`,
    );
  });
});
