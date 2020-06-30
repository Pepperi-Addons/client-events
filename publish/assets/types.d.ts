declare type BasicOperations = 'IsEmpty' | 'IsNotEmpty' | 'IsEqual' | 'IsNotEqual';
declare type NumberOperation = BasicOperations | '=' | '>' | '>=' | '<' | '<=' | '!=' | 'Between';
declare type StringOperation = BasicOperations | 'Contains' | 'StartWith' | 'EndWith' | 'IsLoggedInUser';
declare type DateOperation = 'InTheLast' | 'Today' | 'ThisWeek' | 'ThisMonth' | 'Before' | 'After' | 'Between' | 'DueIn' | 'On' | 'NotInTheLast' | 'NotDueIn' | 'IsEmpty' | 'IsNotEmpty' | '=' | '!=' | '>=' | '>' | '<' | '<=';
declare type JSONBoolOperation = 'IsEqual';
declare type AnyOperation = NumberOperation | StringOperation | DateOperation;
declare type TimeUnit = 'Days' | 'Weeks' | 'Months' | 'Years';
declare type FieldType = 'Bool' | 'JsonBool' | 'Integer' | 'Double' | 'String' | 'Date' | 'DateTime' | 'MultipleStringValues' | 'Guid';
interface JSONComplexFilter {
    Operation: 'AND' | 'OR';
    RightNode: JSONFilter;
    LeftNode: JSONFilter;
}
interface JSONBaseFilter {
    FieldType: FieldType;
    ApiName: string;
    Operation: AnyOperation;
    Values: string[];
}
interface JSONBoolFilter extends JSONBaseFilter {
    FieldType: 'Bool';
}
interface JSONJsonBoolFilter extends JSONBaseFilter {
    FieldType: 'JsonBool';
    Operation: JSONBoolOperation;
}
interface JSONIntegerFilter extends JSONBaseFilter {
    FieldType: 'Integer';
    Operation: NumberOperation;
}
interface JSONDoubleFilter extends JSONBaseFilter {
    FieldType: 'Double';
    Operation: NumberOperation;
}
interface JSONStringFilter extends JSONBaseFilter {
    FieldType: 'String';
    Operation: StringOperation;
}
interface JSONDateTimeFilter extends JSONBaseFilter {
    FieldType: 'DateTime';
    Operation: DateOperation;
}
interface JSONDateFilter extends JSONBaseFilter {
    FieldType: 'Date';
    Operation: DateOperation;
}
interface JSONMultipleStringValuesFilter extends JSONBaseFilter {
    FieldType: 'MultipleStringValues';
    Operation: BasicOperations;
}
interface JSONGuidFilter extends JSONBaseFilter {
    FieldType: 'Guid';
    Operation: BasicOperations;
}
declare type JSONRegularFilter = JSONStringFilter | JSONBoolFilter | JSONJsonBoolFilter | JSONDateFilter | JSONDateTimeFilter | JSONGuidFilter | JSONMultipleStringValuesFilter | JSONIntegerFilter | JSONDoubleFilter;
declare type JSONFilter = JSONComplexFilter | JSONRegularFilter;

declare type TransactionIdentifier = {
    UUID: string;
} | {
    InternalID: number;
};
declare type ItemIdentifier = {
    UUID: string;
} | {
    InternalID: number;
} | {
    ExternalID: string;
};
declare type ObjectIdentifier = {
    UUID: string;
} | {
    InternalID: number;
};
declare type TypeIdentifier = {
    Name: string;
} | {
    InternalID: number;
};
declare type CatalogIdentifier = {
    Name: string;
} | {
    InternalID: number;
} | {
    UUID: string;
};
interface SearchParams<T extends string> {
    fields: T[];
    page?: number;
    pageSize?: number;
    filter?: JSONFilter;
    sorting?: {
        Field: string;
        Ascending: boolean;
    }[];
}
interface SearchResult<T extends string> {
    objects: {
        [K in T]: any;
    }[];
    count: number;
    page: number;
}
interface TransactionLinesSearchParams<T extends string> extends SearchParams<T> {
    transactionFilter?: JSONFilter;
}
interface OrderCenterSearchParams<T extends string> extends SearchParams<T> {
    transaction: TransactionIdentifier;
}
interface UpdateParams {
    objects: {
        UUID: string;
        [key: string]: any;
    }[];
    save?: boolean;
}
interface UpdateStatus {
    id: string;
    status: 'updated' | 'failed' | 'added' | 'deleted';
    message: string;
}
interface UpdateResult {
    result: UpdateStatus[];
}
interface OrderCenterUpdateParams {
    transaction: TransactionIdentifier;
    objects: {
        item: ItemIdentifier;
        [key: string]: any;
    }[];
    save?: boolean;
}
interface UDTGetParams {
    table: string;
    mainKey: string;
    secondaryKey: string;
    index?: number;
}
interface UDTGetResult {
    value: string;
}
interface UDTGetListParams {
    table: string;
    mainKey?: string;
    secondaryKey?: string;
}
interface UDTGetListResult {
    objects: {
        mainKey: string;
        secondaryKey: string;
        value: string;
    }[];
}
interface UDTUpsertParams {
    table: string;
    mainKey: string;
    secondaryKey: string;
    index?: number;
    value: string;
}
interface GetParams<T extends string> {
    fields: T[];
    key: ObjectIdentifier;
}
interface GetResult<T extends string> {
    object: {
        [K in T]: any;
    };
}
interface OrderCenterGetParams<T extends string> {
    transaction: TransactionIdentifier;
    item: ItemIdentifier;
    fields: T[];
}
interface OrderCenterGetResult<T extends string> {
    object: {
        [K in T]: any;
    };
}
interface CreateAccountParams {
    type?: TypeIdentifier;
    object?: {
        [key: string]: any;
    };
}
interface CreateContactParams {
    type?: TypeIdentifier;
    references: {
        account: ObjectIdentifier;
    };
    object?: {
        [key: string]: any;
    };
}
interface CreateActivityParams {
    type: TypeIdentifier;
    references: {
        account: ObjectIdentifier;
    };
    object?: {
        [key: string]: any;
    };
}
interface CreateTransactionParams {
    type: TypeIdentifier;
    references: {
        account: ObjectIdentifier;
        catalog?: CatalogIdentifier;
        originAccount?: ObjectIdentifier;
    };
    object?: {
        [key: string]: any;
    };
}
interface CreateResult extends UpdateStatus {
}
interface AddTransactionLinesParams {
    transaction: TransactionIdentifier;
    lines: {
        item: ItemIdentifier;
        leadingLine?: ObjectIdentifier;
        lineData: {
            [key: string]: any;
        };
    }[];
}
interface RemoveTransactionLinesParams {
    transaction: TransactionIdentifier;
    lines: ObjectIdentifier[];
}
declare const pepperi: {
    api: {
        transactions: {
            get: <T extends string>(params: GetParams<T>) => Promise<GetResult<T>>;
            update: (params: UpdateParams) => Promise<UpdateResult>;
            search: <T_1 extends string>(params: SearchParams<T_1>) => Promise<SearchResult<T_1>>;
            addLines: (params: AddTransactionLinesParams) => Promise<UpdateResult>;
            removeLines: (params: RemoveTransactionLinesParams) => Promise<UpdateResult>;
        };
        activities: {
            get: <T extends string>(params: GetParams<T>) => Promise<GetResult<T>>;
            update: (params: UpdateParams) => Promise<UpdateResult>;
            search: <T_1 extends string>(params: SearchParams<T_1>) => Promise<SearchResult<T_1>>;
        };
        accounts: {
            get: <T extends string>(params: GetParams<T>) => Promise<GetResult<T>>;
            update: (params: UpdateParams) => Promise<UpdateResult>;
            search: <T_1 extends string>(params: SearchParams<T_1>) => Promise<SearchResult<T_1>>;
        };
        transactionLines: {
            get: <T extends string>(params: GetParams<T>) => Promise<GetResult<T>>;
            update: (params: UpdateParams) => Promise<UpdateResult>;
            search: <T_1 extends string>(params: SearchParams<T_1>) => Promise<SearchResult<T_1>>;
        };
        users: {
            get: <T extends string>(params: GetParams<T>) => Promise<GetResult<T>>;
            search: <T_1 extends string>(params: SearchParams<T_1>) => Promise<SearchResult<T_1>>;
        };
        contacts: {
            get: <T extends string>(params: GetParams<T>) => Promise<GetResult<T>>;
            update: (params: UpdateParams) => Promise<UpdateResult>;
            search: <T_1 extends string>(params: SearchParams<T_1>) => Promise<SearchResult<T_1>>;
        };
        items: {
            get: <T extends string>(params: GetParams<T>) => Promise<GetResult<T>>;
            search: <T_1 extends string>(params: SearchParams<T_1>) => Promise<SearchResult<T_1>>;
        };
        catalogs: {
            get: <T extends string>(params: GetParams<T>) => Promise<GetResult<T>>;
            search: <T_1 extends string>(params: SearchParams<T_1>) => Promise<SearchResult<T_1>>;
        };
        allActivities: {
            search: <T_1 extends string>(params: SearchParams<T_1>) => Promise<SearchResult<T_1>>;
        };
        attachments: {
            get: <T extends string>(params: GetParams<T>) => Promise<GetResult<T>>;
            search: <T_1 extends string>(params: SearchParams<T_1>) => Promise<SearchResult<T_1>>;
        };
        userDefinedTables: {
            get: (params: UDTGetParams) => Promise<UDTGetResult>;
            upsert: (params: UDTUpsertParams) => Promise<UpdateResult>;
            getList: (params: UDTGetListParams) => Promise<UDTGetListResult>;
        };
        transactionScopeItems: {
            get: <T extends string>(params: GetParams<T>) => Promise<GetResult<T>>;
            search: <T_1 extends string>(params: SearchParams<T_1>) => Promise<SearchResult<T_1>>;
            update: (params: UpdateParams) => Promise<UpdateResult>;
        };
    };
    app: {
        transactions: {
            update: (params: UpdateParams) => Promise<UpdateResult>;
            add: (params: CreateTransactionParams) => Promise<CreateResult>;
            addLines: (params: AddTransactionLinesParams) => Promise<UpdateResult>;
            removeLines: (params: RemoveTransactionLinesParams) => Promise<UpdateResult>;
        };
        activities: {
            update: (params: UpdateParams) => Promise<UpdateResult>;
            add: (params: CreateActivityParams) => Promise<CreateResult>;
        };
        accounts: {
            update: (params: UpdateParams) => Promise<UpdateResult>;
            add: (params: CreateAccountParams) => Promise<CreateResult>;
        };
        transactionLines: {
            update: (params: UpdateParams) => Promise<UpdateResult>;
        };
        contacts: {
            update: (params: UpdateParams) => Promise<UpdateResult>;
            add: (params: CreateContactParams) => Promise<CreateResult>;
        };
        transactionScopeItems: {
            update: (params: UpdateParams) => Promise<UpdateResult>;
        };
    };
};
