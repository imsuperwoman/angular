import { Component, OnInit, ViewChild } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { FormService } from '@services/form.service';
import { AZOL, EMAIL_SUBJECT, ERROR_DESC, HEADER, LOGO, SUBHEADER } from '../../constants/motor-online-constants';
import { MO_CONTACT_AGENT, MO_QUOTE_PROGRESS } from '../../store/actions/quote-progress.action';
import { Store } from '@ngxs/store';
import { environment } from 'environments/environment';
import { SUGER_STATE } from 'pages/agent-locator/shared-agent-locator.component';

@Component({
  selector: 'app-find-agent',
  templateUrl: './find-agent.component.html'
})
export class FindAgentComponent implements OnInit {
  LOGO: string = LOGO;
  HEADER = HEADER;
  SUBHEADER = SUBHEADER;

  @ViewChild('stepper') stepper: any;
  selectedAgencyDetails: any = [];
  selectedAgencyDetailsHasData: boolean = false;

  constructor(
    private changeDetectionRef: ChangeDetectorRef,
    public formService: FormService,
    private _store: Store,
  ) { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.stepper.steps.get(1).completed = true;
    this.stepper.steps.get(2).completed = true;
    this.stepper.steps.get(3).select();
    this.changeDetectionRef.detectChanges();
  }

  receiveAgentLocator(form: any) {
    var quoteProgressState = this._store.selectSnapshot((state => state.QuoteProgessState));
    var generalState = this._store.selectSnapshot((state) => state.GeneralState)
    var userInput = this._store.selectSnapshot((state => state.UserInputState.userInput));

    var postcodeList = generalState?.postcodeList;
    var stateCode = postcodeList.find((item: any) => item.Postcode == userInput.step1.postcode);
    var payload;

    var state = SUGER_STATE[stateCode.StateCode] !== undefined ? SUGER_STATE[stateCode.StateCode] : stateCode?.StateDescp

    if (form.formValue.checkRecommend == true) {
      payload = {
        "agent_name": 'SUGAR',
        "agent_code": 'SUGAR',
        "agent_address": '',
        "agent_email": '',
        "agent_phone_no": '',
        'ExtParam': JSON.stringify({
          name: form.formValue.name,
          email: form.formValue.email,
          lead_source: AZOL,
          lead_type: 'AGIC',
          nric_number: userInput.step1.idNo,
          state: state,
          campaign_id: environment.SUGAR_CRM.CAMPAIGN_ID,
          date_of_birth: userInput.step2.ownerDetails.dob,
          description: "ID type: " + userInput?.step1?.idType
            + "\nMarital status: " + this.getMarital(userInput.step2?.ownerDetails?.status)
            + "\nMake: " + quoteProgressState?.vehicleDetails?.vehicleMake
            + "\nModel: " + quoteProgressState?.vehicleDetails?.vehicleModel
            + "\nVariant: " + userInput.step2.vehicleDetails.comDetails.comCarTypeDesc
            + "\nAV Variant: " + userInput.step2.vehicleDetails.carType
            + "\nYear of make: " + userInput.step2.vehicleDetails.year
            + "\nNCD Value: " + quoteProgressState?.vehicleDetails?.ncdPercentage + "%"
            + "\nPeriod of insurance: " + userInput.step2.insurancePeriod,
          gender: userInput.step2?.ownerDetails.gender == 'M' ? 'Male' : 'Female',
          phone_mobile: form.formValue.phoneCountryCode + form.formValue.mobileNo,
          postcode: userInput.step1.postcode,
          product_name: "Motor Comprehensive",
          status: "New Lead",
          vehicle_number: quoteProgressState?.vehicleDetails?.vehicleLicenseId
        }),
        "product_name": "Motor Private Comprehensive Cover",
        "source_system_cat": generalState?.productConfig?.SourceSystemCat,
        "source_system": generalState.sourceSystem,
        "customer_name": form.formValue.name,
        "customer_email": form.formValue.email,
        "customer_phone_no": form.formValue.phoneCountryCode.replace('+', '') + form.formValue.mobileNo,
      }
    } else {
      payload = {
        "agent_name": form.selectedLocation.Name,
        "agent_code": form.selectedLocation.OutletId,
        "agent_address": form.selectedLocation.Address + "\n" + form.selectedLocation.City + "\n" +
          form.selectedLocation.Postcode + "\n" +
          form.selectedLocation.State,
        "agent_email": form.selectedLocation?.EmailAddress,
        "agent_phone_no": form.selectedLocation?.ContactNo?.Alim,
        "product_name": "Motor Private Comprehensive Cover",
        "source_system_cat": generalState?.productConfig?.SourceSystemCat,
        "source_system": generalState.sourceSystem,
        "customer_name": form.formValue.name,
        "customer_email": form.formValue.email,
        "customer_phone_no": form.formValue.phoneCountryCode.replace('+', '') + form.formValue.mobileNo,
      }
    }
    var payload2 = {
      "agent_subject": EMAIL_SUBJECT?.agentQuotation,
      "customer_subject": EMAIL_SUBJECT?.customer,
      "email_scenario": "Pre-Purchase",
      "reference_no": quoteProgressState?.vehicleDetails?.contractNumber,
      "selected_plans": "",
      "total_premium": "RM " + quoteProgressState?.quote?.premium?.premiumDueRounded || '',
      "stamp_duty": "RM " + quoteProgressState?.quote?.premium?.stampDuty || '',
      "total_premium_payable": "RM " + quoteProgressState?.quote?.premium?.premiumDueRounded || '',
      "components": [],
      "premium": "RM " + quoteProgressState?.quote?.premium?.premiumDue || '',
      "service_taxInd": generalState?.productConfig?.STaxInd || '',
      "service_tax": "RM " + quoteProgressState?.quote?.premium?.serviceTaxAmount || '',
      "preferred_language": "",
      "state": stateCode?.StateDescp,
      "city": stateCode?.CityDescp,
      "customer_idType": userInput.step1.idType,
      "customer_id_no": userInput.step1.idNo,
      "vehicle_plate_no": quoteProgressState?.vehicleDetails?.vehicleLicenseId,
      "post_code": userInput.step1.postcode,
      "gender": userInput.step2?.ownerDetails.gender == 'M' ? 'Male' : 'Female',
      "marital_status": userInput.step2?.ownerDetails?.status ? this.getMarital(userInput.step2?.ownerDetails?.status) : '',
      "vehicle_make": quoteProgressState?.vehicleDetails?.vehicleMake,
      "vehicle_model": quoteProgressState?.vehicleDetails?.vehicleModel,
      "vehicle_description": 'N/A',
      "vehicle_makeyear": quoteProgressState?.vehicleDetails?.yearOfManufacture.toString(),
      "vehicle_capacity": userInput.step2.vehicleDetails?.VehicleEngineCC,
      "seating_capacity": quoteProgressState?.vehicleDetails?.seatingCapacity,
      "sum_insured": "RM " + userInput.step2.vehicleDetails?.SumInsured,
      "ncd_percentage": quoteProgressState?.vehicleDetails?.ncdPercentage + "%",
      "current_coverage_period": userInput.step2?.insurancePeriod.replace('to', '-'),
      "region": quoteProgressState?.agentInfo?.RegionGrpCode,
      "av_description": userInput.step2.vehicleDetails.carType,
      "engine_no": quoteProgressState?.vehicleDetails?.vehicleEngine,
      "chassis_no": quoteProgressState?.vehicleDetails?.vehicleChassis,
      "error_description": ERROR_DESC.agentDesc,
      "recipient": quoteProgressState?.agentInfo?.AgentName
    }

    var sending = { ...payload, ...payload2 };

    if (form.formValue.checkRecommend == true) {
      this._store.dispatch(new MO_QUOTE_PROGRESS("AGENT STORE LOCATOR", 3, sending));
    } else {
      this._store.dispatch(new MO_CONTACT_AGENT(sending));
      this._store.dispatch(new MO_QUOTE_PROGRESS("AGENT STORE LOCATOR", 3, sending));
    }
  }

  getMarital(code: any): string {
    const lov = this._store.selectSnapshot(item => item.GeneralState.lov);
    const marital = lov.find((item: any) => item.LovType == 'MARITALSTATUS');
    const maritalValue = marital.LovList.find((item: any) => item.Code == code);

    return maritalValue.Description
  }
}