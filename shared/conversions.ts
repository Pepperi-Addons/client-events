import { Event, Configuration, CLIENT_EVENT_MODULE_NAME } from './entities';

export function toConfiguration(event: Event): Configuration {
    return {
        UUID: event.UUID,
        Module: CLIENT_EVENT_MODULE_NAME,
        Active: event.Active === false ? false : true,
        Hidden: event.Hidden || false,
        Data: {
            On: event.On,
            Action: event.Action,
            Description: event.Description
        }
    }
}

export function toEvent(configuration: Configuration): Event {
    return {
        UUID: configuration.UUID || '',
        CreationDate: configuration.CreationDate || '',
        ModificationDate: configuration.ModificationDate || '',
        Hidden: configuration.Hidden || false,
        Active: configuration.Active,
        On: configuration.Data.On,
        Action: configuration.Data.Action,
        Description: configuration.Data.Description
    }
}
