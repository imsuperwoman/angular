import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import {
  MO_RESET_STEP_2,
  MO_SET_STEP_1,
  MO_SET_STEP_2,
  MO_SET_STEP_4,
  MO_SET_STEP_3,
  MO_RESET_STEP_3,
  MO_SET_STEP_1_SELECTED,
  MO_RESET_STEP_1_SELECTED
} from '../actions/user-input.action';
import {
  DEFAULTS,
  UserInputStateModel,
} from '../model/user-input.model';
import { QuoteProgessService } from '../../services/quote-progress.service';
import * as moment from 'moment';

@State<UserInputStateModel>({
  name: 'UserInputState',
  defaults: DEFAULTS,
})
@Injectable()
export class UserInputState {
  constructor(public quoteProgessService: QuoteProgessService, private _store: Store) { }

  @Selector()
  public static plateNumber(state: UserInputStateModel) {
    return state.userInput.step1.plateNumber;
  }

  @Selector()
  public static step3(state: UserInputStateModel) {
    return state.userInput.step3;
  }
  @Action(MO_SET_STEP_1_SELECTED)
  public moSetStep1Selected(
    { patchState, getState }: StateContext<UserInputStateModel>,
    { payload }: MO_SET_STEP_1_SELECTED
  ) {
    const currentState = getState();

    return patchState({
      userInput: {
        ...currentState.userInput,
        selected: payload
      },
    });
  }

  @Action(MO_SET_STEP_1)
  public moSetStep1(
    { patchState, getState }: StateContext<UserInputStateModel>,
    { payload }: MO_SET_STEP_1
  ) {
    const currentState = getState();

    return patchState({
      userInput: {
        ...currentState.userInput,
        step1: {
          idNo: payload.idNo.replaceAll('-', ''),
          idType: payload.idType ? payload.idType : '',
          plateNumber: payload.plateNumber ? payload.plateNumber : '',
          postcode: payload.postcode ? payload.postcode : '',
          gender: payload.gender,
          dob: payload.dob ? moment(payload.dob).format('YYYY-MM-DD') : ''
        },
      },
    });
  }

  @Action(MO_RESET_STEP_1_SELECTED)
  public moResetStep1selected(
    { patchState, getState }: StateContext<UserInputStateModel>
  ) {
    const currentState = getState();

    return patchState({
      userInput: {
        ...currentState.userInput,
        selected: '',
      },
    });
  }

  @Action(MO_SET_STEP_2)
  public moSetStep2(
    { patchState, getState }: StateContext<UserInputStateModel>,
    { payload }: MO_SET_STEP_2
  ) {
    const currentState = getState();

    return patchState({
      userInput: {
        ...currentState.userInput,
        step2: payload
      },
    });
  }
  @Action(MO_SET_STEP_4)
  public moSetStep4(
    { patchState, getState }: StateContext<UserInputStateModel>,
    { payload }: MO_SET_STEP_4
  ) {
    const currentState = getState();

    return patchState({
      userInput: {
        ...currentState.userInput,
        step4: payload
      },
    });
  }

  @Action(MO_RESET_STEP_2)
  public moRESetStep2(
    { patchState, getState }: StateContext<UserInputStateModel>
  ) {
    const currentState = getState();

    return patchState({
      userInput: {
        ...currentState.userInput,
        step2: {}
      },
    });
  }

  @Action(MO_SET_STEP_3)
  public moSetStep3(
    { patchState, getState }: StateContext<UserInputStateModel>,
    { payload }: MO_SET_STEP_3
  ) {
    const currentState = getState();

    return patchState({
      userInput: {
        ...currentState.userInput,
        step3: payload
      },
    });
  }

  @Action(MO_RESET_STEP_3)
  public moResetetStep3(
    { patchState, getState }: StateContext<UserInputStateModel>
  ) {
    const currentState = getState();

    return patchState({
      userInput: {
        ...currentState.userInput,
        step3: {}
      },
    });
  }
}
