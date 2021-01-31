import { Client } from "@pepperi-addons/debug-server";
import { PapiClient } from "@pepperi-addons/papi-sdk";
import { Event, CPI_NODE_ADDON_UUID, CLIENT_EVENT_MODULE_NAME, Configuration } from "../shared/entities";
import config from '../../addon.config.json';

export class EventsService {

    papiClient: PapiClient

    constructor (private client: Client) {
        this.papiClient = new PapiClient({
            baseURL: client.BaseURL,
            token: client.OAuthAccessToken,
        });
    }

    async find(options: any = {}): Promise<Event[]> {
        return this.papiClient.addons.api.uuid(CPI_NODE_ADDON_UUID).file('cpi_node').func('cpi_side_data').get({
            addon_uuid: config.AddonUUID,
            table: 'Events',
            ...options
        })
    }

    async upsert(event: Event): Promise<Event> {
        return this.papiClient.addons.api.uuid(CPI_NODE_ADDON_UUID).file('cpi_node').func('cpi_side_data').post({
            addon_uuid: config.AddonUUID,
            table: 'Events'
        }, event);
    }
}