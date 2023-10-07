export class POST_VEHICLE_DETAILS {
  static readonly type = `POST_VEHICLE_DETAILS`;
  constructor(public readonly payload: any) { }
}

export class GET_DOCUMENTS_CONFIG {
  static readonly type = `GET DOCUMENTS CONFIG`;
  constructor() { }
}

export class GET_VALIDATE_ID {
  static readonly type = `GET VALIDATE ID`;
  constructor(public readonly payload: any) { }
}

export class GET_VALIDATE_VOUCHER {
  static readonly type = `GET VALIDATE VOUCHER`;
  constructor() { }
}

export class GET_AGENT_INFO {
  static readonly type = `GET AGENT INFO`;
  constructor() { }
}
export class MO_QUOTE_PROGRESS {
  static readonly type = `MO_QUOTE_PROGRESS`;
  constructor(public readonly user_journey: any, public readonly page: number, public readonly agent_payload: any) { }
}

export class MO_QUOTE {
  static readonly type = `MO_QUOTE`;
  constructor() { }
}

export class REFERED_RISK_DETAILS {
  static readonly type = `REFERED_RISK_DETAILS`;
  constructor(public readonly contractNo: any) { }
}

export class MO_CONTACT_AGENT {
  static readonly type = 'MO_CONTACT_AGENT';
  constructor(public readonly payload: any) { }
}

export class MO_CHECK_SANCTION {
  static readonly type = 'MO_CHECK_SANCTION';
  constructor(public readonly payload: any) { }
}

export class MO_QUALITY_CHECK {
  static readonly type = 'MO_QUALITY_CHECK';
  constructor(public readonly payload: any) { }
}

export class MAKE_LIST {
  static readonly type = `MAKE_LIST`;
  constructor() { }
}

export class PIAM {
  static readonly type = `PIAM`;
  constructor(public readonly MakeCode?: any) { }
}

export class MODEL_LIST {
  static readonly type = `MODEL_LIST`;
  constructor(public readonly avMakeCode?: any) { }
}

export class GET_SUMINSURED_LIST {
  static readonly type = `GET_SUMINSURED_LIST`;
  constructor() { }
}

export class MO_CHECKUBB {
  static readonly type = `MO_CHECKUBB`;
  constructor() { }
}

export class CHECK_USER_INFO {
  static readonly type = `CHECK_USER_INFO`;
  constructor(public readonly payload: any) { }
}

export class RESET_QUOTE_INFO {
  static readonly type = `RESET QUOTE INFO`;
  constructor() { }
}

export class GET_QUOTE_INFO {
  static readonly type = `GET QUOTE INFO`;
  constructor(public readonly referenceNumber: any) { }
}

export class CHECK_HSBC_CARD {
  static readonly type = `CHECK HSBC CARD`;
  constructor(public readonly cardNumber: any) { }
}