export class GET_DOCUMENTS_CONFIG {
  static readonly type = `GET DOCUMENTS CONFIG`;
  constructor() { }
}

export class PLAN_RECOMMENDATION {
  static readonly type = `PLAN_RECOMMENDATION`;
  constructor(public readonly user_journey: any, public readonly step: number) { }
}

export class PROMO_PLAN_RECOMMENDATION {
  static readonly type = `PROMO_PLAN_RECOMMENDATION`;
  constructor(public readonly user_journey: any, public readonly step: number) { }
}

export class RESET_PROMO_PLAN_RECOMMENDATION {
  static readonly type = `RESET_PROMO_PLAN_RECOMMENDATION`;
  constructor() { }
}

export class JOURNEY_TRAVELLER_DETAILS {
  static readonly type = `JOURNEY_TRAVELLER_DETAILS`;
  constructor(public readonly user_journey: any, public readonly step: number) { }
}

export class QUOTE_PROGRESS_CHECKOUT {
  static readonly type = `QUOTE_PROGRESS_CHECKOUT`;
  constructor(public readonly user_journey: any, public readonly step: number, public readonly renew: boolean,
    public readonly premiumPayable: any) { }
}

export class QUOTE_PROGRESS {
  static readonly type = `QUOTE_PROGRESS`;
  constructor(public readonly user_journey: any, public readonly step: number) { }
}

export class PROMO_LIST {
  static readonly type = `PROMO_LIST`;
  constructor() { }
}


export class GET_VALIDATE_VOUCHER {
  static readonly type = `GET VALIDATE VOUCHER`;
  constructor() { }
}

export class CHECK_HSBC_CARD {
  static readonly type = `CHECK HSBC CARD`;
  constructor(public readonly cardNumber: any) { }
}

export class CHECK_USER_INFO {
  static readonly type = `CHECK USER INFO`;
  constructor(public readonly payload: any) { }
}

export class DO_SANCTION_CHECKING {
  static readonly type = `DO SANCTION CHECKING`;
  constructor(public readonly customerDetails: any, public readonly combinedNames: any,
    public readonly quotationNumber: any, public readonly role: any,) { }
}

export class RESET_PLAN_RECOMMENDATION {
  static readonly type = `RESET_PLAN_RECOMMENDATION`;
  constructor() { }
}

export class RESET_QUOTE_INFO {
  static readonly type = `RESET QUOTE INFO`;
  constructor() { }
}

export class GET_QUOTE_INFO {
  static readonly type = `GET QUOTE INFO`;
  constructor(public readonly referenceNumber: any) { }
}

