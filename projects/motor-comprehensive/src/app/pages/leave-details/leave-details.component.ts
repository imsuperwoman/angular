import { Component, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { POST_REFERRED_RISK } from 'module/store/general.action';

import { LOGO, HEADER, SUBHEADER, EMAIL_SUBJECT } from '../../constants/motor-online-constants';

@Component({
  selector: 'leave-details',
  templateUrl: './leave-details.component.html',
  styleUrls: ['./leave-details.component.scss']
})
export class LeaveDetailsComponent implements OnInit {

  HEADER = HEADER;
  SUBHEADER = SUBHEADER;
  LOGO = LOGO;

  flowType$: any;

  /*---- Params ----*/
  activePartner: any = false;

  constructor(private _store: Store) {
    this.flowType$ = this._store.selectSnapshot((state) => state.GeneralState.flowType);
  }

  ngOnInit(): void {
    var customViewObj = this._store.selectSnapshot(
      (state) => state.GeneralState.customViewObj
    )
    if (customViewObj.utm_source != undefined) {
      this.activePartner = true;
    }
  }

  receiveLeaveDetails(form: any) {
    var generalState = this._store.selectSnapshot((state) => state.GeneralState);
    var agentDetails = this._store.selectSnapshot((state) => state.GeneralState.agentDetails);
    var quoteProgressState = this._store.selectSnapshot((state => state.QuoteProgessState));
    var userInput = this._store.selectSnapshot((state => state.UserInputState.userInput));
    var sourceSystem = this._store.selectSnapshot((state) => state.GeneralState.sourceSystem);
    var referedRiskDetails = this._store.selectSnapshot((state => state.QuoteProgessState.referedRiskDetails));
    var error_description = referedRiskDetails ? referedRiskDetails.referCode + " " + referedRiskDetails.referDesc : '';


    const emailaddress = this.flowType$ == 'REFERRAL' ? 'agic.digital@allianz.com.my' : agentDetails.EmailAddress;

    var payload;
    payload = {
      "product_name": HEADER,
      "customer_name": form.name,
      "customer_email": form.email,
      "customer_phone_no": form.phoneCountryCode.replace('+', '') + form.mobileNo,
      "city": form.city ? form.city : '',
      "preferred_language": form.preflanguage ? form.preflanguage : '',
      "state": form.state ? form.state : '',
      "service_taxInd": generalState?.productConfig?.STaxInd,
      "source_name": '',
      "agent_email": emailaddress,
      "agent_phone_no": generalState?.dynamicContent.Header.tel,
      "agent_address": agentDetails.Address,
      "agent_code": generalState?.productConfig.AgentCode,
      "agent_name": agentDetails.Name,
      "agent_subject": EMAIL_SUBJECT?.agentRisk,
      "customer_subject": EMAIL_SUBJECT?.customer,
      "customer_idType": userInput.step1.idType,
      "customer_id_no": userInput.step1.idNo,
      "source_system": generalState?.sourceSystem,
      "source_system_cat": generalState?.productConfig?.SourceSystemCat,
      "email_scenario": 'Pre-Purchase',
      "reference_no": quoteProgressState?.vehicleDetails?.contractNumber,
      "selected_plans": '',
      "total_premium": '',
      "stamp_duty": "",
      "total_premium_payable": "",
      "components": [],
      "premium": "",
      "service_tax": "",
      "vehicle_plate_no": userInput.step1.plateNumber,
      "post_code": userInput.step1.postcode,
      "gender": userInput.step1?.gender ? userInput.step1?.gender : '',
      "marital_status": quoteProgressState?.quoteProgress?.MaritalStatus ? quoteProgressState?.quoteProgress?.MaritalStatus : '',
      "vehicle_make": "",
      "vehicle_model": "",
      "vehicle_description": "N/A",
      "vehicle_makeyear": "",
      "vehicle_capacity": "",
      "seating_capacity": "",
      "sum_insured": "",
      "ncd_percentage": "",
      "current_coverage_period": "",
      "region": quoteProgressState?.agentInfo?.RegionGrpCode,
      "av_description": "",
      "engine_no": '',
      "chassis_no": "",
      "error_description": error_description,
      "recipient": agentDetails.Name,
    }

    if (sourceSystem === 'HSBCBN') {
      payload['source_name'] = 'HSBC';
    }

    if (sourceSystem === 'SCOL') {
      payload['source_name'] = 'SCB';
    }

    this._store.dispatch(new POST_REFERRED_RISK(payload, 'mci'));
  }
}
