import { pepperi } from '@pepperi-addons/cpi-node-core';

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
            Resource: string;
            InternalID?: number;
        };
    };
    Actions: EventAction[];
}

export interface EventAction {
    Type: string;
    ActionData: any;
}

export function load(configuration: any) {
    const object = configuration.On.Object;
    pepperi.events.on(configuration.On.Key)?.use(
        async (data, next, main) => {
            console.log(data);
        }
    );
}
