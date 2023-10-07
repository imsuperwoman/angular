import { Component, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { SelectPlansService } from '../../services/select-plans.service';
import { POST_CONTACT_AGENT, POST_REFERRED_RISK } from '../../../../../../module/store/general.action';
import { LOGO, SHC, SUBHEADER } from '../../constants/shc-constants';

@Component({
  selector: 'leave-details',
  templateUrl: './leave-details.component.html'
})
export class LeaveDetailsComponent implements OnInit {

  SHC = SHC;
  subheader = SUBHEADER;
  logo = LOGO;

  flowType$: any;

  constructor(private _store: Store,
    private selectPlansService: SelectPlansService) {
    this.flowType$ = this._store.selectSnapshot((state) => state.GeneralState.flowType);
  }

  ngOnInit(): void {
  }

  receiveLeaveDetails(form: any) {
    var agentDetails = this._store.selectSnapshot((state) => state.GeneralState.agentDetails);
    var sourceSystem = this._store.selectSnapshot((state) => state.GeneralState.sourceSystem);

    var agent = {
      "agent_name": agentDetails.Name,
      "agent_code": this._store.selectSnapshot(
        (state) => state.GeneralState.productConfig.AgentCode
      ),
      "agent_address": agentDetails.Address,
      "agent_email": this.flowType$ == 'STAFFR' ? 'AGIC.Digital@allianz.com.my' : agentDetails.EmailAddress
    }
    var payload;

    if (sourceSystem == 'HSBCBN' || sourceSystem == 'SCOL') {
      this.callReferredRisk(form, sourceSystem)
    } else {
      payload = this.selectPlansService.getPayload(form, agent);
      this._store.dispatch(new POST_CONTACT_AGENT(payload));
    }
  }

  callReferredRisk(form: any, sourceSystem: any) {
    var payload;
    payload = {
      "product_name": "Smart Home Cover",
      "customer_name": form.name,
      "customer_email": form.email,
      "phone": form.phoneCountryCode.replace('+', '') + form.mobileNo,
      "city": form?.city,
      "preferred_language": form?.preflanguage,
      "state": form?.state,
      "service_taxInd": 'Y',
      "subject": "Smart Home Cover - " + form.name,
      "source_name": '',
      "agent_email": '',
      "agent_phone_no": '',
      "channel": '',
    }

    if (sourceSystem == 'HSBCBN') {
      payload['source_name'] = 'HSBC';
    }

    if (sourceSystem == 'SCOL') {
      payload['source_name'] = 'SCB';
    }
    this._store.dispatch(new POST_REFERRED_RISK(payload, 'shc'));
  }
}
