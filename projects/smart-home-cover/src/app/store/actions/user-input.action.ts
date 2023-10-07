export class SET_STEP_1 {
  static readonly type = `SET_STEP_1`;
  constructor(public readonly payload: any) { }
}

export class RESET_SET_STEP_1 {
  static readonly type = `RESET_SET_STEP_1`;
  constructor() { }
}

export class RESET_SET_STEP_2 {
  static readonly type = `RESET_SET_STEP_2`;
  constructor() { }
}

export class SET_STEP_2 {
  static readonly type = `SET_STEP_2`;
  constructor(public readonly payload: any) { }
}
export class SET_STEP_2_POLICY_NO {
  static readonly type = `SET STEP 2 POLICY NO`;
  constructor(public readonly payload: any) { }
}
export class SET_STEP_2_ALIM_POLICY_NO {
  static readonly type = `SET STEP 2 ALIM POLICY NO`;
  constructor(public readonly payload: any) { }
}
export class RESET_STEP_2_POLICY_NO {
  static readonly type = `RESET STEP 2 POLICY NO`;
  constructor() { }
}
export class RESET_STEP_2_ALIM_POLICY_NO {
  static readonly type = `RESET STEP 2 ALIM POLICY NO`;
  constructor() { }
}


export class SET_STEP_3 {
  static readonly type = `SET_STEP_3`;
  constructor(
    public readonly propertyDetails: any,
    public readonly customerDetails: any,
    public readonly jointNames: any,
    public readonly financialDetails: any
  ) { }
}

export class RENEWAL_FORM_ACTION {
  static readonly type = `RENEWAL_FORM_ACTION`;
  constructor(public readonly payload: any) { }
}

export class CREATED_FAILED {
  static readonly type = `CREATED_FAILED`;
  constructor(public readonly payload: any) { }
}


export class GET_COVERAGE_DETAILS {
  static readonly type = `GET_COVERAGE_DETAILS`;
  constructor(public readonly payload: any) { }
}


