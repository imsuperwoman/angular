import { Injectable } from '@angular/core';
import { State, Action, StateContext, Selector, Store } from '@ngxs/store';
import { QuoteProgessService } from '../../services/quote-progress.service';
import {
  CHECK_HSBC_CARD, CHECK_USER_INFO, DO_SANCTION_CHECKING, GET_DOCUMENTS_CONFIG, GET_QUOTE_INFO,
  GET_VALIDATE_VOUCHER, JOURNEY_TRAVELLER_DETAILS, PLAN_RECOMMENDATION, PROMO_LIST, PROMO_PLAN_RECOMMENDATION,
  QUOTE_PROGRESS, QUOTE_PROGRESS_CHECKOUT, RESET_PLAN_RECOMMENDATION, RESET_PROMO_PLAN_RECOMMENDATION,
} from '../actions/quote-progress.action';
import { CheckSanction, DEFAULTS, PlanRecommendation, QUOTE_PROGRESS_STATE_MODEL } from '../model/quote-progress.model';
import { Risk, RiskGrp, RiskPerson, RiskList, InsuredPerson } from '../model/risk.model';
import { map } from 'rxjs';
import * as moment from 'moment';
import { ATC_DOCUMENT_MENU, ATE_DOCUMENT_MENU, PARTNER_DOCUMENT_MENU } from '../../constants/travel-care-constants';
import { MENU_ITEM } from '@constants/header-constants';
import { GeneralService } from '../../services/general.service';
import { nricDOB } from '@functions/validator-nric.function';
import { GENDER, TRDESTINATION, TRGRPCODE } from '../../constants/content.static-data';


@State<QUOTE_PROGRESS_STATE_MODEL>({
  name: 'QuoteProgessState',
  defaults: DEFAULTS,
})
@Injectable()
export class QuoteProgessState {
  step1: any
  step2: any
  step3: any
  step4: any
  generalState: any
  PRODUCT_TYPE: any
  PRODUCT_CAT: any;

  constructor(private quoteProgessService: QuoteProgessService, private _store: Store,
    public generalService: GeneralService) {
    generalService.setConfig();
    this.PRODUCT_TYPE = generalService.getConfig().PRODUCT_TYPE;
    this.PRODUCT_CAT = generalService.getConfig().PRODUCT_CAT;
  }

  @Selector()
  public static documentData(state: any) {
    return state.documentData
  }

  getSelectSnapshot() {
    this.generalState = this._store.selectSnapshot((state) => state.GeneralState);
    this.step1 = this._store.selectSnapshot((state) => state.UserInputState.userInput.step1);
    this.step2 = this._store.selectSnapshot((state) => state.UserInputState.userInput.step2);
    this.step3 = this._store.selectSnapshot((state) => state.UserInputState.userInput.step3);
    this.step4 = this._store.selectSnapshot((state) => state.UserInputState.userInput.step4);
  }

  @Action(GET_DOCUMENTS_CONFIG)
  public getDocumentsConfig({ patchState, getState }: StateContext<QUOTE_PROGRESS_STATE_MODEL>) {
    const currentState = getState();
    const sourceSystem = this._store.selectSnapshot((item) => item.GeneralState.sourceSystem);
    var doumentList = PARTNER_DOCUMENT_MENU;

    var documentData: any;
    if (this.PRODUCT_TYPE === "ATC") {
      documentData = ATC_DOCUMENT_MENU
    } else {
      documentData = ATE_DOCUMENT_MENU
    }

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
      documentData: documentData
    });
  }

  @Action(GET_VALIDATE_VOUCHER)
  public getValidateVoucher({ patchState }: StateContext<QUOTE_PROGRESS_STATE_MODEL>) {
    this.getSelectSnapshot();
    let request = {
      agentCode: this.generalState.productConfig.AgentCode,
      productCategory: 'TC',
      voucherCode: this.generalState.productConfig.voucherCode
    };
    return this.quoteProgessService.postValidateVoucher(request).pipe(
      map((res: any) => {
        return patchState({
          staffResult: res,
        });
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
      })
      );
  }

  @Action(PLAN_RECOMMENDATION)
  public planRecommendation({ patchState, getState }: StateContext<QUOTE_PROGRESS_STATE_MODEL>, { user_journey, step }: PLAN_RECOMMENDATION) {
    this.getSelectSnapshot();

    const currentState = getState();
    var payload = this.quoteProgressObject(currentState, user_journey, step);

    return this.quoteProgessService.putPlanRecommendations(payload).pipe(
      map((res) => {
        patchState({
          planRecommendation: res,
        });
      })
    );
  }

  @Action(PROMO_PLAN_RECOMMENDATION)
  public pomoPlanRecommendation({ patchState, getState }: StateContext<QUOTE_PROGRESS_STATE_MODEL>, { user_journey, step }: PLAN_RECOMMENDATION) {
    this.getSelectSnapshot();

    const currentState = getState();
    var payload = this.quoteProgressObject(currentState, user_journey, step);

    if (step > 4) {
      payload = this.quoteProgressCompleteObject(currentState, payload);
      if (this.step4) {
        payload.PromoList = this.step4;
      }
    }

    return this.quoteProgessService.putPlanRecommendations(payload).pipe(
      map((res) => {
        patchState({
          pomoPlanRecommendation: res,
        });
      })
    );
  }

  @Action(RESET_PROMO_PLAN_RECOMMENDATION)
  public resetPomoPlanRecommendation({ patchState, getState }: StateContext<QUOTE_PROGRESS_STATE_MODEL>) {
    return patchState({
      pomoPlanRecommendation: {}
    });
  }

  @Action(JOURNEY_TRAVELLER_DETAILS)
  public journeyTravellerDetails({ patchState, getState }: StateContext<QUOTE_PROGRESS_STATE_MODEL>, { user_journey, step }: JOURNEY_TRAVELLER_DETAILS) {
    this.getSelectSnapshot();

    const currentState = getState();
    var quoteProgress = this.quoteProgressObject(currentState, user_journey, step);
    quoteProgress = this.quoteProgressCompleteObject(currentState, quoteProgress);
    var checkUBB = this.checkUBBObject(currentState);

    let payload = {
      "checkUBB": checkUBB,
      "quoteProgress": quoteProgress
    }
    return this.quoteProgessService.putJourneyTravellerDetails(payload).pipe(
      map((res) => {
        patchState({
          journeyTravellerDetails: res,
        });
      })
    );
  }

  @Action(QUOTE_PROGRESS_CHECKOUT)
  public quoteProgessCheckout({ patchState, getState }: StateContext<QUOTE_PROGRESS_STATE_MODEL>,
    { user_journey, step, renew, premiumPayable }: QUOTE_PROGRESS_CHECKOUT) {
    this.getSelectSnapshot();

    const currentState = getState();
    var quoteProgress = this.quoteProgressObject(currentState, user_journey, step);
    quoteProgress = this.quoteProgressCompleteObject(currentState, quoteProgress);
    quoteProgress.PromoList = this.step4 ? this.step4 : [];
    quoteProgress.AutoRenewalInd = renew ? renew : '';
    quoteProgress.PremiumDueRounded = premiumPayable;
    var journeys = this._store.selectSnapshot((state) => state.QuoteProgessState.quoteProgress.Result.Journeys);

    quoteProgress.Journeys = journeys;


    return this.quoteProgessService.putQuoteProgress(quoteProgress).pipe(
      map((res) => {
        patchState({
          quoteProgress: res,
          travellerCheckout: quoteProgress
        });
      })
    );
  }

  @Action(PROMO_LIST)
  public promoList({ patchState, getState }: StateContext<QUOTE_PROGRESS_STATE_MODEL>) {
    this.getSelectSnapshot();

    const currentState = getState();
    var planRecommendation = currentState.planRecommendation.planRecommendation;
    return this.quoteProgessService.getPromoList(planRecommendation.contract.contractNumber).pipe(
      map((res) => {
        patchState({
          promoList: res,
        });
      })
    );
  }

  @Action(RESET_PLAN_RECOMMENDATION)
  public resetPlanRecommendation({ patchState }: StateContext<QUOTE_PROGRESS_STATE_MODEL>) {
    return patchState({
      planRecommendation: {}
    });
  }

  @Action(QUOTE_PROGRESS)
  public quoteProgress({ patchState, getState }: StateContext<QUOTE_PROGRESS_STATE_MODEL>, { user_journey, step }: QUOTE_PROGRESS) {
    this.getSelectSnapshot();
    const currentState = getState();
    var payload = this.quoteProgressObject(currentState, user_journey, step);

    return this.quoteProgessService.putQuoteProgress(payload).pipe(
      map((res) => {
        patchState({
          quoteProgress: res,
        });
      })
    );
  }

  checkUBBObject(currentState: any) {
    var result = currentState.quoteProgress.Result;
    var mainPolicyHolder = this.step3.mainPolicyHolder;
    var Risk = new RiskList();
    Risk.InsuredPerson = {} as InsuredPerson;

    Risk.RiskId = 1;
    Risk.InsuredPerson.IdentificationNumber = mainPolicyHolder.idNo.replaceAll('-', '');
    Risk.InsuredPerson.IdType = mainPolicyHolder.idType;
    Risk.InsuredPerson.CoverageType = this.step1.coveragetype;
    Risk.CoverList = [{ "CoverId": 1 }];

    var RiskArr = [];
    RiskArr.push(Risk)
    if (this.step3.travellerArrayForm) {
      var count = 2
      for (var travel of this.step3.travellerArrayForm) {
        var Risk = new RiskList();
        Risk.InsuredPerson = {} as InsuredPerson;
        Risk.RiskId = count;
        Risk.InsuredPerson.IdentificationNumber = travel.idNo.replaceAll('-', '');
        Risk.InsuredPerson.IdType = travel.idType;
        Risk.InsuredPerson.CoverageType = this.step1.coveragetype;
        Risk.CoverList = [{ "CoverId": count }];
        count++;
        RiskArr.push(Risk)
      }
    }
    let payload = {
      "ReferenceNo": result.QuotationNumber,
      "SourceSystem": this.generalState.sourceSystem,
      "ProductCat": this.PRODUCT_CAT,
      "Policy": {
        "PolicyEffectiveDate": result.EffectiveDate,
        "PolicyExpiryDate": result.ExpiryDate,
        "PolicyIssueDate": result.EffectiveDate,
        "Client": {},
        "RiskList": RiskArr
      }
    }
    return payload;
  }

  quoteProgressCompleteObject(currentState: any, quoteProgress: any) {
    var premium = currentState.planRecommendation.planRecommendation?.premium;
    var result = currentState.quoteProgress.Result;

    quoteProgress.ClientID = this.step3.mainPolicyHolder.idNo.replaceAll('-', '');
    quoteProgress.ClientIDType = this.step3.mainPolicyHolder.idType;
    quoteProgress.ClientName = this.step3.mainPolicyHolder.fullname;
    quoteProgress.Country = this.step3.mainPolicyHolder.nationality;

    quoteProgress.DOB = moment(this.step3.mainPolicyHolder.dob).format('YYYY-MM-DD');
    //quoteProgress.EmailAddress = this.step3.mainPolicyHolder.email;
    quoteProgress.EmailAddress = this.step3.mainPolicyHolder.customerEmail;
    quoteProgress.Gender = GENDER[this.step3.mainPolicyHolder.gender];

    quoteProgress.DiscountAmt = premium.discountAmt;
    quoteProgress.DiscountPct = premium.discountPct;
    quoteProgress.PremiumDueRounded = premium.premiumDueRounded;

    quoteProgress.MatchAgentEmail = "N";
    quoteProgress.MatchAgentMobile = "N";
    quoteProgress.MobileNumber = this.step3.mainPolicyHolder.phonePrefix.replaceAll('+', '') + this.step3.mainPolicyHolder.phoneNo;

    var postCodeState = this._store.selectSnapshot((state) => state.GeneralState.postcodeList);
    const stateCode = postCodeState.find((item: any) => item.Postcode == this.step3.mainPolicyHolder.address.postcode);
    quoteProgress.Address_1 = this.step3.mainPolicyHolder.address.line1;
    quoteProgress.Address_2 = this.step3.mainPolicyHolder.address.line2 !== null ? this.step3.mainPolicyHolder.address.line2 : '';
    quoteProgress.Address_3 = this.step3.mainPolicyHolder.address.line3 !== null ? this.step3.mainPolicyHolder.address.line3 : '';
    quoteProgress.PostCode = this.step3.mainPolicyHolder.address.postcode;
    quoteProgress.City = stateCode.CityCode;
    quoteProgress.State = stateCode.StateCode;

    var riskGrp = result.Risk.RiskGrp.find((r: any) => r.TravelerSequence === 1)
    quoteProgress.Risk = {} as Risk;
    quoteProgress.Risk.RiskGrp = [];
    var principal = new RiskGrp();
    principal['Cover'] = JSON.parse(JSON.stringify(riskGrp.Cover));
    if (this.step3.mountaineeringForm.endDate != '') {

      principal['Cover']['CoverGrp'][0]['SubCover'] = {
        "SubCoverGrp": [
          {
            "EffectiveDate": moment(this.step3.mountaineeringForm.startDate).format('YYYY-MM-DD'),
            "ExpiryDate": moment(this.step3.mountaineeringForm.endDate).format('YYYY-MM-DD')
          }
        ]
      }
    }
    principal['ItmNo'] = riskGrp.ItmNo;
    principal['RiskId'] = riskGrp.RiskId;
    principal['RiskType'] = 'PERSON';
    principal['RiskLocated'] = 'WM';
    principal['TravelerSequence'] = 1;
    principal.RiskPerson['Age'] = this.step3.mainPolicyHolder.age;
    principal.RiskPerson['AgeRange'] = quoteProgress.AgeRange;
    principal.RiskPerson['DOB'] = moment(this.step3.mainPolicyHolder.dob).format('YYYY-MM-DD');
    principal.RiskPerson['Email'] = quoteProgress.EmailAddress;
    principal.RiskPerson['Gender'] = this.step3.mainPolicyHolder.gender;
    principal.RiskPerson['IdType1'] = quoteProgress.ClientIDType;
    principal.RiskPerson['IdValue1'] = quoteProgress.ClientID;
    principal.RiskPerson['MobileNumber'] = quoteProgress.MobileNumber
    principal.RiskPerson['Name'] = this.step3.mainPolicyHolder.fullname
    principal.RiskPerson['Nationality'] = this.step3.mainPolicyHolder.nationality
    principal.RiskPerson['InsuredType'] = 'P';
    principal.RiskPerson['Principal'] = true;
    principal.RiskPerson['MountaineeringInd'] = this.step3.mainPolicyHolder.mainPolicyholderMount;

    if (this.step3.mainPolicyHolder.guardianName != '') {
      principal.RiskPerson['GuardianIdType'] = this.step3.mainPolicyHolder.guardianIdType;
      principal.RiskPerson['GuardianIdValue'] = this.step3.mainPolicyHolder.guardianIdNo;
      principal.RiskPerson['GuardianName'] = this.step3.mainPolicyHolder.guardianName;
    }

    principal['RiskNomineeList'] = {};

    let nomineeGrp: any = [];
    this.step3.nomineeArrayForm[0].nomineeArrayName.forEach((data: any) => {
      if (data.fullname != '') {
        nomineeGrp.push({
          "Nationality": data.nationality,
          "NomineeId": data.idNo.replaceAll('-', ''),
          "NomineeIdType": data.idType,
          "NomineeName": data.fullname,
          "Relation": data.relationship,
          "SharePct": data.percentage
        })
      }
    })
    principal['RiskNomineeList']['NomineeGrp'] = nomineeGrp;

    quoteProgress.Risk.RiskGrp.push(principal);

    var count = 2;
    for (var i = 0; i < this.step3.travellerArrayForm?.length; i++) {
      var riskGrp = result.Risk.RiskGrp.find((r: any) => r.TravelerSequence === count);
      var traveller = new RiskGrp();
      traveller['Cover'] = riskGrp.Cover;
      traveller['ItmNo'] = riskGrp.ItmNo;
      traveller['RiskId'] = riskGrp.RiskId;
      traveller['RiskType'] = 'PERSON';
      traveller['RiskLocated'] = 'WM';
      traveller['TravelerSequence'] = count;
      if (this.step1.trgrpcode === 'MT') {
        traveller['RiskParentId'] = riskGrp.RiskId;
      }
      traveller.RiskPerson['Name'] = this.step3.travellerArrayForm[i].fullname;
      traveller.RiskPerson['Age'] = this.step3.travellerArrayForm[i].age
      traveller.RiskPerson['AgeRange'] = this.step3.travellerArrayForm[i].ageRange;
      traveller.RiskPerson['DOB'] = moment(this.step3.travellerArrayForm[i].dob).format('YYYY-MM-DD');
      traveller.RiskPerson['InsuredType'] = (this.step1.trgrpcode === 'MT') ? 'P' : 'D';
      traveller.RiskPerson['Gender'] = this.step3.travellerArrayForm[i].gender;
      traveller.RiskPerson['IdType1'] = this.step3.travellerArrayForm[i].idType;
      traveller.RiskPerson['IdValue1'] = this.step3.travellerArrayForm[i].idNo;
      traveller.RiskPerson['Nationality'] = this.step3.travellerArrayForm[i].nationality
      traveller.RiskPerson['Email'] = this.step3.travellerArrayForm[i]?.email;
      traveller.RiskPerson['MobileNumber'] =
        this.step3.travellerArrayForm[i]?.phonePrefix.replaceAll('+', '')
        + this.step3.travellerArrayForm[i]?.phoneNo;
      traveller.RiskPerson['Relationship'] = this.step3.travellerArrayForm[i]?.relationship;
      traveller['RiskNomineeList'] = {};
      traveller.RiskPerson['MountaineeringInd'] = this.step3.travellerArrayForm[i]?.travellerMount;

      let nomineeGrp: any = [];
      for (let nomi of this.step3.nomineeArrayForm) {
        if (nomi.parentName == traveller.RiskPerson['Name']) {
          nomi.nomineeArrayName.forEach((data: any) => {
            if (data.fullname != '') {
              nomineeGrp.push({
                "Nationality": data.nationality,
                "NomineeId": data.idNo.replaceAll('-', ''),
                "NomineeIdType": data.idType,
                "NomineeName": data.fullname,
                "Relation": data.relationship,
                "SharePct": data.percentage
              })
            }
          })
        }
      }
      traveller['RiskNomineeList']['NomineeGrp'] = nomineeGrp;
      quoteProgress.Risk.RiskGrp.push(traveller);
      count++;
    }

    return quoteProgress;
  }

  quoteProgressObject(currentState: any, user_journey: any, step: any) {
    console.log('user_journey' + user_journey + ' step' + step);
    let payload = {} as PlanRecommendation;
    payload.AgeRange = this.step1.tragerange;
    payload.AgentCode = this.generalState.productConfig.AgentCode;
    payload.Area = this.step1.trdestination;
    payload.CoverageType = this.step1.coveragetype;
    payload.ProductCode = this.generalState.productConfig.ProductCode;
    payload.ProductShortDescription = TRGRPCODE[this.step1.trgrpcode];

    if (step == 4) {
      payload.Journeys = {
        Journey: {
          "JourneyCovType": this.step1.coveragetype,
          "JourneyArea": this.step1.trdestination,
          "JourneyFrom": "MLS",
          "JourneyTo": this.step1.trdestination,
          "JourneyFromDescp": "Malaysia",
          "JourneyToDescp": TRDESTINATION[this.step1.trdestination]
        }
      }
    }

    if (step > 1) {
      var planRecommendation = currentState.planRecommendation?.planRecommendation;
      payload.QuotationNumber = planRecommendation.contract.contractNumber
    }

    payload.DomesticInd = this.step2.domesticCoverage?.domesticCoverageCheck ? this.step2.domesticCoverage?.domesticCoverageCheck : false;
    payload.ExpiryDate = moment(this.step1.endDate).format('YYYY-MM-DD');
    payload.EffectiveDate = moment(this.step1.startDate).format('YYYY-MM-DD');
    payload.NoOfAdults = this.step1.NoOfAdults != '' ? this.step1.NoOfAdults : '0';
    payload.NoOfChildren = this.step1.NoOfChildren != '' ? this.step1.NoOfChildren : '0';
    payload.NoOfSeniors = this.step1.NoOfSeniors != '' ? this.step1.NoOfSeniors : '0';
    payload.ProductCategory = this.PRODUCT_CAT;
    payload.ProductType = this.PRODUCT_TYPE;
    payload.SourceSystemCat = this.generalState.productConfig.SourceSystemCat;
    payload.QuotationProgress = user_journey;
    payload.TravelWith = this.step1.trgrpcode;
    payload.SourceSystem = this.generalState.sourceSystem;
    payload.Risk = {} as Risk;
    payload.Risk.RiskGrp = [];

    var principal = new RiskGrp();
    if (step == 1) {
      principal.RiskLocated = "WM";
      principal.RiskType = "PERSON";
      principal.TravelerSequence = 1;
      principal.RiskPerson = new RiskPerson();
      principal.RiskPerson.AgeRange = this.step1.tragerange;
      principal.RiskPerson.Name = 'TRAVELLER ' + 1
      principal.RiskPerson.Principal = true;
      principal.RiskPerson.InsuredType = 'P';
    } else {
      let quoteDetails = currentState.planRecommendation?.quoteDetails
      let risk = quoteDetails.Result.Risk.RiskGrp.find((x: any) => x.TravelerSequence == 1);

      principal.RiskId = risk.RiskId
      principal.RiskLocated = "WM";
      principal.RiskType = "PERSON";
      principal.TravelerSequence = 1;
      principal.RiskPerson = new RiskPerson();
      principal.RiskPerson.AgeRange = this.step1.tragerange;
      principal.RiskPerson.Name = 'TRAVELLER ' + 1
      principal.RiskPerson.Principal = true;
      principal.RiskPerson.InsuredType = 'P';
    }

    if (step > 1) {
      var premiumList = currentState?.planRecommendation.planRecommendation?.premiumList;
      principal.Cover = { "CoverGrp": [{ "GrossPrem": premiumList[0].premium.grossPremium }] }
    }

    if (step > 1) {
      principal.RiskPerson.ExtSportsInd = false;
      if (this.step2?.sportsCoverage?.sportsArray) {
        var sportsArray = this.step2.sportsCoverage?.sportsArray.find((s: any) => s.TravelerSequence === 1)
        principal.RiskPerson.ExtSportsInd = sportsArray?.ExtSportsInd ? sportsArray?.ExtSportsInd : false;
      } else {
        if (this.step2?.sportsCoverage?.sportsCoverageCheck) {
          principal.RiskPerson.ExtSportsInd = this.step2?.sportsCoverage?.sportsCoverageCheck;
        } else {
          principal.RiskPerson.ExtSportsInd = false;
        }
      }

      if (this.step2.mountaineeringCoverage?.mountaineerArray) {
        var mountaineerArray = this.step2.mountaineeringCoverage.mountaineerArray.find((s: any) => s.TravelerSequence === 1);
        if (mountaineerArray) {
          principal.RiskPerson.MountaineeringInd = mountaineerArray.MountaineeringInd;
          principal.RiskPerson.DOB = this.getDOB(mountaineerArray.adultGroup);
          payload.MountEvent = "change";
          principal.RiskPerson.Valid = true;
        }
      }
    }

    payload.Risk.RiskGrp.push(principal);

    var number = principal.TravelerSequence;

    var premiumList = currentState?.planRecommendation?.planRecommendation?.premiumList;
    if (parseInt(this.step1.NoOfAdults) > 0) {
      payload = this.addRiskGroup(payload, parseInt(this.step1.NoOfAdults), number, "A", premiumList, step);
      number = number + parseInt(this.step1.NoOfAdults);
    }
    if (parseInt(this.step1.NoOfChildren) > 0) {
      payload = this.addRiskGroup(payload, parseInt(this.step1.NoOfChildren), number, "C", premiumList, step);
      number = number + parseInt(this.step1.NoOfChildren);
    }
    if (parseInt(this.step1.NoOfSeniors) > 0) {
      payload = this.addRiskGroup(payload, parseInt(this.step1.NoOfSeniors), number, "S", premiumList, step);
      number = number + parseInt(this.step1.NoOfSeniors);
    }
    if (this.generalState.flowType === 'STAFFR') {
      payload.Voucher = {
        "VoucherCode": this.generalState.productConfig.voucherCode,
        "VoucherStatus": this.generalState.productConfig.voucherCodeInd,
      }
    } else {
      payload.Voucher = {
        "VoucherCode": ""
      }
    }

    if (this.step3?.mainPolicyHolder?.cardNo1) {
      payload.ClientRefNo = this.step3?.mainPolicyHolder.cardNo1
    }

    if (this.step3?.mainPolicyHolder?.cardNo2) {
      payload.ClientRefName = this.step3?.mainPolicyHolder.cardNo2
    }

    if (this.step3?.mainPolicyHolder?.cardNo3) {
      payload.ClientRefPolicyNo = this.step3?.mainPolicyHolder.cardNo3
    }

    if (this.step3?.mainPolicyHolder?.staffId) {
      payload.ReferralSalesStaffId = this.step3?.mainPolicyHolder.staffId
    }
    payload.UTMCampaign = this.generalState.customViewObj?.utm_campaign;
    payload.UTMMedium = this.generalState.customViewObj?.utm_medium;

    return payload;
  }

  addRiskGroup(payload: any, numberOfPerson: any, currentNumber: any, AgeRange: any, premiumList: any, step: any) {

    var number = currentNumber + 1;
    var sportsArray, grossPremium;
    if (step > 1) {
      if (premiumList) {
        grossPremium = premiumList.find((s: any) => s.ageRange === AgeRange);
      }
    }

    for (var x = 0; x < numberOfPerson; x++) {
      var other = new RiskGrp();
      other.RiskLocated = "WM";
      other.RiskType = "PERSON";
      other.TravelerSequence = number;
      other.RiskPerson = new RiskPerson();
      other.RiskPerson.AgeRange = AgeRange;
      other.RiskPerson.DOB = this.getDOB(AgeRange);
      other.RiskPerson.Name = 'TRAVELLER ' + number;
      other.RiskPerson.InsuredType = (this.step1.trgrpcode === 'MT') ? 'P' : 'D';
      if (step > 1) {
        var result = this._store.selectSnapshot((state => state.QuoteProgessState.planRecommendation.quoteDetails.Result));
        let risk = result.Risk.RiskGrp.find((x: any) => x.TravelerSequence == number);
        other.RiskId = risk.RiskId;
        other.Cover = { "CoverGrp": [{ "GrossPrem": grossPremium.premium?.grossPremium }] }

        if (payload.TravelWith === 'FM') {
          let pSports = payload.Risk.RiskGrp.find((x: any) => x.TravelerSequence == 1);
          other.RiskPerson.ExtSportsInd = pSports.RiskPerson?.ExtSportsInd;
        } else {
          sportsArray = this.step2?.sportsCoverage?.sportsArray.find((s: any) => s.TravelerSequence === number)
          other.RiskPerson.ExtSportsInd = sportsArray?.ExtSportsInd ? sportsArray?.ExtSportsInd : false;
        }
      }
      if (step > 1 && this.step2?.mountaineeringCoverage?.mountaineeringCoverageCheck) {
        var mountaineerArray = this.step2.mountaineeringCoverage.mountaineerArray.find((s: any) => s.TravelerSequence === other.TravelerSequence);

        if (mountaineerArray) {
          other.RiskPerson.MountaineeringInd = mountaineerArray.MountaineeringInd;
          other.RiskPerson.DOB = this.getDOB(mountaineerArray.adultGroup);
        }
      }
      other.RiskPerson.Valid = true;
      payload.Risk.RiskGrp.push(other);
      number++;
    }
    return payload;
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
      })
      );
  }

  getDOB(AgeRange: any) {
    let dob = '';
    const today = new Date();
    if (AgeRange == 'C') {
      dob = moment(today).subtract('year', 17).startOf('year').format('YYYY-MM-DD');
    } else if (AgeRange == 'A' || AgeRange == 'adult1') {
      dob = moment(today).subtract('year', 18).startOf('year').format('YYYY-MM-DD');
    } else if (AgeRange == 'adult2') {
      dob = moment(today).subtract('year', 41).startOf('year').format('YYYY-MM-DD');
    } else {
      dob = moment(today).subtract('year', 80).startOf('year').format('YYYY-MM-DD');
    }
    return dob;
  }

  @Action(DO_SANCTION_CHECKING)
  public postCheckSanction(
    { patchState }: StateContext<QUOTE_PROGRESS_STATE_MODEL>,
    { customerDetails, combinedNames, quotationNumber, role }: DO_SANCTION_CHECKING
  ) {

    let payload = {} as CheckSanction;
    payload.appName = "AZOL";
    payload.clientRefNo = quotationNumber,
      payload.personsList = [];

    if (role == "TRAVELLER") {
      payload.personsList.push({
        fullName: customerDetails.fullname,
        dob: moment(customerDetails.dob).format('YYYY-MM-DD'),
        nationCode: customerDetails.nationality,
        countryCode: customerDetails.nationality,
        idType: customerDetails.idType,
        idval: customerDetails.idNo.replaceAll('-', ''),
        role: 'POLICY HOLDER',
      })
    }

    if (combinedNames?.length > 0) {
      combinedNames.forEach((data: any) => {
        let dobData = data.idType == 'NRIC' ? nricDOB(data.idNo) : '0000-00-00';

        payload.personsList.push({
          fullName: data.fullname,
          dob: dobData == '0000-00-00' || dobData == 'Invalid Date' ? '0000-00-00' : moment(dobData).format('YYYY-MM-DD'),
          nationCode: data.nationality,
          countryCode: data.nationality,
          idType: data.idType,
          idval: data.idType == 'NRIC' ? data.idNo.replaceAll('-', '') : data.idNo,
          role: role,
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
      })
      );
  }

  @Action(GET_QUOTE_INFO)
  public getQuoteInfo(
    { patchState }: StateContext<QUOTE_PROGRESS_STATE_MODEL>,
    { referenceNumber }: GET_QUOTE_INFO
  ) {
    return this.quoteProgessService.getQuoteInfo(referenceNumber).pipe(
      map((res: any) => {
        patchState({
          paymentResult: res.Result,
        });
      })
    );
  }
}
