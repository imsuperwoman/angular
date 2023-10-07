export class MO_SET_STEP_1 {
  static readonly type = `MO_SET_STEP_1`;
  constructor(public readonly payload: any) { }
}

export class MO_SET_STEP_1_SELECTED {
  static readonly type = `MO_SET_STEP_1_SELECTED`;
  constructor(public readonly payload: any) { }
}

export class MO_RESET_STEP_1_SELECTED {
  static readonly type = `MO_RESET_STEP_1_SELECTED`;
  constructor() { }
}

export class MO_SET_STEP_2 {
  static readonly type = `MO_SET_STEP_2`;
  constructor(public readonly payload: any) { }
}
export class MO_SET_STEP_4 {
  static readonly type = `MO_SET_STEP_4`;
  constructor(public readonly payload: any) { }
}

export class MO_RESET_STEP_2 {
  static readonly type = `MO_RESET_STEP_2`;
  constructor() { }
}

export class MO_SET_STEP_3 {
  static readonly type = `MO_SET_STEP_3`;
  constructor(public payload: any) { }
}

export class MO_RESET_STEP_3 {
  static readonly type = `MO_RESET_STEP_3`;
  constructor() { }
}


