export interface Event {
    UUID: string;
    CreationDate: string;
    ModificationDate: string;
    Hidden: boolean;
    Active: boolean;
    Description: string;
    On: {
        Key: string,
        Hook: string,
        Object?: {
            Resource: string;
            InternalID: number;
            Name: string;
        },
        Field?: {
            FieldID: string;
            Name: string;
        }
    },
    Action: {
        Type: 'Script',
        Code: string;
    }
}

export interface Configuration {
    UUID?: string;
    Module: string;
    Hidden?: boolean;
    CreationDate?: string;
    ModificationDate?: string;
    Data: any;
    Active: boolean;
}

export const CPI_NODE_ADDON_UUID = 'bb6ee826-1c6b-4a11-9758-40a46acb69c5';
export const CLIENT_EVENT_MODULE_NAME = '@pepperi-addons/client-events';