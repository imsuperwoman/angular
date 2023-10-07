import { Injectable } from '@angular/core';
import { Action, State, Store, Selector, StateContext } from '@ngxs/store';
import { map } from 'rxjs/operators';
import {
  PLAN_RECOMMENDATION,
  REFRESH_QUOTE,
  CALCULATOR,
  EPOLICY_INQUIRY,
  BASIC_PROPERTY_DETAILS,
  DO_SANCTION_CHECKING,
  CHECK_USER_INFO,
  QUOTE_DETAILS,
  PUT_CUSTOMER_DETAILS,
  CHECK_HSBC_CARD,
  GET_QUOTE_INFO,
  GET_BUNDLE_CONFIG,
  RESET_CALCULATOR,
  GET_DOCUMENTS_CONFIG,
  RESET_QUOTE_INFO,
  ALIM_POLICY_ENQUIRY,
  QUOTE_PROGRESS,
} from '../actions/quote-progess.action';
import { QuoteProgessService } from '../../services/quote-progress.service';
import {
  PropertyDetails,
  QUOTE_PROGRESS_STATE_MODEL,
  PlanRecommendation,
  UnderWriting,
  DEFAULTS,
  QuoteDetails,
  QuoteDetailsRisk,
} from '../model/quote-progress.model';
import { UserInputState } from './user-input.state';
import { AZOL, DOCUMENT_MENU, PARTNER_DOCUMENT_MENU, PRODUCT_CAT } from '../../constants/shc-constants';
import { GeneralSelectors } from 'module/store/general.selectors';
import { GET_COVERAGE_DETAILS, SET_STEP_2, SET_STEP_2_POLICY_NO, SET_STEP_2_ALIM_POLICY_NO } from '../actions/user-input.action';
import { MENU_ITEM } from '@constants/header-constants';
import * as moment from 'moment';
import { nricDOB } from '@functions/validator-nric.function';
import { FormService } from '@services/form.service';

@State<QUOTE_PROGRESS_STATE_MODEL>({
  name: 'QuoteProgessState',
  defaults: DEFAULTS,
})
@Injectable()
export class QuoteProgessState {
  constructor(public quoteProgessService: QuoteProgessService, private _store: Store,
    private formService: FormService) { }

  @Selector()
  public static planRecommendation(state: any) {
    return state.planRecommendation.components;
  }

  @Selector()
  public static quoteNumber(state: any) {
    return state.planRecommendation.quoteProgress.Result.QuotationNumber;
  }

  @Selector()
  public static quotationNumber(state: any) {
    return state.planRecommendation.planRecommendation.contract.contractNumber;
  }

  @Selector()
  public static calculated(state: any) {
    return state.calculator.estimatedSumInsured;
  }

  @Selector()
  public static bundle(state: any) {
    return state.bundle;
  }

  @Selector()
  public static bundleConfig(state: any) {
    return state.bundleConfig;
  }

  @Selector()
  public static documentData(state: any) {
    return state.documentData
  }

  @Action(CALCULATOR)
  public calculator({ patchState }: any, { payload }: CALCULATOR) {
    return this.quoteProgessService
      .postCalculator(payload).pipe(map((res: any) => {
        patchState({
          calculator: res,
        });
      })
      );
  }

  @Action(RESET_CALCULATOR)
  public resetCalculator({ patchState }: any) {
    return patchState({
      calculator: ''
    });
  }

  @Action(BASIC_PROPERTY_DETAILS)
  public basicPropertyDetails({ patchState }: StateContext<QUOTE_PROGRESS_STATE_MODEL>) {
    const userInput = this._store.selectSnapshot(UserInputState.userInput);
    const sourceSystem = this._store.selectSnapshot((item) => item.GeneralState.sourceSystem);
    const productConfig = this._store.selectSnapshot((item) => item.GeneralState.productConfig);
    const underwritingConfig = this._store.selectSnapshot(GeneralSelectors.underWritingConfig);
    const payload = new PropertyDetails();

    payload.ProductCategory = PRODUCT_CAT;
    payload.QuotationProgress = 'GUIDING QUESTION';
    payload.SourceSystem = sourceSystem ? sourceSystem : AZOL;
    payload.Risk.RiskGrp[0].RiskLocated = 'WM';
    payload.Risk.RiskGrp[0].RiskType = 'LOC';
    payload.Risk.RiskGrp[0].RiskLoc.AddressNo = userInput.step1.address.addressnumber;
    payload.Risk.RiskGrp[0].RiskLoc.RiskBuildingName = userInput.step1.address.address1;
    payload.Risk.RiskGrp[0].RiskLoc.RiskStreetName = userInput.step1.address.address2;
    payload.Risk.RiskGrp[0].RiskLoc.RiskArea = userInput.step1.address.address3;
    payload.Risk.RiskGrp[0].RiskLoc.BuildingStorey = userInput.step1.BuildingStorey;
    payload.Risk.RiskGrp[0].RiskLoc.Latitude = userInput.step1.address?.viewport.lat.toString();
    payload.Risk.RiskGrp[0].RiskLoc.Longitude = userInput.step1.address?.viewport.lng.toString();

    payload.Risk.RiskGrp[0].RiskLoc.ConstructionYear = Number(this.yearOfConsUnsure(userInput));
    payload.Risk.RiskGrp[0].RiskLoc.BuiltUsingBrick = userInput.step1.BuiltUsingBrick;
    payload.Risk.RiskGrp[0].RiskLoc.CustomerType = userInput.step1.CustomerType;
    payload.Risk.RiskGrp[0].RiskLoc.ExistingLoan = Boolean(userInput.step1.ExistingLoan).toString();
    payload.Risk.RiskGrp[0].RiskLoc.HasTenant = Boolean(userInput.step1.HasTenant).toString();
    payload.Risk.RiskGrp[0].RiskLoc.PostCode = userInput.step1.address.postCode;
    payload.Risk.RiskGrp[0].RiskLoc.PropertyType = userInput.step1.PropertyType;
    payload.Risk.RiskGrp[0].RiskLoc.SumInsured = this.getSumInsured(userInput);

    payload.Risk.RiskGrp[0].RiskLoc.CoverageType = userInput.step1.CoverageType
      ? userInput.step1.CoverageType : '';

    if (productConfig.voucherCode != undefined) {
      payload.Voucher = {
        VoucherCode: productConfig.voucherCode,
        VoucherStatus: 'N'
      }
    }

    payload.UnderWritingDeclaration = [new UnderWriting()];
    payload.UnderWritingDeclaration[0].DeclarationAnswer = false;
    payload.UnderWritingDeclaration[0].DeclarationQuestion =
      underwritingConfig.questions[0].subQuestions[0].code;

    return this.quoteProgessService
      .postBasicPropertyDetails(payload).pipe(map((res: any) => {
        patchState({
          quoteProgress: res,
        });
      }));
  }

  yearOfConsUnsure(userInput: any) {
    let yearOfCons;
    if (userInput.step1.yearOfConsUnsure == "donotknow") {
      yearOfCons = (new Date()).getFullYear() - userInput.step1.ageOfBuilding;
    } else {
      yearOfCons = userInput.step1.yearOfConstruction;
    }
    return yearOfCons;
  }

  @Action(PLAN_RECOMMENDATION)
  public planRecommendation({ patchState, getState }: StateContext<QUOTE_PROGRESS_STATE_MODEL>) {
    const currentState = getState();
    const bundle = this._store.selectSnapshot((item) => item.QuoteProgessState.bundle);
    const userInput = this._store.selectSnapshot(UserInputState.userInput);
    const underwritingConfig = this._store.selectSnapshot(GeneralSelectors.underWritingConfig);
    const sourceSystem = this._store.selectSnapshot((item) => item.GeneralState.sourceSystem);
    const productConfig = this._store.selectSnapshot((item) => item.GeneralState.productConfig);
    const customViewObj = this._store.selectSnapshot((item) => item.GeneralState.customViewObj);
    const payload = new PlanRecommendation();

    payload.checkUBB.SourceSystem = sourceSystem;
    payload.checkUBB.ProductCat = PRODUCT_CAT;
    payload.checkUBB.Bundle = bundle;

    payload.checkUBB.Policy.RiskList[0].QuestionnaireList[0].QuestionId =
      underwritingConfig.questions[0].subQuestions[0].code;
    payload.checkUBB.Policy.RiskList[0].QuestionnaireList[0].QuestionAnswer = false;
    payload.checkUBB.Policy.RiskList[0].PostCode = userInput.step1.address.postCode;
    payload.checkUBB.Policy.RiskList[0].CustomerType = userInput.step1.CustomerType;
    payload.checkUBB.channel = customViewObj.p_channel;

    payload.quoteProgress.QuotationNumber =
      currentState.quoteProgress.quoteProgress.Result.QuotationNumber;
    payload.quoteProgress.SourceSystem = sourceSystem;
    payload.quoteProgress.ProductCategory = PRODUCT_CAT;
    payload.quoteProgress.Risk = currentState.quoteProgress.quoteProgress.Result.Risk;

    payload.quoteProgress.Risk = {
      ...currentState.quoteProgress.quoteProgress.Result.Risk,
      RiskGrp: [
        {
          ...currentState.quoteProgress.quoteProgress.Result.Risk.RiskGrp[0],
          RiskLoc: {
            ...currentState.quoteProgress.quoteProgress.Result.Risk.RiskGrp[0].RiskLoc,
            IsAgreedValue: this.getSumInsured(userInput) == currentState?.calculator?.estimatedSumInsured ? 'Y' : 'N',
            BuildingStorey: userInput.step1.BuildingStorey,
            BuildingAge: Number(this.getBuildingAge(userInput)),
            ConstructionYear: Number(this.yearOfConsUnsure(userInput)),
            Latitude: userInput.step1.address?.viewport.lat.toString(),
            Longitude: userInput.step1.address?.viewport.lng.toString(),
            PlusCode: userInput.step1.address.plusCode,
            PlaceId: userInput.step1.address.placeId

          }
        }
      ]
    }

    payload.quoteProgress.UnderWritingDeclaration = [new UnderWriting()];
    payload.quoteProgress.UnderWritingDeclaration[0].DeclarationAnswer = false;
    payload.quoteProgress.UnderWritingDeclaration[0].DeclarationQuestion =
      underwritingConfig.questions[0].subQuestions[0].code;

    if (productConfig.voucherCode != undefined) {
      payload.quoteProgress.VoucherCode = productConfig.voucherCode;
    }
    payload.quoteProgress.channel = customViewObj.p_channel;
    payload.quoteProgress.AgentCode = productConfig.AgentCode;

    return this.quoteProgessService.putPlanRecommendation(payload).pipe(
      map((res) => {
        if (res !== undefined) {
          this._store.dispatch(new GET_COVERAGE_DETAILS(res));
          var responseUI = JSON.parse(JSON.stringify(res));
          var recommendedPlans: { CoverCode?: string; PlanCode?: string; }[] = []
          responseUI?.planRecommendation.components?.find((dataPlan: any) => {
            if (dataPlan.plans) {
              const recommended = dataPlan.plans.find(
                (dataPlanRec: any) => dataPlanRec.recommendedIndicator
              );
              recommendedPlans.push({
                CoverCode: dataPlan.coverCode,
                PlanCode: recommended.planCode,
              });
            } else {
              if (userInput.step1.CoverageType == 'AN') {
                if (dataPlan.coverCode == '03') {
                  recommendedPlans.push({ CoverCode: dataPlan.coverCode });
                }
              } else {
                if (dataPlan.coverCode == '14') {
                  recommendedPlans.push({ CoverCode: dataPlan.coverCode });
                }
              }
            }
          });
          this._store.dispatch(new SET_STEP_2(recommendedPlans));

          var response = JSON.parse(JSON.stringify(res));
          var newResponse = this.floorProneFunction(response.planRecommendation)
        }
        patchState({
          planRecommendation: newResponse,
        });
      }));
  }

  @Action(ALIM_POLICY_ENQUIRY)
  public alimPolicyEnquiry(
    { patchState, getState }: StateContext<QUOTE_PROGRESS_STATE_MODEL>,
    { payload }: EPOLICY_INQUIRY
  ) {
    const currentState = getState();
    return this.quoteProgessService
      .postAlimPolicyEnquiry(payload).pipe(map((res: any) => {
        const step2Payload = { ...payload, ...res }
        this._store.dispatch(new SET_STEP_2_ALIM_POLICY_NO(step2Payload));

        return patchState({
          ...currentState,
          alimPolicyNo: res.alimPolicyNo ? res.alimPolicyNo : '',
          alimCustomerInd: res.alimCustomerInd ? res.alimCustomerInd : false,
          AlimPolicyNo: res.alimPolicyNo ? res.alimPolicyNo : ''
        });
      }));
  }


  @Action(REFRESH_QUOTE)
  public refreshQuote(
    { patchState, getState }: StateContext<QUOTE_PROGRESS_STATE_MODEL>,
    { payload }: REFRESH_QUOTE
  ) {
    const currentState = getState();
    const userInput = this._store.selectSnapshot(UserInputState.userInput);
    const bundle = this._store.selectSnapshot((item) => currentState.bundle);
    const sourceSystem = this._store.selectSnapshot((item) => item.GeneralState.sourceSystem);
    const existLoan = userInput.step1?.ExistingLoan !== '' ? userInput.step1?.ExistingLoan : "false";
    const productConfig = this._store.selectSnapshot((item) => item.GeneralState.productConfig);
    const customViewObj = this._store.selectSnapshot((item) => item.GeneralState.customViewObj);

    const payloadData = {
      QuotationNumber: currentState.planRecommendation.contract.contractNumber,
      ProductCat: PRODUCT_CAT,
      SourceSystem: sourceSystem ? sourceSystem : AZOL,
      agentCode: productConfig.AgentCode,
      VoucherCode: productConfig.voucherCode,
      channel: customViewObj.p_channel,
      ParameterList: [
        { Code: 'CUSTOMERTYPE', Value: userInput.step1.CustomerType },
        { Code: 'PROPERTYTYPE', Value: userInput.step1.PropertyType },
        { Code: 'POSTCODE', Value: userInput.step1.address.postCode },
        { Code: 'SUMINSURED', Value: this.getSumInsured(userInput) },
        { Code: 'EXISTINGLOAN', Value: existLoan },
        { Code: 'HASTENANT', Value: userInput.step1?.HasTenant ? userInput.step1?.HasTenant : "false" },
        { Code: 'BUNDLE', Value: bundle },
        { Code: 'FINANCIALIND', Value: existLoan },
        { Code: 'RELATEDPOLIND', Value: userInput.step2.epolicyInquiry.policyNo == '' ? "false" : "true" },
        { Code: 'ISAGREEDVALUE', Value: this.getSumInsured(userInput) == currentState?.calculator?.estimatedSumInsured ? 'Y' : 'N' },
        { Code: 'COVERAGETYPE', Value: userInput.step1.CoverageType },
        { Code: 'ALIMPOLIND', Value: userInput.step2.alimPolicyInquiry.alimCustomerInd ? userInput.step2.alimPolicyInquiry.alimCustomerInd : "false" },
        { Code: "BUILDINGSTOREY", Value: userInput.step1.BuildingStorey },
        { Code: "BUILDINGAGE", Value: Number(this.getBuildingAge(userInput)) },
        { Code: "CONSTRUCTIONYEAR", Value: Number(this.yearOfConsUnsure(userInput)) },
        { Code: "LATITUDE", Value: userInput.step1.address.viewport.lat.toString() },
        { Code: "LONGITUDE", Value: userInput.step1.address.viewport.lng.toString() },
        { Code: "PLUSCODE", Value: userInput.step1.address.plusCode ? userInput.step1.address.plusCode : "" },
        { Code: "PLACEID", Value: userInput.step1.address.placeId ? userInput.step1.address.placeId : "" },
        { RiskGrp: [{ CoverGrp: payload }] },
      ],
      UnderWritingDeclaration: currentState.quoteProgress.quoteProgress.Result.UnderWritingDeclaration
    };

    return this.quoteProgessService
      .postRefreshQuote(payloadData).pipe(map((res: any) => {
        var response = JSON.parse(JSON.stringify(res));
        var newResponse = this.floorProneFunction(response)

        return patchState({
          planRecommendation: {
            ...currentState.planRecommendation,
            planRecommendation: newResponse
          },
        });
      }));
  }

  floorProneFunction(response: any) {
    const userInput = this._store.selectSnapshot(UserInputState.userInput);

    if (userInput.step1.CustomerType == 'TN') {
      response?.components.forEach((itemCT: any) => {
        if (userInput.step1.CoverageType == 'AN') {
          if (itemCT.coverCode == '04') {
            itemCT.mandatoryIndicator = true
          }
        } else {
          if (itemCT.coverCode == "15") {
            itemCT.mandatoryIndicator = true
          }
        }
      });
    } else if (userInput.step1.CustomerType == 'HO') {
      if (userInput.step1.CoverageType == 'MY') {
        var houseOwnerInd14 = response?.components.find((item: any) => item.coverCode == "14");
        var houseHolderInd15 = response?.components.find((item: any) => item.coverCode == "15");

        if (houseHolderInd15 != undefined && !houseHolderInd15.selectedIndicator) {
          response?.components.forEach((item14: any) => {
            if (item14.coverCode == "14") {
              item14.mandatoryIndicator = true
            }
          });
        }

        if (houseOwnerInd14 != undefined && !houseOwnerInd14.selectedIndicator) {
          response?.components.forEach((item15: any) => {
            if (item15.coverCode == "15") {
              item15.mandatoryIndicator = true
            }
          });
        }
      } else {
        var houseOwnerInd03 = response?.components.find((item: any) => item.coverCode == "03");
        var houseHolderInd04 = response?.components.find((item: any) => item.coverCode == "04");

        if (houseHolderInd04 != undefined && !houseHolderInd04.selectedIndicator) {
          response?.components.forEach((item03: any) => {
            if (item03.coverCode == "03") {
              item03.mandatoryIndicator = true
            }
          });
        }

        if (houseOwnerInd03 != undefined && !houseOwnerInd03.selectedIndicator) {
          response?.components.forEach((item04: any) => {
            if (item04.coverCode == "04") {
              item04.mandatoryIndicator = true
            }
          });
        }
      }
    }
    return response;
  }

  @Action(EPOLICY_INQUIRY)
  public epolicyInquiry(
    { patchState, getState }: StateContext<QUOTE_PROGRESS_STATE_MODEL>,
    { payload }: EPOLICY_INQUIRY
  ) {
    const currentState = getState();
    return this.quoteProgessService
      .postEpolicyInquiry(payload).pipe(map((res: any) => {
        const step2Payload = { ...payload, ...res }
        this._store.dispatch(new SET_STEP_2_POLICY_NO(step2Payload));
        return patchState({
          ...currentState,
          relatedPolicyNo: res.policyNo ? res.policyNo : '',
        });
      }));
  }

  @Action(QUOTE_DETAILS)
  public getQuoteDetails({ patchState, getState }: StateContext<QUOTE_PROGRESS_STATE_MODEL>) {
    const currentState = getState();
    const underwritingDeclaration = [
      ...currentState.planRecommendation.quoteProgress.Result.UnderWritingDeclaration,
    ];
    const payload = { ...this.formatQuoteDetails(currentState), UnderWritingDeclaration: underwritingDeclaration };

    return this.quoteProgessService
      .putQuoteDetails(payload).pipe(map((res: any) => {
        return patchState({
          ...currentState,
          quoteProgress: {
            ...currentState.quoteProgress,
            quoteDetails: res,
          },
        });
      }));
  }

  @Action(QUOTE_PROGRESS)
  public getQuoteProgress({ patchState, getState }: StateContext<QUOTE_PROGRESS_STATE_MODEL>,
    { quotationProgress, agent }: QUOTE_PROGRESS) {
    const currentState = getState();

    let underwritingDeclaration;

    if (currentState?.planRecommendation) {
      underwritingDeclaration = [
        ...currentState?.planRecommendation.quoteProgress?.Result.UnderWritingDeclaration,
      ];
    }

    var payload = { ...this.formatQuoteDetails(currentState), UnderWritingDeclaration: underwritingDeclaration };

    payload.QuotationProgress = quotationProgress;
    payload.AgentName = agent.agent_name;
    payload.AgentCode = agent.agent_code;
    payload.EmailAddress = agent.customer_email;
    payload.ClientName = agent.customer_name;
    payload.MobileNumber = agent.customer_phone_no;
    payload.Agent =
    {
      "AgentName": agent.agent_name,
      "MobileNumber": agent.agent_phone_no,
      "Address": "",
      "Email": agent.agent_email,
      "AgentCode": agent.agent_code,
      "ExtParam": agent.ExtParam
    }

    return this.quoteProgessService
      .postQuoteProgress(payload).pipe(map((res: any) => {
        return patchState({
          ...currentState
        });
      })
      );
  }

  formatQuoteDetails(currentState: QUOTE_PROGRESS_STATE_MODEL) {
    const productConfig = this._store.selectSnapshot((item) => item.GeneralState.productConfig);
    const agentDetailsName = this._store.selectSnapshot(
      (item) => item.GeneralState.agentDetails.Name
    );
    const userInput = this._store.selectSnapshot((item) => item.UserInputState.userInput);
    const quoteProgress = currentState.quoteProgress.quoteProgress;
    const customViewObj = this._store.selectSnapshot((item) => item.GeneralState.customViewObj);
    const sourceSystem = this._store.selectSnapshot((item) => item.GeneralState.sourceSystem);
    const sumInsuredId = currentState.quoteProgress.quoteDetails ? currentState.quoteProgress.quoteDetails.Result.SumInsuredId : null;
    const userType = userInput.step1.CustomerType;
    const productShortDescription = userType == 'HO' ? 'HOUSE OWNER' : 'HOUSE HOLDER';

    let payload = new QuoteDetails();
    let coverGrp: any = [];
    let planRecommendation;

    if (currentState?.planRecommendation) {
      planRecommendation = currentState.planRecommendation.planRecommendation.components;
    }

    let pack_data = {};
    if (planRecommendation) {
      planRecommendation.find((item: any) => {
        let coverPlanList = [];
        let PlanCode;
        let SubCoverGrp: any[] = [];
        if (item.selectedIndicator) {
          const coverPlan = item.plans?.filter((item: any = {}) => item.selectedIndicator);
          if (coverPlan) {
            PlanCode = coverPlan[0].planCode;
            coverPlanList.push({
              PlanCode: coverPlan[0].planCode,
              PlanDescp: coverPlan[0].planDescription,
              GrossPrem: coverPlan[0].displayPremium,
              SelectedInd: coverPlan[0].selectedIndicator
            });
          }

          const additionalCover = item.additionalCover?.filter((item: any = {}) => item.selectedIndicator);

          if (additionalCover) {
            additionalCover.find((item: any) => {
              SubCoverGrp.push({
                SubCoverCode: item.coverCode,
                SubCoverDescp: item.coverDescription,
                DisplayPrem: item.displayPremium,
                SelectedInd: item.selectedIndicator
              });
            });
          }

          const coverId = item.coverCode === '03' ? '1'
            : item.coverCode === '04' ? '2'
              : item.coverCode === '11' ? '3'
                : item.coverCode === '12' ? '4'
                  : item.coverCode === '13' ? '5'
                    : item.coverCode === '14' ? '6'
                      : item.coverCode === '15' ? '7'
                        : item.coverCode === '16' ? '8'
                          : item.coverCode === '17' ? '9'
                            : item.coverCode === '18' ? '10'
                              : '';

          if (SubCoverGrp.length == 0) {
            pack_data = {
              CoverCode: item.coverCode,
              CoverDescp: item.description,
              CoverIdFrmPlanRec: coverId,
              SelectedInd: item.selectedIndicator,
              Si: item.sumInsured,
              GrossPrem: item.displayPremium,
              BasicPrem: item.displayPremium,
              PlanCode: PlanCode,
              CoverPlanList: coverPlanList.length == 0 ? undefined : coverPlanList,
            }
          } else {
            pack_data = {
              CoverCode: item.coverCode,
              CoverDescp: item.description,
              CoverIdFrmPlanRec: coverId,
              SelectedInd: item.selectedIndicator,
              Si: item.sumInsured,
              GrossPrem: item.displayPremium,
              BasicPrem: item.displayPremium,
              PlanCode: PlanCode,
              CoverPlanList: coverPlanList.length == 0 ? undefined : coverPlanList,
              SubCover: { SubCoverGrp: SubCoverGrp }
            }
          }
          var output = JSON.parse(JSON.stringify(pack_data));
          coverGrp.push(output);
        }
      });
    }

    if (currentState?.planRecommendation) {
      payload.QuotationNumber =
        currentState?.planRecommendation?.quoteProgress.Result.QuotationNumber;
    }

    let premium;
    if (currentState?.planRecommendation) {
      premium = currentState?.planRecommendation?.planRecommendation.premium;
    }

    payload.ProductShortDescription = productShortDescription;
    payload.QuotationProgress = 'QUOTE SELECTION';
    payload.ProductCategory = quoteProgress?.Result?.ProductCategory;
    payload.SourceSystem = sourceSystem;
    payload.SourceSystemCat = productConfig.SourceSystemCat;
    payload.UTMMedium = customViewObj.utm_medium ? customViewObj.utm_medium : '';
    payload.UTMCampaign = customViewObj.utm_campaign ? customViewObj.utm_campaign : '';
    payload.AgentCode = productConfig.AgentCode;
    payload.AgentName = agentDetailsName;
    payload.PostCode = userInput.step1.address.postCode;
    payload.RebateAmount = premium?.rebateAmt;
    payload.RebatePercentage = premium?.rebatePct;
    payload.PremiumDue = premium?.premiumDue;
    payload.PremiumDueRounded = premium?.premiumDueRounded;
    payload.TotalPremExclStamp = premium?.totalPremiumExcludeStamp;
    payload.Stamp = premium?.stampDuty;
    payload.IsEPolicy = '';
    payload.ProductCode = productConfig.ProductCode;
    payload.ProductType = '';
    payload.CNoteType = '';
    payload.MasterPolicyInd = '';
    payload.EPolicyEmailRecipientCode = '';
    payload.EpolicyResponseAttachInd = '';
    payload.GrossPremium = premium?.grossPremium;
    payload.Risk = new QuoteDetailsRisk();
    payload.Risk.RiskGrp = [
      {
        Cover: {
          CoverGrp: coverGrp,
        },
      },
    ];
    payload.IsAgreedValue = this.getSumInsured(userInput) == currentState?.calculator?.estimatedSumInsured ? 'Y' : 'N';
    payload.RelatedPolicyNo = userInput.step2?.epolicyInquiry?.policyNo ? userInput.step2?.epolicyInquiry?.policyNo : '';
    payload.ReferenceNo = customViewObj?.p_psid ? customViewObj?.p_psid : '';
    payload.SumInsuredId = sumInsuredId;
    payload.STaxAmt = premium?.serviceTaxAmount;
    payload.STaxPct = premium?.serviceTaxPercentage;
    payload.AlimPolicyNo = currentState.alimPolicyNo ? currentState.alimPolicyNo : '';

    if (payload.IsAgreedValue == 'Y') {
      payload = this.getIsAgreedValue(payload);
    }
    return payload;
  }

  getIsAgreedValue(payload: any) {
    const smartHomeCoverFormValues = this.formService.getForms();
    let insuredDialogFormValues = smartHomeCoverFormValues.insuredDialogForm;

    payload.AvExternalImp = parseInt(insuredDialogFormValues?.houseInfo?.improvedFinishes.replaceAll(',', ''));
    payload.AvGrossBuildUpArea = insuredDialogFormValues.houseInfo.area;
    payload.AvQualOfProperty = insuredDialogFormValues.finishedCost;
    payload.AvTypeOfProperty = insuredDialogFormValues.buildingType;
    payload.Uom = insuredDialogFormValues.houseInfo.unitOfMeasure;
    return payload;
  }

  @Action(PUT_CUSTOMER_DETAILS)
  public customerDetails(
    { patchState, getState }: StateContext<QUOTE_PROGRESS_STATE_MODEL>
  ) {
    const currentState = getState();
    const payload = this.formatCustomerInputDetails(currentState);

    return this.quoteProgessService
      .putCustomerDetails(payload).pipe(map((res: any) => {
        return patchState({
          quoteProgress: {
            ...currentState.quoteProgress,
            quoteRequest: payload,
            quoteDetails: res,
          },
        });
      }));
  }

  formatCustomerInputDetails(currentState: QUOTE_PROGRESS_STATE_MODEL) {
    const productConfig = this._store.selectSnapshot((item) => item.GeneralState.productConfig);
    const agentDetailsName = this._store.selectSnapshot(
      (item) => item.GeneralState.agentDetails.Name
    );
    const premium = currentState.planRecommendation.planRecommendation.premium;
    const userInput = this._store.selectSnapshot((item) => item.UserInputState.userInput);
    const quoteProgress = currentState.quoteProgress.quoteProgress;
    const customViewObj = this._store.selectSnapshot((item) => item.GeneralState.customViewObj);
    const sourceSystem = this._store.selectSnapshot((item) => item.GeneralState.sourceSystem);
    const underwritingDeclaration = [
      ...currentState.planRecommendation.quoteProgress.Result.UnderWritingDeclaration,
    ];

    const userType = userInput.step1.CustomerType;
    const productShortDescription = userType == 'HO' ? 'HOUSE OWNER' : 'HOUSE HOLDER';
    const mortgageInput = userInput.step3.mortgage;

    let payload = new QuoteDetails();
    let mortgageeGrp: any = [];

    if (mortgageInput != undefined) {
      mortgageeGrp.push({
        BankEmail: mortgageInput.banksEmail,
        ConsentInd: Boolean(mortgageInput.banksEmail != ''),
        CustomerEmail: userInput.step3.customerDetails.email,
        LoanReferenceNo: mortgageInput.loanReferenceNo,
        MortgageeName: mortgageInput.financialInterestName == 'other' ? mortgageInput.financialInterestText : this.getBankCodes(mortgageInput.financialInterestName),
        MortgageeType: mortgageInput.financialType,
        Seq: 1
      })

      mortgageeGrp.forEach((value: any) => {
        Object.keys(value).forEach((key) => {
          if (value[key] === '') {
            delete value[key];
          }
        })
      })
    }

    let combinedName = JSON.parse(JSON.stringify(userInput.step3.jointNames));
    let combinedNameList: any = [];

    if (combinedName.length > 0) {
      if (typeof combinedName[0].fullName === 'string' && combinedName[0].fullName != '') {
        combinedName.forEach((data: any, index: number) => {
          combinedNameList.push({
            Seq: index + 1,
            IdValue: data.idNo.replaceAll('-', ''),
            IdType: data.idType,
            Name: data.fullName,
            Nationality: data.nationality,
            Role: data.role
          })
        })
      }
    }

    var quoteProg = [...currentState.quoteProgress.quoteDetails.Result.Risk.RiskGrp[0].Cover.CoverGrp];
    var quoteProgs = JSON.parse(JSON.stringify(quoteProg));

    quoteProg.forEach((value: any, index: number) => {
      if (value?.Mortgagee !== undefined) {
        delete quoteProgs[index]?.Mortgagee
      }
    })

    var first = function (element: any) { return !!element }
    const findPlanIndex = quoteProgs.findIndex(first);

    if (findPlanIndex == 0) {
      let pack_data = {
        BasicPrem: quoteProgs[findPlanIndex].BasicPrem,
        CoverCode: quoteProgs[findPlanIndex].CoverCode,
        CoverDescp: quoteProgs[findPlanIndex].CoverDescp,
        CoverId: quoteProgs[findPlanIndex].CoverId,
        CoverIdFrmPlanRec: quoteProgs[findPlanIndex].CoverIdFrmPlanRec,
        CoverPlanList: quoteProgs[findPlanIndex].CoverPlanList,
        GrossPrem: quoteProgs[findPlanIndex].GrossPrem,
        ItmNo: quoteProgs[findPlanIndex].ItmNo,
        PlanCode: quoteProgs[findPlanIndex].PlanCode,
        SelectedInd: quoteProgs[findPlanIndex].SelectedInd,
        Si: quoteProgs[findPlanIndex].Si,
        Mortgagee: {
          MortgageeGrp: mortgageeGrp
        }
      }
      quoteProgs.splice(Number(findPlanIndex), 1, pack_data);
    }

    if (combinedNameList.length > 0) {
      payload.CombinedName = { CombinedNameGrp: combinedNameList }
    }
    payload.QuotationNumber = currentState.planRecommendation.quoteProgress.Result.QuotationNumber;
    payload.ProductShortDescription = productShortDescription;
    payload.QuotationProgress = 'CUSTOMER DETAILS';
    payload.ProductCategory = quoteProgress.Result.ProductCategory;
    payload.ProductCode = productConfig.ProductCode;
    payload.EffectiveDate = moment(userInput.step3.propertyDetails.startDate).format('YYYY-MM-DD');
    payload.ExpiryDate = moment(userInput.step3.propertyDetails.endDate).format('YYYY-MM-DD');
    payload.AgentCode = productConfig.AgentCode;
    payload.AgentName = agentDetailsName;
    payload.ClientID = userInput.step3.customerDetails.idNo.replaceAll('-', '');
    payload.ClientIDType = userInput.step3.customerDetails.idType;
    payload.ClientName = userInput.step3.customerDetails.fullName;
    payload.Gender = userInput.step3.customerDetails.gender == 'M' ? 'MALE' : 'FEMALE';
    payload.DOB = moment(userInput.step3.customerDetails.dob).format('YYYY-MM-DD');
    payload.MobileNumber =
      userInput.step3.customerDetails.phoneCountryCode.replace('+', '') +
      userInput.step3.customerDetails.phoneNo;
    payload.EmailAddress = userInput.step3.customerDetails.email;

    payload.Address_1 = userInput.step3.customerDetails.addressnumber;
    payload.Address_2 = userInput.step3.customerDetails.address1;
    payload.Address_3 = userInput.step3.customerDetails.address2;
    payload.Area = userInput.step3.customerDetails.address3;

    payload.City = userInput.step3.customerDetails.cityCode;
    payload.State = userInput.step3.customerDetails.stateCode;
    payload.Country = userInput.step3.customerDetails.country;
    payload.Latitude = userInput.step3.customerDetails.viewport.lat.toString(),
      payload.Longitude = userInput.step3.customerDetails.viewport.lng.toString(),
      payload.PlusCode = userInput.step3.customerDetails.plusCode,
      payload.PlaceId = userInput.step3.customerDetails.placeId,
      payload.SourceSystem = sourceSystem;
    payload.SourceSystemCat = productConfig.SourceSystemCat;
    payload.UTMMedium = customViewObj?.utm_medium ? customViewObj.utm_medium : '';
    payload.UTMCampaign = customViewObj?.utm_campaign ? customViewObj.utm_campaign : '';
    payload.RebateAmount = premium.rebateAmt;
    payload.RebatePercentage = premium.rebatePct;
    payload.PremiumDue = premium.premiumDue;
    payload.PremiumDueRounded = premium.premiumDueRounded;
    payload.TotalPremExclStamp = premium.totalPremiumExcludeStamp;
    payload.Stamp = premium.stampDuty;
    payload.IsEPolicy = '';
    payload.ProductType = '';
    payload.CNoteType = '';
    payload.MasterPolicyInd = '';
    payload.EPolicyEmailRecipientCode = '';
    payload.EpolicyResponseAttachInd = '';
    payload.GrossPremium = premium.grossPremium;
    payload.IsAgreedValue = this.getSumInsured(userInput) == currentState?.calculator?.estimatedSumInsured ? 'Y' : 'N';
    payload.RelatedPolicyNo = userInput.step2.epolicyInquiry.policyNo ? userInput.step2.epolicyInquiry.policyNo : '';
    payload.ReferenceNo = customViewObj?.p_psid ? customViewObj?.p_psid : '';
    payload.SumInsuredId = currentState.quoteProgress.quoteDetails ? currentState.quoteProgress.quoteDetails.Result.SumInsuredId : null;
    payload.STaxAmt = premium.serviceTaxAmount;
    payload.STaxPct = premium.serviceTaxPercentage;
    payload.Nationality = userInput.step3.customerDetails.nationality;
    payload.PostCode = userInput.step3.customerDetails.postCode;
    payload.MatchAgentEmail = 'N';
    payload.MatchAgentMobile = 'N';
    payload.ReferralSalesStaffId = '';
    payload.GUID = currentState.planRecommendation.quoteProgress.Result.GUID;
    payload.CreatedDate = moment(new Date()).format('YYYY-MM-DD');
    payload.Risk = new QuoteDetailsRisk();
    payload.AlimPolicyNo = userInput.step2.alimPolicyInquiry.alimPolicyNo ? userInput.step2.alimPolicyInquiry.alimPolicyNo : '';

    payload.Risk.RiskGrp = [
      {
        ItmNo: quoteProgress.Result.Risk.RiskGrp[0].ItmNo ? quoteProgress.Result.Risk.RiskGrp[0].ItmNo : '',
        RiskId: quoteProgress.Result.Risk.RiskGrp[0].RiskId ? quoteProgress.Result.Risk.RiskGrp[0].RiskId : '',
        RiskLoc: {
          AddressNo: userInput.step1.address.addressnumber,
          RiskBuildingName: userInput.step1.address.address1,
          RiskStreetName: userInput.step1.address.address2,
          RiskArea: userInput.step1.address.address3,

          BuildingAge: this.getBuildingAge(userInput),
          BuildingStorey: userInput.step1.BuildingStorey,
          BuiltUsingBrick: Boolean(userInput.step1.BuiltUsingBrick == 'true'),
          City: userInput.step1.address.cityCode,
          ConstructionYear: Number(this.yearOfConsUnsure(userInput)),
          Latitude: userInput.step1.address.viewport.lat.toString(),
          Longitude: userInput.step1.address.viewport.lng.toString(),
          PlusCode: userInput.step1.address.plusCode,
          PlaceId: userInput.step1.address.placeId,
          Country: 'MAL',
          CoverageType: userInput.step1.CoverageType,
          CustomerType: userInput.step1.CustomerType,
          ExistingLoan: Boolean(userInput.step3.mortgage != undefined),
          ExpiryDate: moment(userInput.step3.propertyDetails.endDate).format('YYYY-MM-DD'),
          HasTenant: Boolean(userInput.step1.HasTenant == 'true'),
          InceptionDate: moment(userInput.step3.propertyDetails.startDate).format('YYYY-MM-DD'),
          PostCode: userInput.step1.address.postCode,
          PropertyType: userInput.step1.PropertyType,
          RateType: '',
          State: userInput.step1.address.stateCode,
          SumInsured: this.getSumInsured(userInput)
        },
        Cover: {
          CoverGrp: quoteProgs
        },
      },
    ];

    const headerContents = this._store.selectSnapshot(
      (state) => state.GeneralState.dynamicContent.Header?.contents
    );

    if (headerContents?.referralStaffFields) {
      payload.ReferralSalesStaffId = userInput.step3.customerDetails.staffId;
    }

    if (headerContents?.custCollFields !== undefined) {
      payload.ClientRefNo = userInput.step3.customerDetails.cardNo
        ? userInput.step3.customerDetails.cardNo
        : customViewObj.p_cardno;
    }

    if (headerContents?.custCollFieldsSecond !== undefined) {
      payload.ClientRefName = userInput.step3.customerDetails.cardNoSecond
        ? userInput.step3.customerDetails.cardNoSecond
        : customViewObj.p_cardnoSecond;
    }

    if (headerContents?.custCollFieldsThird !== undefined) {
      payload.ClientRefPolicyNo = userInput.step3.customerDetails.cardNoThird
        ? userInput.step3.customerDetails.cardNoThird
        : customViewObj.p_cardnoThird;
    }

    payload.UnderWritingDeclaration = underwritingDeclaration
    if (payload.IsAgreedValue == 'Y') {
      payload = this.getIsAgreedValue(payload);
    }
    return payload;
  }

  getBankCodes(code: any) {
    let lov = this._store.selectSnapshot(state => state.GeneralState.lov);
    let bank = lov.find((item: any) => item.LovType == 'BANKCODE');
    let theBank = bank.LovList.find((item: any) => item.Code == code);

    return theBank.Description
  }

  getSumInsured(userInput: any) {
    let SumInsured = userInput.step1?.SumInsured === undefined ? '0' : Number(userInput.step1?.SumInsured.replaceAll(',', '')).toFixed(0)

    return SumInsured
  }

  getBuildingAge(userInput: any) {
    let buildingAge;
    if (userInput.step1.yearOfConsUnsure == 'know') {
      let year: number = new Date().getFullYear();
      buildingAge = year - Number(userInput.step1.yearOfConstruction);
    } else {
      buildingAge = userInput.step1.ageOfBuilding;
    }

    return buildingAge
  }

  @Action(DO_SANCTION_CHECKING)
  public postCheckSanction(
    { patchState }: StateContext<QUOTE_PROGRESS_STATE_MODEL>,
    { customerDetails, combinedNames, quotationNumber }: DO_SANCTION_CHECKING
  ) {
    let payload = {
      appName: AZOL,
      clientRefNo: quotationNumber,
      personsList: [
        {
          fullName: customerDetails.fullName,
          dob: moment(customerDetails.dob).format('YYYY-MM-DD'),
          nationCode: customerDetails.nationality,
          countryCode: customerDetails.correspondenceDetails.country,
          idType: customerDetails.idType,
          idval: customerDetails.idNo.replaceAll('-', ''),
          role: 'POLICY HOLDER',
        },
      ],
    };

    if (combinedNames.length > 0) {
      combinedNames.forEach((data: any) => {
        let dobData = data.idType == 'NRIC' ? nricDOB(data.idNo) : '0000-00-00';

        payload.personsList.push({
          fullName: data.fullName,
          dob: dobData == '0000-00-00' || dobData == 'Invalid Date' ? '0000-00-00' : moment(dobData).format('YYYY-MM-DD'),
          nationCode: data.nationality,
          countryCode: 'MAL',
          idType: data.idType,
          idval: data.idType == 'NRIC' ? data.idNo.replaceAll('-', '') : data.idNo,
          role: 'JOINT NAME',
        })
      })
    }

    return this.quoteProgessService
      .postCheckSanction(payload).pipe(map((res: any) => {
        const _data = res.personsList ? res.personsList : [];
        const _haveErr = _data.filter((item: any) => item.status != 'N');
        patchState({
          sanction: Boolean(_haveErr.length > 0),
        });
      }));
  }

  @Action(CHECK_USER_INFO)
  public checkUserInfo(
    { patchState }: StateContext<QUOTE_PROGRESS_STATE_MODEL>,
    { payload }: CHECK_USER_INFO
  ) {

    return this.quoteProgessService
      .postQualityCheck(payload).pipe(map((res: any) => {
        if (res.hasOwnProperty('isMatched')) {
          patchState({
            checkUserInfo: JSON.parse(res['isMatched']),
          });
        } else {
          patchState({
            checkUserInfo: false,
          });
        }
      }));
  }

  @Action(CHECK_HSBC_CARD)
  public checkHSBCCard(
    { patchState }: StateContext<QUOTE_PROGRESS_STATE_MODEL>,
    { cardNumber }: CHECK_HSBC_CARD
  ) {
    const sourceSystem = this._store.selectSnapshot((item) => item.GeneralState.sourceSystem);

    return this.quoteProgessService
      .getIsValidBinCardNumber(sourceSystem, cardNumber).pipe(map((resCardNumber: any) => {
        if (resCardNumber.hasOwnProperty('isValid')) {
          patchState({
            checkUserInfo: JSON.parse(resCardNumber['isValid']),
          });
        } else {
          patchState({
            checkUserInfo: false,
          });
        }
      }));
  }

  @Action(GET_QUOTE_INFO)
  public getQuoteInfo(
    { patchState }: StateContext<QUOTE_PROGRESS_STATE_MODEL>,
    { referenceNumber }: GET_QUOTE_INFO
  ) {
    return this.quoteProgessService
      .getQuoteInfo(referenceNumber).pipe(map((res: any) => {
        patchState({
          paymentResult: res.Result,
        });
      }));
  }

  @Action(RESET_QUOTE_INFO)
  public resetQuoteInfo(
    { patchState, getState }: StateContext<QUOTE_PROGRESS_STATE_MODEL>
  ) {
    const currentState = getState();

    return patchState({
      ...currentState,
      paymentResult: ''
    })
  }


  @Action(GET_BUNDLE_CONFIG)
  public postBundleConfig({ patchState }: StateContext<QUOTE_PROGRESS_STATE_MODEL>, { PRODUCT_CAT }: GET_BUNDLE_CONFIG) {
    const bundle = this._store.selectSnapshot(state => state.GeneralState.customViewObj.bundle);
    const payload = {
      partnerId: PRODUCT_CAT,
      bundle: bundle ? bundle : 'B0',
    };

    return this.quoteProgessService.postBundleConfig(payload).pipe(
      map((res) => {
        patchState({
          bundleConfig: res,
          bundle: bundle ? bundle : 'B0',
        });
      })
    );
  }

  @Action(GET_DOCUMENTS_CONFIG)
  public getDocumentsConfig({ patchState, getState }: StateContext<QUOTE_PROGRESS_STATE_MODEL>) {
    const currentState = getState();
    const sourceSystem = this._store.selectSnapshot((item) => item.GeneralState.sourceSystem);
    var doumentList = PARTNER_DOCUMENT_MENU;
    var documentData = DOCUMENT_MENU;
    var bannerData;

    let list = doumentList.filter((partner: any) => {
      return partner.partner === sourceSystem
    });

    if (list.length !== 0) {
      if (list[0].document !== undefined) {
        documentData = [];
        list[0].document?.forEach((data: any) => {
          let menuItem = {} as MENU_ITEM;
          menuItem.label = data.label;
          menuItem.queryParams = data.queryParams;
          documentData.push(menuItem);
        });
      }
    }

    return patchState({
      ...currentState,
      documentData: documentData,
      bannerData: bannerData
    });
  }
}