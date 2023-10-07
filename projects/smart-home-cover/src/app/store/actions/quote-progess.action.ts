export class CALCULATOR {
  static readonly type = `CALCULATOR`;
  constructor(public readonly payload: any) { }
}

export class RESET_CALCULATOR {
  static readonly type = `RESET CALCULATOR`;
  constructor() { }
}

export class BASIC_PROPERTY_DETAILS {
  static readonly type = `BASIC_PROPERTY_DETAILS`;
  constructor() { }
}

export class PLAN_RECOMMENDATION {
  static readonly type = `PLAN_RECOMMENDATION`;
  constructor() { }
}
export class ALIM_POLICY_ENQUIRY {
  static readonly type = `ALIM_POLICY_ENQUIRY`;
  constructor(public readonly payload: any) { }
}

export class CREATED_FAILED {
  static readonly type = `CREATED_FAILED`;
  constructor(public readonly payload: any) { }
}

export class REFRESH_QUOTE {
  static readonly type = `REFRESH_QUOTE`;
  constructor(public readonly payload: any = {}) { }
}

export class QUOTE_DETAILS {
  static readonly type = `QUOTE_DETAILS`;
  constructor() { }
}

export class QUOTE_PROGRESS {
  static readonly type = `QUOTE_PROGRESS`;
  constructor(public readonly quotationProgress: any, public readonly agent: any = {}) { }
}

export class EPOLICY_INQUIRY {
  static readonly type = `EPOLICY_INQUIRY`;
  constructor(public readonly payload: any = {}) { }
}

export class PUT_CUSTOMER_DETAILS {
  static readonly type = `PROPERTY DETAILS`;
  constructor() { }
}

export class DO_SANCTION_CHECKING {
  static readonly type = `DO SANCTION CHECKING`;
  constructor(public readonly customerDetails: any, public readonly combinedNames: any, public readonly quotationNumber: any) { }
}

export class CHECK_USER_INFO {
  static readonly type = `CHECK USER INFO`;
  constructor(public readonly payload: any) { }
}

export class CHECK_HSBC_CARD {
  static readonly type = `CHECK HSBC CARD`;
  constructor(public readonly cardNumber: any) { }
}

export class GET_QUOTE_INFO {
  static readonly type = `GET QUOTE INFO`;
  constructor(public readonly referenceNumber: any) { }
}

export class RESET_QUOTE_INFO {
  static readonly type = `RESET QUOTE INFO`;
  constructor() { }
}

export class GET_BUNDLE_CONFIG {
  static readonly type = `GET BUNDLE CONFIG`;
  constructor(public readonly PRODUCT_CAT: any) { }
}

export class GET_DOCUMENTS_CONFIG {
  static readonly type = `GET DOCUMENTS CONFIG`;
  constructor() { }
}