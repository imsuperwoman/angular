export class SET_STEP_1 {
  static readonly type = `SET_STEP_1`;
  constructor(public readonly payload: any) { }
}

export class SET_STEP_2 {
  static readonly type = `SET_STEP_2`;
  constructor(public readonly payload: any) { }
}

export class SET_STEP_3 {
  static readonly type = `SET_STEP_3`;
  constructor(public readonly payload: any) { }
}

export class SET_STEP_4 {
  static readonly type = `SET_STEP_4`;
  constructor(public readonly payload: any) { }
}

export class RESET_STEP_2 {
  static readonly type = `RESET_STEP_2`;
  constructor() { }
}

export class RESET_SET_STEP_4 {
  static readonly type = `RESET_SET_STEP_4`;
  constructor() { }
}


