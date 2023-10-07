export class SET_STEP_1 {
    static readonly type = `SET_STEP_1`;
    constructor(public readonly payload: any) { }
}

export class SET_STEP_2 {
    static readonly type = `SET_STEP_2`;
    constructor(public readonly payload: any) { }
}

export class RESET_STEP {
    static readonly type = `RESET_STEP`;
    constructor() { }
}

export class SET_STEP_3 {
    static readonly type = `SET_STEP_3`;
    constructor(public coverageDetails: any, public policyholderDetails: any) { }
}