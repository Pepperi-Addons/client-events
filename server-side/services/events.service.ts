import { Client } from "@pepperi-addons/debug-server";
import { PapiClient } from "@pepperi-addons/papi-sdk";
import { Event } from "../entities/event";
import { concat } from '@pepperi-addons/pepperi-filters';

const CPI_NODE_ADDON_UUID = 'bb6ee826-1c6b-4a11-9758-40a46acb69c5';
const CLIENT_EVENT_MODULE_NAME = '@pepperi-addons/client-events';

export class EventsService {

    papiClient: PapiClient

    constructor (private client: Client) {
        this.papiClient = new PapiClient({
            baseURL: client.BaseURL,
            token: client.OAuthAccessToken
        });
    }

    getEvent(configuration: any): Event {
        return {
            UUID: configuration.UUID,
            CreationDate: configuration.CreationDate,
            ModificationDate: configuration.ModificationDate,
            Hidden: configuration.Hidden,
            Active: configuration.Active,
            On: configuration.Data.On,
            Actions: configuration.Data.Actions
        }
    }

    async find(options: any = {}): Promise<Event[]> {
        let configurations = await this.getConfigurations({
            where: concat(
                true,
                `Module = '${CLIENT_EVENT_MODULE_NAME}'`,
                options.where
            ),
            include_deleted: options.include_deleted || false,
        });

        return configurations.map(this.getEvent);
    }

    async upsert(event: Event): Promise<Event> {
        let conf: any = {}

        // check if this row already exists
        if (event.UUID) {
            let events = await this.find({
                where: `UUID = ${event.UUID}`,
                include_deleted: true
            });

            if (events.length == 0) {
                throw new Error(`Could not find event with UUID: ${event.UUID}`);
            }
        }

        let configuration: any = {
            Module: CLIENT_EVENT_MODULE_NAME,
            Active: event.Active === false ? false : true,
            Hidden: event.Hidden || false,
            Data: {
                On: event.On,
                Actions: event.Actions
            }
        }

        if (event.UUID) {
            configuration.UUID = event.UUID
        }

        return this.papiClient.addons.api
            .uuid(CPI_NODE_ADDON_UUID)
            .file('cpi_node')
            .func('configurations')
            .post({}, configuration)
            .then(this.getEvent);
    }

    async getConfigurations(options: any) {
        const res = await this.papiClient.addons.api.uuid(CPI_NODE_ADDON_UUID).file('cpi_node').func('configurations').get(options)
        return res.result;
    }
}