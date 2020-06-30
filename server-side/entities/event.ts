import { ResourceType } from "@pepperi-addons/papi-sdk";

export const EventHookTypes = ['Before', 'After', 'Main'] as const;
export type EventHookType = typeof EventHookTypes[number];

export interface Event {
    UUID?: string;
    CreationDate?: string;
    ModificationDate?: string;
    Hidden?: boolean;
    Active?: boolean;
    On: {
        Key: string;
        Hook: EventHookType;
        Object?: {
            Resource: ResourceType;
            InternalID?: number;
            Name?: string;
        };
    },
    Actions: EventAction[]
}

export interface EventAction {
    Type: string,
    ActionData: any
}