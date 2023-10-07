export class GET_ACCESS_TOKEN {
  static readonly type = `GET ACCESS TOKEN`;
}

export class GET_AGENT_DETAIL {
  static readonly type = `GET AGENT DETAIL`;
  constructor(public readonly payload: any) { }
}

export class GET_AGENT_LOCATOR {
  static readonly type = `GET AGENT LOCATOR`;
  constructor(public readonly payload: any) { }
}

export class POST_CONTACT_AGENT {
  static readonly type = `POST CONTACT AGENT`;
  constructor(public readonly payload: any) { }
}

export class POST_REFERRED_RISK {
  static readonly type = `POST REFERRED RISK`;
  constructor(public readonly payload: any, public readonly productCode: string) { }
}

export class GET_LOV {
  static readonly type = `GET LOV`;
  constructor(public readonly PRODUCT_CAT: any, public readonly PARAMETERS: any) { }
}

export class GET_PRODUCT_CONFIG {
  static readonly type = `GET PRODUCT CONFIG`;
  constructor(public readonly PRODUCT_CAT: any) { }
}

export class GET_PRODUCT_CONFIG_PARAM {
  static readonly type = `GET_PRODUCT_CONFIG_PARAM`;
  constructor(public readonly PRODUCT_CAT: any, public readonly SOURCE_SYSTEM: any) { }
}

export class GET_POSTAL_CODES {
  static readonly type = `GET POSTCODE`;
}

export class GET_UNDERWRITING {
  static readonly type = `GET_UNDERWRITING`;
  constructor(public readonly PRODUCT_CAT: any, public readonly QUESTION_TYPE: any) { }
}

export class GET_CUSTOM_VIEW_OBJECT {
  static readonly type = `GET CUSTOM VIEW OBJECT`;
  constructor(public readonly payload: any) { }
}

export class GET_DYNAMIC_CONTENT {
  static readonly type = `GET DYNAMIC CONTENT`;
  constructor() { }
}

export class GET_SOURCE_SYSTEM {
  static readonly type = `GET_SOURCE_SYSTEM`;
  constructor(public readonly payload: any) { }
}
