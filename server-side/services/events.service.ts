import { Client } from "@pepperi-addons/debug-server";
import { PapiClient } from "@pepperi-addons/papi-sdk";
import { Event, CPI_NODE_ADDON_UUID, CLIENT_EVENT_MODULE_NAME, Configuration } from "../shared/entities";
import { toConfiguration, toEvent } from "../shared/conversions";
import { concat } from '@pepperi-addons/pepperi-filters';
import { ObjectsService } from "./objects.service";

export class EventsService {

    papiClient: PapiClient
    objectsService: ObjectsService

    constructor (private client: Client) {
        this.papiClient = new PapiClient({
            baseURL: client.BaseURL,
            token: client.OAuthAccessToken,
        });

        this.objectsService = new ObjectsService(this.papiClient);
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

        const res = configurations.map(toEvent);

        for (const event of res) {
            await this.updateFields(event);
        }

        return res;
    }

    async upsert(event: Event): Promise<Event> {
        let conf: any = {}

        // check if this row already exists
        if (event.UUID) {
            let events = await this.find({
                where: `UUID = '${event.UUID}'`,
                include_deleted: true
            });

            if (events.length == 0) {
                throw new Error(`Could not find event with UUID: ${event.UUID}`);
            }
        }

        return this.papiClient.addons.api
            .uuid(CPI_NODE_ADDON_UUID)
            .file('cpi_node')
            .func('configurations')
            .post({}, toConfiguration(event))
            .then(toEvent)
            .then(event => this.updateFields(event));
    }

    async getConfigurations(options: any): Promise<Configuration[]> {
        const res = await this.papiClient.addons.api.uuid(CPI_NODE_ADDON_UUID).file('cpi_node').func('configurations').get(options)
        return res.result;
    }

    async updateFields(event: Event): Promise<Event> {
        if (event.On.Object) {
            const atdId = event.On.Object.InternalID;
            const atd = await this.objectsService.getAtd(atdId);
            if (atd) {
                event.On.Object.Name = atd.SubTypeName;
                event.On.Object.Resource = atd.Type;

                if (event.On.Field) {
                    const field = await this.objectsService.getField(atdId, event.On.Field.FieldID);
                    if (field) {
                        event.On.Field.Name = field?.Label;
                    }
                }
            }
        }
        return event;
    }
}