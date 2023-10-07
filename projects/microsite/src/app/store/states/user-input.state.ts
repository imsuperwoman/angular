import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import { QuoteProgessService } from '../../services/quote-progress.service';
import { UserInputStateModel, DEFAULTS } from '../model/user-input.model';
import { SET_STEP_1, SET_STEP_2, RESET_STEP, SET_STEP_3 } from '../actions/user-input.action';

@State<UserInputStateModel>({
  name: 'UserInputState',
  defaults: DEFAULTS,
})
@Injectable()
export class UserInputState {
  constructor(public quoteProgessService: QuoteProgessService, private _store: Store) { }

  @Selector()
  public static userInput(state: UserInputStateModel) {
    return state.userInput;
  }

  @Action(SET_STEP_1)
  public setStep1(
    { patchState, getState }: StateContext<UserInputStateModel>
  ) {
    const currentState = getState();

    return patchState({
      ...currentState,
      userInput: {
        ...currentState.userInput,
        step1: {},
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
      ...currentState,
      userInput: {
        ...currentState.userInput,
        step2: {
          payload
        },
      },
    });
  }

  @Action(RESET_STEP,)
  public absResetStep(
    { patchState, getState }: StateContext<UserInputStateModel>
  ) {
    const currentState = getState();

    return patchState({
      userInput: {
        ...currentState.userInput,
        step2: {
        },
        step3: {
          coverageDetails: {
          },
          policyholderDetails: {
          }
        }
      },
    });
  }

  @Action(SET_STEP_3)
  public setStep3(
    { patchState, getState }: StateContext<UserInputStateModel>,
    { coverageDetails, policyholderDetails }: SET_STEP_3
  ) {
    const currentState = getState();

    return patchState({
      ...currentState,
      userInput: {
        ...currentState.userInput,
        step3: {
          coverageDetails: coverageDetails,
          policyholderDetails: policyholderDetails
        }
      },
    });
  }
}
