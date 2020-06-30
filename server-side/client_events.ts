import { Client, Request } from '@pepperi-addons/debug-server'
import { EventsService } from './services/events.service'

export async function events(client: Client, request: Request) {
    const service = new EventsService(client)

    if (request.method == 'POST') {
        return service.upsert(request.body);
    }
    else if (request.method == 'GET') {
        return { result: await service.find(request.query) };
    }
};

export async function test(client: Client) {
  const service = new EventsService(client);
  return service.papiClient.metaData.type('transactions').fields.get('ActionDateTime');
}