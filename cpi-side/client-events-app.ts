import '@pepperi-addons/cpi-node'
import config from '../addon.config.json';
import { Event } from '../shared/entities'

export async function load(configuration: any) {
    const events = await getEvents();
    console.log("Events: ", events);

    for (const event of events) {
        const key = event.On.Key;
        const hook = event.On.Hook;
        const run = runner(event);
        pepperi.events.on(key)?.use(async (data, next, main) => {
            let block = false; 

            if (hook === 'Before') {
                block = ((await run()) === false); 
            }
    
            if (hook === 'Main') {
                main = run;
            }

            await next(block ? null : main);
    
            if (hook === 'After') {
                await run();
            }
        });
    }
}

async function getEvents(): Promise<Event[]> {
    return await pepperi.adal.get(config.AddonUUID, 'Events');
}

function runner(event: Event): () => Promise<any> {
    return async () => {
        let res = undefined;

        switch (event.Action.Type) {
            case 'Script': {
                const AsyncFunction = Object.getPrototypeOf(async function () {
                    /* empty function */
                }).constructor;
                const code = event.Action.Code;
                const f = new AsyncFunction(code);
                res = await f();
                break;
            }
            default: {
                break;
            }
        }
        return res;
    };
}  