import { Injectable } from '@angular/core';
import { Action, State, StateContext, Store } from '@ngxs/store';

import { QuoteProgessService } from '../../services/quote-progress.service';
import { RESET_SET_STEP_4, RESET_STEP_2, SET_STEP_1, SET_STEP_2, SET_STEP_3, SET_STEP_4 } from '../actions/user-input.action';
import { DEFAULTS, UserInputStateModel } from '../model/user-input.model';

@State<UserInputStateModel>({
  name: 'UserInputState',
  defaults: DEFAULTS,
})
@Injectable()
export class UserInputState {
  constructor(public quoteProgessService: QuoteProgessService, private _store: Store) { }

  @Action(SET_STEP_1)
  public setStep1(
    { patchState, getState }: StateContext<UserInputStateModel>,
    { payload }: SET_STEP_1
  ) {
    const currentState = getState();

    return patchState({
      userInput: {
        ...currentState.userInput,
        step1: payload
      },
    });
  }

  @Action(SET_STEP_2)
  public setStep2(
    { patchState, getState }: StateContext<UserInputStateModel>,
    { payload }: SET_STEP_2
  ) {
    const currentState = getState();

    return patchState({
      userInput: {
        ...currentState.userInput,
        step2: payload
      },
    });
  }

  @Action(RESET_STEP_2)
  public resetStep2({ patchState, getState }: StateContext<UserInputStateModel>) {
    const currentState = getState();

    return patchState({
      ...currentState,
      userInput: {
        ...currentState.userInput,
        step2: {
        }
      }
    })
  }


  @Action(SET_STEP_3)
  public setStep3(
    { patchState, getState }: StateContext<UserInputStateModel>,
    { payload }: SET_STEP_3
  ) {
    const currentState = getState();

    return patchState({
      userInput: {
        ...currentState.userInput,
        step3: payload
      },
    });
  }

  @Action(SET_STEP_4)
  public setStep4(
    { patchState, getState }: StateContext<UserInputStateModel>,
    { payload }: SET_STEP_4
  ) {
    const currentState = getState();

    return patchState({
      userInput: {
        ...currentState.userInput,
        step4: payload
      },
    });
  }

  @Action(RESET_SET_STEP_4)
  public resetStep4(
    { patchState, getState }: StateContext<UserInputStateModel>,
    { payload }: SET_STEP_4
  ) {
    const currentState = getState();

    return patchState({
      userInput: {
        ...currentState.userInput,
        step4: {}
      },
    });
  }


}
