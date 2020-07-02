import { pepperi } from '@pepperi-addons/cpi-node-core';

export function load(event: any) {
    const key = event.On.Key;
    const hook = event.On.Hook;

    const run = async () => {
        return Promise.all(
            event.Actions.map((action: { Type: any; ActionData: any }) => {
                return new Promise(async (resolve) => {
                    switch (action.Type) {
                        case 'Script': {
                            const AsyncFunction = Object.getPrototypeOf(async function () {
                                /* empty function */
                            }).constructor;
                            const code = action.ActionData.Code;
                            const f = new AsyncFunction('pepperi', code);
                            await f(pepperi);

                            resolve();

                            break;
                        }
                        default: {
                            resolve();
                            break;
                        }
                    }
                });
            }),
        );
    };

    pepperi.events.on(key)?.use(async (data, next, main) => {
        if (hook === 'Before') {
            await run();
        }

        if (hook === 'Main') {
            main = {
                run: async () => {
                    await run();
                },
            };
        }

        await next(main);

        if (hook === 'After') {
            await run();
        }
    });
}
