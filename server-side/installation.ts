import { PapiClient } from '@pepperi-addons/papi-sdk'
import { Client, Request } from '@pepperi-addons/debug-server/dist'
import { CPI_NODE_ADDON_UUID } from './shared/entities'
import config from '../addon.config.json'

exports.install = async (client: Client, request: Request) => {
    const papiClient = new PapiClient({
        baseURL: client.BaseURL,
        token: client.OAuthAccessToken,
    });

    await papiClient.addons.api.uuid(CPI_NODE_ADDON_UUID).file('cpi_node').func('files').post({},{
        AddonUUID: config.AddonUUID,
        Files: ['client-events-app.js'],
        Version: request.body.ToVersion
    })

    return {success:true,resultObject:{}}
}

exports.uninstall = async (client: Client, request: Request) => {
    return {success:true,resultObject:{}}
}
exports.upgrade = async (client: Client, request: Request) => {
    const papiClient = new PapiClient({
        baseURL: client.BaseURL,
        token: client.OAuthAccessToken,
    });

    await papiClient.addons.api.uuid(CPI_NODE_ADDON_UUID).file('cpi_node').func('files').post({},{
        AddonUUID: config.AddonUUID,
        Files: ['client-events-app.js'],
        Version: request.body.ToVersion
    })
    return {success:true,resultObject:{}}
}
exports.downgrade = async (client: Client, request: Request) => {
    return {success:true,resultObject:{}}
}