//@ts-ignore
import { JsonFilter } from 'pepperi-utilities-service'
// @ts-ignore
import { DialogDataType} from 'pepperi-dialog';
// @ts-ignore


export class AddonsListSearch {
    SortBy: string
    Asc: boolean
    UUID: string
    ListType: string = 'all'
}

export class PluginJsonFilter {
    ExpressionId: number = 1;
    ComplexId: number;
    ApiName: string = '';
    Operation: string = '';
    Values: string[] = [];
    FieldType: string = '';
    constructor(init?:Partial<PluginJsonFilter>) {
        Object.assign(this, init);
    }

    initFromObj(obj: PluginJsonFilter) {
        if (obj) {
            this.ExpressionId = obj.ExpressionId;
            this.ApiName = obj.ApiName;
            this.Operation = obj.Operation;
            this.FieldType = obj.FieldType

            if (this.Values != obj.Values) {
                this.Values = [];
                if (obj.Values) {
                    obj.Values.forEach(value => this.Values.push(value));
                }
            }
        }
    }

    Valid(): boolean {

        return this.Operation != "" && this.ApiName != "";
    }

}

export class FooBar {
    client: FooClient;
    hello: string;
    request: FooRequest;
}

export class FooClient {
    AddonUUID: string;
    BaseURL: string;
    Module: any;
    OAuthAccessToken: string;
}

export class FooRequest {
    body: any;
    query: any;
}

export class KeyValuePair<T> {
    Key: number;
    Value: T;
}

export class SystemData{
    Versions?: string[];
    EnableKey?: string;
    AngularPlugin?: boolean;
    EditorName?: string;

}

export enum AddonType {
    System = 1,
    Public = 2,
    Distributor = 3,
    Dev = 4
}

export class Addon {
    UUID: string;
    Name: string;
    Description: string;
    SystemData: any;

    // CreationDate: string;
    // ModificationDate: string;
    Hidden: boolean;
    Type: number;
    constructor(uuid = '', name: any = '', description = '', systemData =  {Versions: []}) {
        this.UUID = uuid;
        this.Name = name;
        this.Description = description;
        this.SystemData = systemData;

    }
}

export class InstalledAddon {
    UUID: string;
    Addon: Addon;
    Version?: string;
    SystemData?: SystemData;
    // CreationDate: string;
    // ModificationDate: string;
    AdditionalData: string;
    Hidden: string;
    constructor(uuid = '', addon: Addon = null, additionalData = '{}', systemData =  {Versions: []}) {
        this.UUID = uuid;
        this.Addon = name;
        this.AdditionalData = additionalData;
        this.SystemData = systemData;
    }
}

export class AdditionalData {
    Addons: Addon[];
}

export class DialogModel {
    title = '';
    content: any;
    contentType: DialogDataType = DialogDataType.Text;
    actionButtons: Array<ActionButton> = [];
    contentData?: any;
    showLoadingSpinner: boolean;
    useHeader = false;
    useFooter = false;


    constructor(title = '', content: any = '', contentType = DialogDataType.Text, actionButtons: Array<ActionButton> = [], contentData = {},
        showLoadingSpinner = false, useHeader = false, useFooter = false) {
        this.title = title;
        this.content = content;
        this.contentType = contentType;
        this.actionButtons = actionButtons;
        this.contentData = contentData;
        this.showLoadingSpinner = showLoadingSpinner;
        this.useHeader = useHeader;
        this.useFooter = useFooter;
    }
  }

export class ActionButton {
    title;
    callback;
    className;
    icon;

    constructor(title = '', callback = null, className = '', icon = '') {
        this.title = title;
        this.callback = callback;
        this.className = className;
        this.icon = icon;
    }
}


export interface DataRowField {

    ApiName: string;
    FormattedValue: string;
    Value: string;
    FieldType: number;
    ColumnWidth: number;
    XAlignment: number;
    Title: string;
    AdditionalValue: any;
    OptionalValues: any;

}
