import { Injectable } from '@angular/core';
import { State, Action, StateContext, Selector, Store } from '@ngxs/store';
import { QUOTE_PROGRESS_STATE_MODEL, DEFAULTS, } from '../model/quote-progress-state.model';
import { QuoteProgessService } from '../../services/quote-progress.service';
import {
  GET_AGENT_INFO, GET_DOCUMENTS_CONFIG, POST_VEHICLE_DETAILS,
  MO_QUOTE_PROGRESS, MAKE_LIST, PIAM, MODEL_LIST, REFERED_RISK_DETAILS,
  MO_QUOTE, MO_CHECKUBB, GET_SUMINSURED_LIST, MO_CHECK_SANCTION, MO_QUALITY_CHECK, MO_CONTACT_AGENT, GET_VALIDATE_ID, RESET_QUOTE_INFO, GET_QUOTE_INFO, GET_VALIDATE_VOUCHER, CHECK_HSBC_CARD
} from '../actions/quote-progress.action';
import { map } from 'rxjs/operators';
import { DOCUMENT_MENU, PARTNER_DOCUMENT_MENU } from 'projects/motor-comprehensive/src/app/constants/motor-online-constants';
import { DriverGrp, QUOTE_PROGRESS_MODEL, RiskDrvrList, SubCover, SubCoverGrp } from '../model';
import * as moment from 'moment';
import { CheckUBB } from '../model/check-ubb.model';
import { MENU_ITEM } from '@constants/header-constants';
@State<QUOTE_PROGRESS_STATE_MODEL>({
  name: 'QuoteProgessState',
  defaults: DEFAULTS,
})
@Injectable()
export class QuoteProgessState {
  constructor(private quoteProgessService: QuoteProgessService, private _store: Store) { }

  @Selector()
  public static documentData(state: any) {
    return state.documentData
  }

  @Selector()
  public static bannerData(state: any) {
    return state?.bannerData[0].banner
  }

  @Selector()
  public static vehicleDetails(state: any) {
    return state.vehicleDetails
  }

  @Selector()
  public static quoteProgress(state: any) {
    return state.quoteProgress
  }

  @Selector()
  public static AVMakeList(state: any) {
    return state.AVMakeList
  }

  @Selector()
  public static VehicleMakeInfo(state: any) {
    return state.VehicleMakeInfo.Models
  }

  @Selector()
  public static MakeList(state: any) {
    return state.MakeList
  }
  @Selector()
  public static selectedPackageCode(state: any) {
    return state?.quote?.selectedPackageCode
  }

  @Selector()
  public static SumInsuredList(state: any) {
    return state.SumInsuredList
  }
  step1: any
  step2: any
  step3: any
  step4: any
  postCodeState: any
  generalState: any
  vehicleDetailsState: any
  quoteProgress: any
  quoteState: any;
  noOfClaims = '0';
  agentInfo: any;
  agentCodeStaff: any;
  request: any;

  getSelectSnapshot() {
    this.step1 = this._store.selectSnapshot((state) => state.UserInputState.userInput.step1);
    this.step2 = this._store.selectSnapshot((state) => state.UserInputState.userInput.step2);
    this.step3 = this._store.selectSnapshot((state) => state.UserInputState.userInput.step3);
    this.step4 = this._store.selectSnapshot((state) => state.UserInputState.userInput.step4);

    this.postCodeState = this._store.selectSnapshot((state) => state.GeneralState.postcodeList);
    this.generalState = this._store.selectSnapshot((state) => state.GeneralState);
    this.vehicleDetailsState = this._store.selectSnapshot((state) => state.QuoteProgessState.vehicleDetails);
    this.quoteProgress = this._store.selectSnapshot((state) => state.QuoteProgessState.quoteProgress?.Result);
    this.quoteState = this._store.selectSnapshot((state) => state.QuoteProgessState.quote);
    this.agentInfo = this._store.selectSnapshot((state) => state.QuoteProgessState.agentInfo);

    if (this.vehicleDetailsState?.ismSres) {
      var noOfClaim = this.vehicleDetailsState.ismSres.find((obj: any) => { return obj.code === "E012" })?.value;
      this.noOfClaims = noOfClaim ? noOfClaim : '0';
    }
  }

  @Action(POST_VEHICLE_DETAILS)
  public async postVehicleDetails({ patchState }: StateContext<QUOTE_PROGRESS_STATE_MODEL>, { payload }: POST_VEHICLE_DETAILS) {
    this.getSelectSnapshot();

    this.request = {
      vehicleLicenseId: payload.plateNumber,
      identityType: payload.idType,
      identityNumber: payload.idNo.replaceAll('-', ''),
      sourceSystem: this.generalState.sourceSystem,
      checkUbbInd: 1,
    };

    return this.quoteProgessService.postVehicleDetails(this.request).pipe(
      map((res: any) => {
        if (res.ismSrespCode && res.ismSrespValue) {
          var ismSrespCode = res?.ismSrespCode.split("|");
          var ismSrespValue = res?.ismSrespValue.split("|");

          const CombinedArray =
            ismSrespCode.map((item: any, index: any) =>
              ({ code: item, value: ismSrespValue[index] }));
          res['ismSres'] = CombinedArray;
        }
        return patchState({
          vehicleDetails: res,
        })
      })
    );
  }

  @Action(GET_VALIDATE_ID)
  public getValidateId({ patchState }: StateContext<QUOTE_PROGRESS_STATE_MODEL>, { payload }: POST_VEHICLE_DETAILS) {
    return this.quoteProgessService.getValidateId(payload.idNo.replaceAll('-', '')).pipe(
      map((res: any) => {
        return patchState({
          staffResult: res['validInd'],
        });
      }));
  }

  @Action(GET_VALIDATE_VOUCHER)
  public getValidateVoucher({ patchState }: StateContext<QUOTE_PROGRESS_STATE_MODEL>) {
    this.getSelectSnapshot();
    let request = {
      agentCode: this.generalState.productConfig.AgentCode,
      productCategory: 'MT',
      voucherCode: this.generalState.productConfig.voucherCode
    };
    return this.quoteProgessService.postValidateVoucher(request).pipe(
      map((res: any) => {
        return patchState({
          staffResult: res,
        });
      }));
  }

  @Action(GET_DOCUMENTS_CONFIG)
  public getDocumentsConfig({ patchState, getState }: StateContext<QUOTE_PROGRESS_STATE_MODEL>) {
    const currentState = getState();
    const sourceSystem = this._store.selectSnapshot((item) => item.GeneralState.sourceSystem);
    var documentData = DOCUMENT_MENU;
    var doumentList = PARTNER_DOCUMENT_MENU;
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

  @Action(GET_AGENT_INFO)
  public getAgentInfo({ patchState, getState }: StateContext<QUOTE_PROGRESS_STATE_MODEL>) {
    const currentState = getState();
    const agentCode = this._store.selectSnapshot((item) => item.GeneralState.productConfig.AgentCode);
    return this.quoteProgessService.postAgentInfo(agentCode).pipe(
      map((res: any) => {
        return patchState({
          ...currentState,
          agentInfo: res,
        });
      }));
  }

  @Action(MO_CONTACT_AGENT)
  public postContactAgent({ patchState, getState }: StateContext<MO_CONTACT_AGENT>, { payload }: MO_CONTACT_AGENT) {
    const currentState = getState();
    return this.quoteProgessService.postContactAgent(payload).pipe(
      map(() => {
        return patchState({
          ...currentState,
        });
      }));
  }

  @Action(MAKE_LIST)
  public getMakeList({ patchState, getState }: StateContext<QUOTE_PROGRESS_STATE_MODEL>) {
    return this.quoteProgessService.getMakeList().pipe(
      map((res: any) => {
        const data = res['AVMakeList'] ? res['AVMakeList'] : [];
        patchState({
          AVMakeList: data
        });
      })
    );
  }

  @Action(REFERED_RISK_DETAILS)
  public getReferedRiskDetails({ patchState, getState }: StateContext<QUOTE_PROGRESS_STATE_MODEL>, { contractNo }: REFERED_RISK_DETAILS) {
    const currentState = getState();

    return this.quoteProgessService.getReferedRiskDetails(contractNo).pipe(
      map((res: any) => {
        return patchState({
          ...currentState,
          referedRiskDetails: res,
        });
      }));
  }

  @Action(MO_CHECK_SANCTION)
  public getCheckSanction({ patchState }: StateContext<QUOTE_PROGRESS_STATE_MODEL>, { payload }: MO_CHECK_SANCTION) {
    return this.quoteProgessService.postCheckSanction(payload).pipe(
      map((res: any) => {
        const _data = res.personsList ? res.personsList : [];
        const _haveErr = _data.filter((item: any) => item.status != 'N');
        patchState({
          checkSanction: Boolean(_haveErr.length > 0),
        });
      })
    );
  }

  @Action(MO_QUALITY_CHECK)
  public getQualityCheck({ patchState }: StateContext<QUOTE_PROGRESS_STATE_MODEL>,
    { payload }: MO_QUALITY_CHECK) {
    return this.quoteProgessService.postQualityCheck(payload).pipe(
      map((res: any) => {
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

  @Action(PIAM)
  public postPIAM({ patchState, getState }: StateContext<QUOTE_PROGRESS_STATE_MODEL>, { MakeCode }: PIAM) {
    const currentState = getState();

    const payload = {
      LoadMakeInd: 'Y',
      MakeCode: MakeCode ? MakeCode : currentState.vehicleDetails.makeCode,
    }

    return this.quoteProgessService.postPIAM(payload).pipe(
      map((res: any) => {
        patchState({
          PIAM_HybridList: res['HybridList'],
          PIAM_MakeList: res["MakeList"],
          PIAM_VehicleMakeInfo:
            res["VehicleMakeInfo"],
        });
      })
    );
  }

  @Action(MODEL_LIST)
  public postModelList({ patchState, getState }: StateContext<QUOTE_PROGRESS_STATE_MODEL>, { avMakeCode }: MODEL_LIST) {
    const currentState = getState();

    console.log(currentState.agentInfo)
    const payload = {
      Make: avMakeCode ? avMakeCode : currentState.vehicleDetails.avMakeCode,
      Region: currentState.agentInfo?.RegionGrpCode,
    }

    return this.quoteProgessService.postModelList(payload).pipe(
      map((res: any) => {
        patchState({
          modelList: {
            ReferRiskList: res,
          }
        });
      })
    );
  }

  @Action(GET_SUMINSURED_LIST)
  public getSUMINSUREDLIST({ patchState, getState }: StateContext<QUOTE_PROGRESS_STATE_MODEL>) {
    const currentState = getState();

    return this.quoteProgessService.getSumInsuredList(this.step2.vehicleDetails.AvCode, currentState.agentInfo.RegionGrpCode).pipe(
      map((res: any) => {
        patchState({
          SumInsuredList: res,
        });
      })
    );
  }

  @Action(MO_CHECKUBB)
  public moCheckUBB(
    { patchState, getState }: StateContext<QUOTE_PROGRESS_STATE_MODEL>
  ) {
    const currentState = getState();
    this.getSelectSnapshot();
    let payload: CheckUBB = new CheckUBB();
    payload.ReferenceNo = currentState.vehicleDetails.contractNumber;
    payload.SourceSystem = this.generalState.sourceSystem;
    payload.ClaimsExp = this.noOfClaims.toString();
    payload.ReconInd = this.step2.vehicleDetails.reconditionedCar;
    payload.ExcessWaiveInd = this.quoteState.contract?.excessWaiveInd;
    payload.Policy.PolicyEffectiveDate = this.vehicleDetailsState.polEffectiveDate;
    payload.Policy.PolicyExpiryDate = this.vehicleDetailsState.polExpiryDate;
    payload.Policy.Agent.Code = this.generalState.productConfig.AgentCode;
    payload.Policy.Client.IdentificationNumber = this.step1.idNo;
    payload.Policy.Client.IdType = this.step1.idType;
    payload.Policy.Client.Age = this.step2.ownerDetails.age.toString()
    payload.Policy.RiskList[0].RiskId = this.quoteProgress?.Risk.RiskGrp[0].RiskId;

    console.log(payload.Policy.RiskList[0])
    payload.Policy.RiskList[0].InsuredPerson.IdentificationNumber = this.step1.idNo;
    payload.Policy.RiskList[0].InsuredPerson.IdType = this.step1.idType;
    payload.Policy.RiskList[0].Vehicle.AvCode = this.step2.vehicleDetails.AvCode;
    payload.Policy.RiskList[0].Vehicle.Capacity = this.step2.vehicleDetails.VehicleEngineCC;
    payload.Policy.RiskList[0].Vehicle.MakeCode = this.step2.vehicleDetails.comDetails.comBrand;
    payload.Policy.RiskList[0].Vehicle.Model = this.step2.vehicleDetails.comDetails.comModelDesc;
    payload.Policy.RiskList[0].Vehicle.PiamModel = this.step2.vehicleDetails.comDetails.comModel;
    payload.Policy.RiskList[0].Vehicle.ReconInd = this.step2.vehicleDetails.reconditionedCar;
    payload.Policy.RiskList[0].Vehicle.VehicleNo = this.step1.plateNumber;
    payload.Policy.RiskList[0].Vehicle.YearOfManufacture = this.step2.vehicleDetails.year.toString();
    payload.Policy.RiskList[0].Vehicle.NamedDriverList[0].Age = this.step2.ownerDetails.age.toString();
    payload.Policy.RiskList[0].Vehicle.Seat = this.step2.vehicleDetails.comDetails.capacity;
    payload.Policy.RiskList[0].Vehicle.ClaimsExp = this.noOfClaims.toString();
    payload.Policy.RiskList[0].Vehicle.NamedDriverList[0].IdentificationNumber = this.step1.idNo;
    payload.Policy.RiskList[0].Vehicle.HrtvInd = this.quoteState.contract.hrtvInd;
    payload.Policy.RiskList[0].Vehicle.HighPerformanceInd = this.quoteState.contract.highPerformanceInd;
    payload.Policy.RiskList[0].CoverList[0].CoverPremium.SumInsured = this.step2.vehicleDetails.SumInsured;
    payload.channel = this.generalState?.customViewObj?.p_channel;
    payload.voucherCode = this.generalState?.productConfig?.voucherCode

    return this.quoteProgessService.postCheckUbb(payload).pipe(
      map((res: any) => {
        return patchState({
          ...currentState,
          UBBStatus: res
        })
      })
    );
  }

  @Action(MO_QUOTE_PROGRESS)
  public moQuoteProgress({ patchState, getState }: StateContext<QUOTE_PROGRESS_STATE_MODEL>, { user_journey, page, agent_payload }: MO_QUOTE_PROGRESS) {

    const currentState = getState();
    this.getSelectSnapshot();

    const stateCode = this.postCodeState.find((item: any) => item.Postcode == this.step1.postcode);
    const payload = new QUOTE_PROGRESS_MODEL();
    payload.QuotationNumber = currentState.vehicleDetails.contractNumber;
    payload.QuotationProgress = user_journey;
    payload.AgentCode = this.generalState.productConfig.AgentCode;

    let date: any = Date.now();
    payload.CreatedDate = moment(date).format('YYYY-MM-DD');
    payload.ClientID = this.step1.idNo;
    payload.ClientIDType = this.step1.idType;
    payload.City = stateCode.CityDescp;
    payload.State = stateCode.StateDescp;
    payload.ProductCode = this.generalState.productConfig.ProductCode;
    payload.PostCode = this.step1.postcode;
    payload.Risk.RiskGrp[0].RiskVeh.VehicleNo = this.step1.plateNumber;
    payload.SourceSystem = this.generalState.sourceSystem;
    payload.SourceSystemCat = this.generalState.productConfig.SourceSystemCat;
    payload.UTMCampaign = this.generalState.customViewObj?.utm_campaign;
    payload.UTMMedium = this.generalState.customViewObj?.utm_medium;

    payload.Agent =
      { "AgentName": "", "MobileNumber": "", "Address": "", "Email": "", "AgentCode": "" }

    if (this.generalState.flowType === 'STAFFR') {
      payload.Voucher = {
        "VoucherCode": this.generalState.productConfig.voucherCode,
        "VoucherStatus": this.generalState.productConfig.voucherCodeInd,
      }
    }

    //Second Call
    if (page > 0) {
      payload.CNoteType = currentState?.quoteProgress?.Result?.CNoteType;
      payload.EffectiveDate = this.vehicleDetailsState.polEffectiveDate;
      payload.ExpiryDate = this.vehicleDetailsState?.polExpiryDate;
    }

    if (page > 1) {
      payload.DOB = this.step2?.ownerDetails?.dob;
      payload.Gender = this.step2?.ownerDetails?.gender;
      payload.MaritalStatus = this.step2?.ownerDetails?.status;
      payload.CustomerAge = this.step2?.ownerDetails?.age.toString();

      payload.Occupation = this.quoteProgress?.Occupation;
      payload.OccupationCode = this.quoteProgress?.OccupationCode;
      payload.RiskDrvrList = this.quoteProgress?.RiskDrvrList;

      let RiskGrp = JSON.parse(JSON.stringify(this.quoteProgress?.Risk.RiskGrp));
      payload.Risk.RiskGrp = RiskGrp;
      payload.Risk.RiskGrp[0].RiskVeh.AvMakeCode = this.step2.vehicleDetails?.brand.Code;
      payload.Risk.RiskGrp[0].RiskVeh.AvModelCode = this.step2.vehicleDetails?.model;
      payload.Risk.RiskGrp[0].RiskVeh.AvVehDescp = this.step2.vehicleDetails?.carType;
      payload.Risk.RiskGrp[0].RiskVeh.AvVehSumInsured = Number(this.step2.vehicleDetails?.SumInsured);
      payload.Risk.RiskGrp[0].RiskVeh.IsmMakeCode = this.step2.vehicleDetails?.comDetails.comBrand;
      payload.Risk.RiskGrp[0].RiskVeh.IsmModelCode = this.step2.vehicleDetails?.comDetails.comModel;
      payload.Risk.RiskGrp[0].RiskVeh.MakeDescp = this.step2.vehicleDetails?.comDetails.comBrandDesc;
      payload.Risk.RiskGrp[0].RiskVeh.ModelDescp = this.step2.vehicleDetails?.comDetails.comModelDesc;
      payload.Risk.RiskGrp[0].RiskVeh.NoOfClaims = this.noOfClaims.toString();

      payload.Risk.RiskGrp[0].RiskVeh.ReconInd = this.step2.vehicleDetails?.reconditionedCar;
      payload.Risk.RiskGrp[0].RiskVeh.VehMakeYear = Number(this.step2.vehicleDetails?.year);
      payload.Risk.RiskGrp[0].RiskVeh.VehicleCapacity = this.step2.vehicleDetails?.VehicleEngineCC.toString();
      payload.Risk.RiskGrp[0].RiskVeh.VehicleSeat = this.step2.vehicleDetails?.comDetails.capacity;

      payload.Risk.RiskGrp[0].RiskVeh.VehicleUOM = this.step2.vehicleDetails?.comDetails.comBrand;
      payload.Risk.RiskGrp[0].RiskVeh.NcdPct = this.quoteState?.premium?.ncdPct;
      payload.Risk.RiskGrp[0].RiskVeh.NcdAmt = this.quoteState?.premium?.ncdAmt;
      payload.PolicySumInsured = this.step2.vehicleDetails?.SumInsured;

    }
    //Third call
    if (page > 2) {
      let CoverGrp = JSON.parse(JSON.stringify(this.quoteProgress.Risk.RiskGrp[0].Cover.CoverGrp[0]));
      payload.Risk.RiskGrp[0].Cover.CoverGrp[0] = CoverGrp;
      payload.Risk.RiskGrp[0].Cover.CoverGrp[0].BasicPrem = this.quoteState?.premium?.basicPremium;
      payload.Risk.RiskGrp[0].Cover.CoverGrp[0].AnnualPrem = this.quoteState?.premium?.annualPremium;
      payload.Risk.RiskGrp[0].Cover.CoverGrp[0].GrossPrem = this.quoteState?.premium?.grossPremium;
      payload.Risk.RiskGrp[0].Cover.CoverGrp[0].NettPrem = this.quoteState?.premium?.grossPremium;

      if (this.step3.additionalCover?.length > 0) {
        payload.Risk.RiskGrp[0].Cover.CoverGrp[0].SubCover.SubCoverGrp = this.getSelectedAdditionalCover(payload);
      } else {
        payload.Risk.RiskGrp[0].Cover.CoverGrp[0].SubCover = new SubCover();
        payload.Risk.RiskGrp[0].Cover.CoverGrp[0].SubCover.SubCoverGrp = [{ "SubCoverCode": "" }];
      }

      payload.AnnualPremium = this.quoteState?.premium?.annualPremium;
      payload.BasicPremium = this.quoteState?.premium?.basicAnnualPremium;
      payload.GrossPremium = this.quoteState?.premium?.grossPremium;
      payload.CommAmt = this.quoteState?.premium?.commissionAmount;
      payload.CommPercentage = this.quoteState?.premium?.commissionPercentage;
      payload.PremiumDue = this.quoteState?.premium?.premiumDue;
      payload.PremiumDueRounded = this.quoteState?.premium?.premiumDueRounded;
      payload.PremiumDueRoundedAfterPTV = this.quoteState?.premium?.PremiumDueRoundedAfterPTV;
      payload.RebateAmount = this.quoteState?.premium?.rebateAmt;
      payload.RebatePercentage = this.quoteState?.premium?.rebatePct;
      payload.STaxAmt = this.quoteState?.premium?.serviceTaxAmount;
      payload.STaxPct = this.quoteState?.premium?.serviceTaxPercentage;
      payload.Stamp = this.quoteState?.premium?.stampDuty;
      payload.ReferralSalesStaffId = this.quoteProgress?.ReferralSalesStaffId
      payload.IsEuEea = this.quoteProgress?.IsEuEea
      payload.Country = this.quoteProgress?.Country
      payload.PartnerCode = this.quoteProgress?.PartnerCode
      payload.CNoteStatus = this.quoteProgress?.CNoteStatus
      payload.IsEPolicy = this.quoteProgress?.IsEPolicy
      payload.MasterPolicyInd = this.quoteProgress?.MasterPolicyInd
    }

    if (page > 3) {
      payload.MatchAgentMobile = this.quoteProgress?.checkSanction === false ? "N" : ""
      payload.MatchAgentEmail = this.quoteProgress?.checkUserInfo === false ? "N" : ""

      payload.Address_1 = this.step4?.policyholder.address?.line1;
      payload.Address_2 = this.step4?.policyholder.address?.line2;
      payload.Address_3 = this.step4?.policyholder.address?.line3;
      payload.EmailAddress = this.step4?.policyholder.email;
      payload.ClientName = this.step4?.policyholder.fullname;
      payload.MobileNumber = this.step4?.policyholder.phonePrefix.replace('+', '') + this.step4?.policyholder.phoneNo;
      payload.ReferralSalesStaffId = this.step4?.policyholder?.staffId;

      if (this.step4?.policyholder.cardNo1) {
        payload.ClientRefNo = this.step4?.policyholder.cardNo1
      }

      if (this.step4?.policyholder.cardNo2) {
        payload.ClientRefName = this.step4?.policyholder.cardNo2
      }

      if (this.step4?.policyholder.cardNo3) {
        payload.ClientRefPolicyNo = this.step4?.policyholder.cardNo3
      }

      if (this.step4?.policyholder.staffId) {
        payload.ReferralSalesStaffId = this.step4?.policyholder.staffId
      }
      payload.RiskDrvrList = new RiskDrvrList();
      payload.RiskDrvrList.DriverGrp = this.mapDriverList(payload);

    }

    if (user_journey === "AGENT STORE LOCATOR") {
      payload.EmailAddress = agent_payload.customer_email;
      payload.ClientName = agent_payload.customer_name;
      payload.MobileNumber = agent_payload.customer_phone_no;
      payload.AgentCode = agent_payload.agent_code;
      payload.Agent =
      {
        "AgentName": agent_payload.agent_name,
        "MobileNumber": agent_payload.agent_phone_no,
        "Address": "",
        "Email": agent_payload.agent_email,
        "AgentCode": agent_payload.agent_code,
        "ExtParam": agent_payload.ExtParam
      }
    }

    return this.quoteProgessService.postQuoteProgress(payload).pipe(
      map((res: any) => {
        return patchState({
          quoteProgress: res
        })
      })
    );
  }

  @Action(MO_QUOTE)
  public moQuote(
    { patchState, getState }: StateContext<QUOTE_PROGRESS_STATE_MODEL>
  ) {
    const currentState = getState();
    this.getSelectSnapshot();

    let payload: any = {};
    payload = {
      partnerId: this.generalState.sourceSystem,
      contractNumber: currentState.vehicleDetails.contractNumber,
      person: {
        identityType: this.step1.idType,
        identityNumber: this.step1.idNo,
        gender: this.step2.ownerDetails.gender,
        birthDate: this.step2.ownerDetails.dob,
        maritalStatus: this.step2.ownerDetails.status,
        postalCode: this.step1.postcode,
        noOfClaims: this.noOfClaims.toString()
      },
      vehicle: {
        vehicleLicenseId: this.step1.plateNumber,
        vehicleMake: this.step2.vehicleDetails.comDetails.comBrand,
        vehicleModel: this.step2.vehicleDetails.comDetails.comModel,
        vehicleEngineCC: this.step2.vehicleDetails.VehicleEngineCC,
        yearOfManufacture: this.step2.vehicleDetails.year.toString(),
        ncdPercentage: currentState.vehicleDetails.ncdPercentage ? currentState.vehicleDetails.ncdPercentage : 0,
        sumInsured: this.step2.vehicleDetails.SumInsured,
        occupantsNumber: this.step2.vehicleDetails.comDetails.capacity,
        avCode: this.step2.vehicleDetails.AvCode,
        nvicCode: this.vehicleDetailsState.nvicList[0].nvic,
      },
      additionalCover: Array.isArray(this.step3.additionalCover) ? this.step3.additionalCover : [],
    }

    payload['channel'] = this.generalState.customViewObj.p_channel;
    payload['voucherCode'] = this.generalState?.productConfig?.voucherCode;

    if (this.step3?.unlimitedDriverInd !== undefined) {
      payload['unlimitedDriverInd'] = this.step3.unlimitedDriverInd;
    }

    if (this.step3?.driverDetails) {
      payload['driverDetails'] = this.step3.driverDetails;
    }

    return this.quoteProgessService.postQuote(payload).pipe(
      map((res: any) => {
        return patchState({
          quote: res
        })
      })
    );
  }

  getSelectedAdditionalCover(payload: any) {
    if (!this.step3.additionalCover) { return; }
    this.step3.additionalCover.forEach((cover: any, i: number) => {

      payload.Risk.RiskGrp[0].Cover.CoverGrp[0].SubCover.SubCoverGrp.push(new SubCoverGrp());
      payload.Risk.RiskGrp[0].Cover.CoverGrp[0].SubCover.SubCoverGrp[i].WindscreenSi = cover.coverSumInsured;
      payload.Risk.RiskGrp[0].Cover.CoverGrp[0].SubCover.SubCoverGrp[i].CartAmt = cover.cartAmount;
      payload.Risk.RiskGrp[0].Cover.CoverGrp[0].SubCover.SubCoverGrp[i].CartDays = cover.cartDay;

      payload.Risk.RiskGrp[0].Cover.CoverGrp[0].SubCover.SubCoverGrp[i].SubCoverCode = cover.coverCode;
      payload.Risk.RiskGrp[0].Cover.CoverGrp[0].SubCover.SubCoverGrp[i].SubPrem = cover.displayPremium;
      payload.Risk.RiskGrp[0].Cover.CoverGrp[0].SubCover.SubCoverGrp[i].SubCoverDescp = cover.coverDescription;
    });
    return payload.Risk.RiskGrp[0].Cover.CoverGrp[0].SubCover.SubCoverGrp;
  }

  mapDriverList(payload: any) {
    payload.RiskDrvrList.DriverGrp[0].DriverSeq = 1;
    payload.RiskDrvrList.DriverGrp[0].DriverAge = this.step2?.ownerDetails?.age.toString();
    payload.RiskDrvrList.DriverGrp[0].DriverName = this.step4?.policyholder.fullname;
    payload.RiskDrvrList.DriverGrp[0].DriverId = this.step1.idNo;
    payload.RiskDrvrList.DriverGrp[0].DriverType = "NORM";
    payload.RiskDrvrList.DriverGrp[0].RiskDriverId = this.quoteProgress?.RiskDrvrList.DriverGrp[0].RiskDriverId ? this.quoteProgress.RiskDrvrList.DriverGrp[0].RiskDriverId : '';

    if (this.step4?.additionalDriver.driver1.fullname) {
      payload.RiskDrvrList.DriverGrp[1] = new DriverGrp();
      payload.RiskDrvrList.DriverGrp[1].DriverSeq = 2;
      payload.RiskDrvrList.DriverGrp[1].DriverAge = "";
      payload.RiskDrvrList.DriverGrp[1].DriverName = this.step4?.additionalDriver.driver1.fullname;
      payload.RiskDrvrList.DriverGrp[1].DriverId = this.step4?.additionalDriver.driver1.idNo.replaceAll('-', '');
      payload.RiskDrvrList.DriverGrp[1].DriverType = "NORM";
    }

    if (this.step4?.additionalDriver.driver2.fullname) {
      payload.RiskDrvrList.DriverGrp[2] = new DriverGrp();
      payload.RiskDrvrList.DriverGrp[2].DriverSeq = 3;
      payload.RiskDrvrList.DriverGrp[2].DriverAge = "";
      payload.RiskDrvrList.DriverGrp[2].DriverName = this.step4?.additionalDriver.driver2.fullname;
      payload.RiskDrvrList.DriverGrp[2].DriverId = this.step4?.additionalDriver.driver2.idNo.replaceAll('-', '');
      payload.RiskDrvrList.DriverGrp[2].DriverType = "NORM";
    }
    //add ehailing driver details here

    if (this.step4?.ehailingDriver.fullname) {
      const index = payload.RiskDrvrList.DriverGrp.length;
      payload.RiskDrvrList.DriverGrp[index] = new DriverGrp();
      payload.RiskDrvrList.DriverGrp[index].DriverSeq = index + 1;
      payload.RiskDrvrList.DriverGrp[index].DriverName = this.step4?.ehailingDriver.fullname;
      payload.RiskDrvrList.DriverGrp[index].DriverId = this.step4?.ehailingDriver.fullname;
      payload.RiskDrvrList.DriverGrp[index].DriverAge = "";
      payload.RiskDrvrList.DriverGrp[index].DriverType = "EHAIL";
    }
    return payload.RiskDrvrList.DriverGrp;
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
}