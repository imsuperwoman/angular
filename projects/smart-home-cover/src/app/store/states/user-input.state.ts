import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import {
  GET_COVERAGE_DETAILS,
  RENEWAL_FORM_ACTION,
  RESET_SET_STEP_2,
  SET_STEP_1,
  SET_STEP_2,
  SET_STEP_2_POLICY_NO,
  SET_STEP_2_ALIM_POLICY_NO,
  SET_STEP_3,
  RESET_STEP_2_POLICY_NO,
  RESET_STEP_2_ALIM_POLICY_NO,
  RESET_SET_STEP_1
} from '../actions/user-input.action';
import {
  DEFAULTS,
  RENEWAL_CHILD,
  RENEWAL_ITEM,
  UserInputStateModel,
} from '../model/user-input.model';
import { QuoteProgessService } from '../../services/quote-progress.service';
import { map } from 'rxjs';
import * as MDL from '../model/coverage-details.model';

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

  @Selector()
  public static renewalResponse(state: UserInputStateModel) {
    return state.renewalResponse;
  }

  @Selector()
  public static epolicyInquiry(state: any) {
    return state.userInput.step2.epolicyInquiry;
  }

  @Selector()
  public static eligibleLock(state: any) {
    return state.userInput.step2.epolicyInquiry.eligibleLock;
  }

  @Selector()
  public static eligibleDiscount(state: any) {
    var result = state.userInput.step2.epolicyInquiry.eligibleDiscount || state.userInput.step2.alimPolicyInquiry.alimCustomerInd;
    return result;

  }

  @Selector()
  public static coverageType(state: UserInputStateModel) {
    return state.userInput.step1.CoverageType;
  }

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
        ,
      },
    });
  }

  @Action(RESET_SET_STEP_1)
  public resetStep1({ patchState, getState }: StateContext<UserInputStateModel>) {
    const currentState = getState();

    return patchState({
      ...currentState,
      userInput: {
        ...currentState.userInput,
        step1: {
        },
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
          ...currentState.userInput.step2,
          mainData: payload,
          epolicyInquiry: {
            ...currentState.userInput.step2.epolicyInquiry,
            policyNo: currentState.userInput.step2?.epolicyInquiry.policyNo == undefined ? '' : currentState.userInput.step2?.epolicyInquiry.policyNo
          }
        },
      },
    });
  }

  @Action(RESET_SET_STEP_2)
  public resetStep2({ patchState, getState }: StateContext<UserInputStateModel>) {
    const currentState = getState();

    return patchState({
      ...currentState,
      userInput: {
        ...currentState.userInput,
        step2: {
          mainData: {},
          epolicyInquiry: {},
          alimPolicyInquiry: {}
        },
      },
    });
  }

  @Action(SET_STEP_2_POLICY_NO)
  public setStep2PolicyNo(
    { patchState, getState }: StateContext<UserInputStateModel>,
    { payload }: SET_STEP_2_POLICY_NO
  ) {
    const currentState = getState();
    return patchState({
      ...currentState,
      userInput: {
        ...currentState.userInput,
        step2: {
          ...currentState.userInput.step2,
          mainData: currentState.userInput.step2.mainData,
          epolicyInquiry: {
            ...payload,
            eligibleLock: true,
            eligibleDiscount: Boolean(payload.policyNo)
          }
        },
      }
    });
  }

  @Action(SET_STEP_2_ALIM_POLICY_NO)
  public setStep2AlimPolicyNo(
    { patchState, getState }: StateContext<UserInputStateModel>,
    { payload }: SET_STEP_2_ALIM_POLICY_NO
  ) {
    const currentState = getState();
    return patchState({
      ...currentState,
      userInput: {
        ...currentState.userInput,
        step2: {
          ...currentState.userInput.step2,
          mainData: currentState.userInput.step2.mainData,
          epolicyInquiry: currentState.userInput.step2.epolicyInquiry,
          alimPolicyInquiry: {
            ...payload,
            alimPolicyNo: payload.alimPolicyNo,
            alimCustomerInd: payload.alimCustomerInd
          }
        },
      }
    });
  }

  @Action(SET_STEP_3)
  public setStep3(
    { patchState, getState }: StateContext<UserInputStateModel>,
    { propertyDetails, customerDetails, jointNames, financialDetails }: SET_STEP_3
  ) {
    const currentState = getState();

    return patchState({
      ...currentState,
      userInput: {
        ...currentState.userInput,
        step3: {
          propertyDetails: {
            startDate: propertyDetails.startDate,
            endDate: propertyDetails.endDate,
          },
          customerDetails: {
            fullName: customerDetails.fullName,
            idType: customerDetails.idType,
            idNo: customerDetails.idNo,
            dob: customerDetails.dob,
            gender: customerDetails.gender,
            nationality: customerDetails.nationality,
            phoneCountryCode: customerDetails.phoneCountryCode,
            phoneNo: customerDetails.phoneNo,
            email: customerDetails.email,
            postCode: customerDetails.correspondenceDetails.postCode,
            city: customerDetails.correspondenceDetails.city,
            state: customerDetails.correspondenceDetails.state,
            cityCode: customerDetails.correspondenceDetails.cityCode,
            stateCode: customerDetails.correspondenceDetails.stateCode,
            staffId: customerDetails.staffId ? customerDetails.staffId : '',
            cardNo: customerDetails.cardNo ? customerDetails.cardNo : '',
            cardNoSecond: customerDetails.cardNoSecond ? customerDetails.cardNoSecond : '',
            cardNoThird: customerDetails.cardNoThird ? customerDetails.cardNoThird : '',
            address1: customerDetails.correspondenceDetails.address1,
            address2: customerDetails.correspondenceDetails.address2,
            address3: customerDetails.correspondenceDetails.address3,
            addressnumber: customerDetails.correspondenceDetails.addressnumber,
            country: customerDetails.correspondenceDetails.country,
            viewport: customerDetails.correspondenceDetails.viewport,
            plusCode: customerDetails.correspondenceDetails.plusCode,
            placeId: customerDetails.correspondenceDetails.placeId
          },
          jointNames: jointNames,
          mortgage: financialDetails,
        },
      },
    });
  }


  @Action(RENEWAL_FORM_ACTION)
  public renewalFormAction(
    { patchState }: StateContext<UserInputStateModel>,
    { payload }: RENEWAL_FORM_ACTION
  ) {
    var productCode = this._store.selectSnapshot(
      (state) => state.GeneralState.productConfig.ProductCode
    );
    var data = {
      lob: 'FI',
      idType: payload.idType,
      idValue: payload.id.replaceAll('-', ''),
      vehNo: '',
      postCode: payload.postCode,
      productCode: productCode,
    };

    return this.quoteProgessService.postRenewalPolicies(data).pipe(
      map((res: any) => {
        var policyDatas: any = [];
        if (res !== undefined) {
          res.forEach((data: any) => {
            let renewalItem = {} as RENEWAL_ITEM;
            renewalItem.check = false;
            renewalItem.paid = false;
            renewalItem.policyHolderDetails = data.polNo;
            renewalItem.overview = [];
            let renewalChild = { label: 'Policy no.', value: data.polNo } as RENEWAL_CHILD;
            renewalItem.overview.push(renewalChild);
            let renewalChild2 = { label: 'Expiry date', value: data.polExpDate } as RENEWAL_CHILD;
            renewalItem.overview.push(renewalChild2);
            let renewalChild3 = {
              label: 'Insured property address',
              value:
                data.riskAddressLine1 +
                '<br/>' +
                data.riskAddressLine2 +
                '<br/>' +
                data.riskAddressLine3 +
                '<br/> ' +
                data.riskCity +
                '<br/> ' +
                data.riskState +
                '<br/> ' +
                data.riskCountry,
            } as RENEWAL_CHILD;
            renewalItem.overview.push(renewalChild3);
            renewalItem.propertyDetails = [
              {
                periodOfInsurance: data.polExpDate + ' - ' + data.polEffDate,
                startDate: data.polEffDate,
                endDate: data.polExpDate,
              },
            ];
            renewalItem.policyHolderDetails = [
              {
                fullName: data.polHolderName,
                idType: data.polIdType1,
                idNo: data.polIdValue1,
              },
            ];
            policyDatas.push(renewalItem);
          });
        }
        return patchState({
          renewal: Boolean(policyDatas.length != 0),
          renewalResponse: { policyDatas },
        });
      })
    );
  }

  @Action(GET_COVERAGE_DETAILS)
  public getCoverageDetails({ patchState }: StateContext<UserInputStateModel>, { payload }: any) {
    let coverageDetails = {} as MDL.COVERAGE_ITEM;
    var response = payload.planRecommendation;

    if (response !== undefined) {
      coverageDetails.accordions = [];
      response.components.forEach((data: any) => {
        // first Layer
        let accordinsItem = {} as MDL.ACCORDIONS_ITEM;
        accordinsItem.formGroupName = MDL.FG_LIST.get(data.coverCode);
        accordinsItem.title = data.description;
        accordinsItem.coverCode = data.coverCode;
        accordinsItem.selected = data.selectedIndicator;
        accordinsItem.displayPremium = data.displayPremium;
        coverageDetails.accordions.push(accordinsItem);

        // second Layer
        let accordinsSecLayerItem = {} as MDL.ACCORDIONS_ITEM;
        accordinsSecLayerItem.formGroupName = MDL.HO_FG_LIST.get(data.coverCode);
        accordinsSecLayerItem.formLevel = MDL.FG_LIST.get(data.coverCode);
        accordinsSecLayerItem.title = data.narration;
        accordinsSecLayerItem.selected = data.selectedIndicator;
        accordinsItem.displayPremium = data.displayPremium;
        coverageDetails.accordions.push(accordinsSecLayerItem);

        let comparsionItem = {} as MDL.COMPARISON_ITEM;
        comparsionItem.tableRows = [];
        let compHeaderItem = {} as MDL.COP_HEADER_ITEM;
        let count = 0;
        compHeaderItem.plans = [];
        if (data.plans != undefined) {
          let allBenefits: MDL.COP_TABLE_ITEM[] = [];
          data.plans.forEach((plan: any) => {
            count++;
            if (plan.recommendedIndicator) {
              compHeaderItem.selectedPlan = count;
            }
            compHeaderItem.plans.push({
              planName: plan.planDescription,
              planPremium: plan.displayPremium,
              planCode: plan.planCode,
            });
            plan.benefits.forEach((benefit: any) => {
              let compTableItem = {} as MDL.COP_TABLE_ITEM;
              compTableItem.headline = benefit.description;
              compTableItem.popoverMessage = benefit.additionalInformation;
              compTableItem.coverage = benefit.coverage;
              allBenefits.push(compTableItem);
            });
          });

          let stdBenefits: MDL.COP_TABLE_ITEM[] = [];
          data.plans[0].benefits.forEach((benefit: any) => {
            let compTableItem = {} as MDL.COP_TABLE_ITEM;
            compTableItem.headline = benefit.description;
            compTableItem.popoverMessage = benefit.additionalInformation;
            stdBenefits.push(compTableItem);
          });

          for (let std of stdBenefits) {
            std.details = [];
            for (let all of allBenefits) {
              if (std.headline == all.headline) {
                std.details.push(all.coverage);
              }
            }
          }
          comparsionItem.tableRows = stdBenefits;
        }
        comparsionItem.headerFooter = compHeaderItem;
        accordinsItem.comparisonTable = comparsionItem;

        if (data?.additionalCover != undefined) {
          data?.additionalCover.forEach((additional: any) => {
            // third  Layer
            let accordinsThirdLayerItem = {} as MDL.ACCORDIONS_ITEM;
            accordinsThirdLayerItem.parentFormGroupName = MDL.FG_LIST.get(data.coverCode);
            accordinsThirdLayerItem.title = additional.coverDescription;
            accordinsThirdLayerItem.coverNarration = additional.coverNarration;
            accordinsThirdLayerItem.displayPremium = additional.displayPremium;
            accordinsThirdLayerItem.coverCode = additional.coverCode;
            accordinsThirdLayerItem.selected = additional.selectedIndicator;
            coverageDetails.accordions.push(accordinsThirdLayerItem);
          });
        }
      }); //End Loop
    }
    return patchState({
      coverageDetails: coverageDetails,
    });
  }

  @Action(RESET_STEP_2_POLICY_NO)
  public resetStep2PolicyNo({ patchState, getState }: StateContext<UserInputStateModel>) {
    const currentState = getState();

    return patchState({
      ...currentState,
      userInput: {
        ...currentState.userInput,
        step2: {
          ...currentState.userInput.step2,
          epolicyInquiry: {
            policyNo: '',
            eligibleDiscount: false
          }
        }
      }

    })
  }

  @Action(RESET_STEP_2_ALIM_POLICY_NO)
  public resetStep2AlimPolicyNo({ patchState, getState }: StateContext<UserInputStateModel>) {
    const currentState = getState();

    return patchState({
      ...currentState,
      userInput: {
        ...currentState.userInput,
        step2: {
          ...currentState.userInput.step2,
          alimPolicyInquiry: {
            alimPolicyNo: '',
            alimCustomerInd: false
          }
        }
      }

    })
  }
}


