import { PepperiObject, ApiFieldObject, PapiClient } from "@pepperi-addons/papi-sdk";

export class ObjectsService {
    
    private pepperiObjects: PepperiObject[] = []
    private fields: { [key: number]: ApiFieldObject[] } = {}

    constructor(private papiClient: PapiClient) {

    }

    getAtd(id: number): Promise<PepperiObject | undefined>;
    getAtd(name: string): Promise<PepperiObject | undefined>;
    async getAtd(by: number | string): Promise<PepperiObject | undefined> {
        if (!this.pepperiObjects.length) {
            this.pepperiObjects = await this.papiClient.metaData.pepperiObjects.iter().toArray();
        }

        return this.pepperiObjects.find(atd => {
            if (typeof by === 'number') {
                return by === parseInt(atd.SubTypeID);
            }
            else if (typeof by === 'string') {
                return by === atd.SubTypeName;
            }
        })
    }

    async getField(atdId: number, fieldId: string): Promise<ApiFieldObject | undefined> {
        const atd = await this.getAtd(atdId);
        if (atd) {
            if (!this.fields[atdId]) {
                this.fields[atdId] = await this.papiClient.metaData.type(atd.Type).fields.get();
            }
        }

        return this.fields[atdId].find(field => field.FieldID === fieldId)
    }
}