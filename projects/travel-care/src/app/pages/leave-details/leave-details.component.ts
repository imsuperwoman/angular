import { Component, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { POST_CONTACT_AGENT } from 'module/store/general.action';

import { GeneralService } from '../../services/general.service';
import { environment } from 'environments/environment.dr';
import { GeneralServiceSelect } from 'module/store/general.service.select';

@Component({
  selector: 'leave-details',
  templateUrl: './leave-details.component.html',
  styleUrls: ['./leave-details.component.scss']
})
export class LeaveDetailsComponent implements OnInit {

  LOGO: any;
  HEADER: any;
  SUBHEADER: any;

  /*---- Params ----*/
  activePartner: any = false;

  constructor(private _store: Store,
    public generalService: GeneralService,
    private generalServiceSelect: GeneralServiceSelect,) {
    this.LOGO = generalService.getConfig().LOGO;
    this.HEADER = generalService.getConfig().HEADER;
    this.SUBHEADER = generalService.getConfig().SUBHEADER;
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
    var planRecommendation = this._store.selectSnapshot((state => state.QuoteProgessState.planRecommendation.planRecommendation));
    var userInput = this._store.selectSnapshot((state => state.UserInputState.userInput.step1));

    var payload;
    payload = {
      "product_name": this.HEADER,
      "agent_code": generalState?.productConfig.AgentCode,
      "source_system_cat": generalState?.productConfig?.SourceSystemCat,
      "source_system": generalState?.sourceSystem,
      "customer_name": form.name,
      "customer_email": form.email,
      "customer_phone_no": form.phoneCountryCode.replace('+', '') + form.mobileNo,
      "agent_name": agentDetails.Name,
      "agent_address": agentDetails.Address,
      "agent_email": agentDetails.EmailAddress,
      "agent_subject": `From ` + environment.ENVIRONMENT + this.HEADER + ` | ` + form.name + `\n  has selected you as a servicing agent on Allianz Online!`,
      "customer_subject": "From" + environment.ENVIRONMENT + agentDetails.Name + " is your Allianz insurance agent for " + this.HEADER,
      "email_scenario": "Pre-Purchase",
      "reference_no": planRecommendation.contract.contractNumber,
      "selected_plans": this.generalServiceSelect.selectLovDescription('TRGRPCODE', userInput.trgrpcode),
      "premium": "RM " + planRecommendation.premium.grossPremium,
      "total_premium": "RM " + planRecommendation.premium.premiumDue,
      "stamp_duty": "RM " + planRecommendation.premium.stampDuty,
      "service_taxInd": "Y",
      "service_tax": "RM" + planRecommendation.premium.serviceTaxAmount,
      "total_premium_payable": "RM " + planRecommendation.premium.premiumDueRounded,
    }
    this._store.dispatch(new POST_CONTACT_AGENT(payload));
  }
}
