import { Injectable } from "@angular/core";
import { Store } from "@ngxs/store";
import { GeneralSelectors } from "module/store/general.selectors";
import { ASHC, AZOL, SHC } from "../constants/shc-constants";
import { GeneralServiceSelect } from "module/store/general.service.select";
import { environment } from 'environments/environment';
import { SUGER_STATE } from "pages/agent-locator/shared-agent-locator.component";

@Injectable({
  providedIn: 'root',
})
export class SelectPlansService {
  planRecommendation$: any;
  userSelection$: any;
  basicPropDetails$: any;
  covergType: any;

  constructor(
    private _store: Store,
    private generalServiceSelect: GeneralServiceSelect,
  ) {

    this.planRecommendation$ = this._store.selectSnapshot(
      (state) => state?.QuoteProgessState?.planRecommendation?.planRecommendation
    );

    this.basicPropDetails$ = this._store.selectSnapshot(
      (state) => state.UserInputState.userInput.step1
    );

    this.userSelection$ = this._store.selectSnapshot(item => item.UserInputState.userInput.step2?.mainData);
  }

  getCoverageType() {
    let coverType = this.basicPropDetails$.CoverageType;
    if (coverType == 'AN') {
      this.covergType = 'Annual';
    } else {
      this.covergType = 'Multi-year'
    }
    return this.covergType;
  }

  getPayload(form: any, agent: any) {
    var selectedPlans;
    var selected_plans;

    if (this.userSelection$ != undefined || this.userSelection$?.length > 0) {
      selected_plans = this.getSelectedPlans();
      if (selected_plans.components.length > 0) {
        selectedPlans =
        {
          components: selected_plans.components,
          selected_plans: selected_plans.selected_plans.toString(),
          service_taxInd: "Y",
          premium: "RM" + this.planRecommendation$.premium.premiumDue,
          service_tax: "RM" + this.planRecommendation$.premium.serviceTaxAmount,
          stamp_duty: "RM" + this.planRecommendation$.premium.stampDuty,
          total_premium: "RM" + this.planRecommendation$.premium.premiumDueRounded,
          total_premium_payable: "RM" + this.planRecommendation$.premium.premiumDueRounded,
          reference_no: this.planRecommendation$.contract.contractNumber,
          coverage_type: this.getCoverageType(),
        }
      } else {
        selectedPlans = {
          service_taxInd: "N",
        }
      }
    }

    const payload = {
      "product_name": SHC,
      "source_system_cat": this._store.selectSnapshot((state) => state.GeneralState.productConfig.SourceSystemCat),
      "source_system": this._store.selectSnapshot(GeneralSelectors.sourceSystem),
      "customer_name": form.name,
      "customer_email": form.email,
      "customer_phone_no": form.phoneCountryCode.replace('+', '') + form.mobileNo,
      "agent_name": agent.agent_name,
      "agent_code": agent.agent_code,
      "agent_address": agent.agent_address,
      "agent_email": agent.agent_email,
      "agent_phone_no": agent.agent_phone_no,
      "agent_subject": ASHC + " | " + form.name + " has selected you as servicing agent on Allianz Online! ",
      "customer_subject": agent.agent_name.toUpperCase() + " is your Allianz insurance agent for " + ASHC,
      "email_scenario": "Pre-Purchase",
      "reference_no": selectedPlans?.reference_no || " ",
      "coverage_type": selectedPlans?.coverage_type || " ",
      "selected_plans": selectedPlans?.selected_plans || " ",
      "total_premium": selectedPlans?.total_premium || " ",
      "stamp_duty": selectedPlans?.stamp_duty || " ",
      "total_premium_payable": selectedPlans?.total_premium_payable || " ",
      "components": selectedPlans?.components || [],
      "premium": selectedPlans?.premium || " ",
      "service_taxInd": selectedPlans?.service_taxInd || 'N',
      "service_tax": selectedPlans?.service_tax || " ",
    }

    var userInput = this._store.selectSnapshot((state => state.UserInputState.userInput));
    var quoteProgessState = this._store.selectSnapshot((state => state.QuoteProgessState));
    var planRecommendation = this._store.selectSnapshot((state => state.QuoteProgessState.planRecommendation));
    var generalState = this._store.selectSnapshot((state) => state.GeneralState)
    var stateCode = generalState?.postcodeList.find((item: any) => item.Postcode == userInput.step1.address.postCode);

    var result;
    if (userInput.step1.CustomerType != '') {
      result = this.generalServiceSelect.selectLovDescription('OWNERTYPE', userInput.step1.CustomerType)
    }

    if (userInput.step1.PropertyType != '') {
      result = result + '\n' + this.generalServiceSelect.selectLovDescription('PROPERTYTYPE', userInput.step1.PropertyType)
    }

    if (userInput.step1.BuildingStorey != '') {
      result = result + '\nBuilding storey:' + this.generalServiceSelect.selectLovDescription('BUILDSTOREYCODE', userInput.step1.BuildingStorey)
    }

    if (userInput.step1.yearOfConstruction != '') {
      result = result + '\nYear of construction:' + userInput.step1.yearOfConstruction
    }

    if (userInput.step1.ageOfBuilding != '') {
      result = result + '\nAge of building:' + userInput.step1.ageOfBuilding
    }

    if (userInput.step1.address != '') {
      result = result + '\nAddress:'
        + userInput.step1.address.addressnumber != '' ? userInput.step1.address.addressnumber + ',' : ''
          + userInput.step1.address.address1 + ','
          + userInput.step1.address.address2 != '' ? userInput.step1.address.address3 + ',' : ''
            + userInput.step1.address.address3 != '' ? userInput.step1.address.address3 + ',' : ''
            + userInput.step1.address.postCode + ','
            + userInput.step1.address.state + ','
    }

    if (userInput.step1?.ExistingLoan && userInput.step1?.ExistingLoan != '') {
      result = result + '\nHave bank loan:' + userInput.step1.ExistingLoan
    }

    if (userInput.step1?.HasTenant && userInput.step1?.HasTenant != '') {
      result = result + '\nHave a tenant:' + userInput.step1.HasTenant
    }

    if (userInput.step1.SumInsured != '') {
      result = result + '\nSum Insured:' + userInput.step1.SumInsured
    }

    if (quoteProgessState?.calculator?.estimatedSumInsured) {
      result = result + '\nAgreed Value: ' + quoteProgessState?.calculator?.estimatedSumInsured ? 'Y' : 'N'
    }

    if (userInput.step1.CoverageType) {
      result = result + '\nCoverage type: ' + this.generalServiceSelect.selectLovDescription('COVERAGETYPE', userInput.step1.CoverageType)
    }

    if (planRecommendation?.planRecommendation) {
      result = result + '\nPremium payable: ' + planRecommendation.planRecommendation.premium.premiumDueRounded
    }

    if (payload?.selected_plans) {
      result = result + '\nComponents selected:' + payload.selected_plans
    }

    if (payload?.components) {
      result = result + '\nAdditional coverage:' + JSON.stringify(payload.components)
    }

    var state = SUGER_STATE[stateCode.StateCode] !== undefined ? SUGER_STATE[stateCode.StateCode] : stateCode?.StateDescp

    if (form.checkRecommend == true) {
      agent = {
        'ExtParam':
          JSON.stringify({
            name: form.formValue.name,
            email: form.formValue.email,
            lead_source: AZOL,
            lead_type: 'AGIC',
            nric_number: userInput.step3?.customerDetails?.idNo,
            state: state,
            campaign_id: environment.SUGAR_CRM.CAMPAIGN_ID,
            date_of_birth: userInput.step3?.customerDetails?.dob,
            description: "ID type: " + userInput.step3?.customerDetails?.idType
              + result,
            gender: userInput.step3?.customerDetails.gender == 'M' ? 'Male' : 'Female',
            phone_mobile: form.formValue.phoneCountryCode + form.formValue.mobileNo,
            postcode: userInput.step1.postcode,
            product_name: "Smart Home Cover",
            status: "New Lead"
          })
      }
    }

    var sending = { ...payload, ...agent };
    return sending
  }

  getSelectedPlans() {
    let plansDetails = new PLANS_DETAILS(); let selectedPlans;
    if (this.planRecommendation$?.components == undefined) return plansDetails;

    for (let components of this.planRecommendation$.components) {
      if (components.selectedIndicator) {
        if (components.coverCode == '03' || components.coverCode == '14') {
          plansDetails.selected_plans.push(components.description)
        } else {
          selectedPlans = components.plans.filter((item: any) => item.selectedIndicator)[0];
          var selected_plans = " " + components.description + " - " + selectedPlans.planDescription + " "
          plansDetails.selected_plans.push(selected_plans)
        }

        let compItem = {} as COMPONENTS_ITEM;
        compItem.name = components.description
        if (components.coverCode === '03' || components.coverCode == '14') {
          compItem.display = 'Sum Insured: RM' + components.sumInsured;
        } else if (components.coverCode === '04') {
          compItem.display = selectedPlans.planDescription + ', Sum Insured: RM' + components.sumInsured;
        } else {
          compItem.display = selectedPlans.planDescription || '-';
        }
        plansDetails.components.push(compItem);
      }
    }
    return plansDetails;
  }
}

export class PLANS_DETAILS {
  selected_plans: string[];
  components: COMPONENTS_ITEM[];
  constructor(obj?: any) {
    this.selected_plans = (obj && obj.selected_plans) || [];
    this.components = (obj && obj.components) || [];
  }
}

export interface COMPONENTS_ITEM {
  name: string;
  display: string;
}
