import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { Store } from '@ngxs/store';
import { SelectPlansService } from '../../services/select-plans.service';
import { POST_CONTACT_AGENT } from '../../../../../../module/store/general.action';
import { LOGO, SHC, SUBHEADER } from '../../constants/shc-constants';
import { QUOTE_PROGRESS } from '../../store/actions/quote-progess.action';

@Component({
  selector: 'agent-locator',
  templateUrl: './agent-locator.component.html'
})
export class AgentLocatorComponent {
  SHC = SHC;
  subheader = SUBHEADER;
  logo = LOGO;

  @ViewChild('stepper') stepper: any;
  constructor(private _store: Store,
    private changeDetectionRef: ChangeDetectorRef,
    private selectPlansService: SelectPlansService) {
  }
  ngAfterViewInit(): void {
    this.stepper.steps.get(1).completed = true;
    this.stepper.steps.get(2).select();
    this.changeDetectionRef.detectChanges();
  }

  receiveAgentLocator(form: any) {
    var generalState = this._store.selectSnapshot((state) => state.GeneralState)
    var agent;

    if (form.formValue.checkRecommend == true) {
      agent = {
        "agent_name": 'SUGAR',
        "agent_code": 'SUGAR',
        "agent_address": '',
        "agent_email": '',
        "agent_phone_no": '',
        "product_name": "Smart Home Cover",
        "source_system_cat": generalState?.productConfig?.SourceSystemCat,
        "source_system": generalState.sourceSystem,
        "customer_name": form.formValue.name,
        "customer_email": form.formValue.email,
        "customer_phone_no": form.formValue.phoneCountryCode.replace('+', '') + form.formValue.mobileNo,
      }
    } else {
      agent = {
        "agent_name": form.selectedLocation.Name,
        "agent_code": this._store.selectSnapshot(
          (state) => state.GeneralState.productConfig.AgentCode
        ),
        "agent_address": form.selectedLocation.Address + "\n" + form.selectedLocation.City + "\n" +
          form.selectedLocation.Postcode + "\n" +
          form.selectedLocation.State,
        "agent_email": form.selectedLocation.EmailAddress,
        "agent_phone_no": form.selectedLocation.ContactNo.Alim,
      }
    }

    var payload = this.selectPlansService.getPayload(form.formValue, agent);

    if (form.formValue.checkRecommend == true) {
      this._store.dispatch(new QUOTE_PROGRESS("AGENT STORE LOCATOR", payload));
    } else {
      this._store.dispatch(new POST_CONTACT_AGENT(payload));
    }
  }
}
