export class GET_QUOTE {
    static readonly type = `GET_QUOTE`;
    constructor(public readonly payload: any, public readonly PRODUCT_CAT: any) { }
}

export class QUOTE_PROGRESS {
    static readonly type = `QUOTE_PROGRESS`;
    constructor(public readonly user_journey: any, public readonly PRODUCT_CAT: any) { }
}

export class QUOTE_INFO {
    static readonly type = `QUOTE_INFO`;
    constructor(public readonly referenceNumber: any, public readonly PRODUCT_CAT: any) { }
}

export class FLOOD_PRONE_AREA {
    static readonly type = `FLOOD_PRONE_AREA`;
    constructor(public readonly postCode: any) { }
}