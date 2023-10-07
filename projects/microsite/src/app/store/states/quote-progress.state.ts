import { Injectable } from '@angular/core';
import { Action, State, StateContext, Selector, Store } from '@ngxs/store';
import { map } from 'rxjs/operators';
import { QuoteProgessService } from '../../services/quote-progress.service';
import { GET_QUOTE, QUOTE_PROGRESS, QUOTE_INFO, FLOOD_PRONE_AREA } from '../actions/quote-progress.action';
import { DEFAULTS, QUOTE_PROGRESS_STATE_MODEL, QUOTE_PROGRESS_MODEL } from '../model/quote-progress.model';
import * as moment from 'moment';
import { Risk } from '../model/risk.model';

@State<QUOTE_PROGRESS_STATE_MODEL>({
  name: 'QuoteProgessState',
  defaults: DEFAULTS,
})

@Injectable()
export class QuoteProgessState {
  constructor(public quoteProgessService: QuoteProgessService,
    private _store: Store) { }

  @Selector()
  public static quoteInfo(state: any) {
    return state.quoteResult.risks.risks;
  }

  @Action(GET_QUOTE)
  public getQuoteInfo(
    { patchState }: StateContext<QUOTE_PROGRESS_STATE_MODEL>, { payload, PRODUCT_CAT }: GET_QUOTE
  ) {
    return this.quoteProgessService.postQuote(payload, PRODUCT_CAT).pipe(
      map((res) => {
        patchState({
          quoteResult: res,
        });
      })
    );
  }

  @Action(QUOTE_PROGRESS)
  public getQuoteProgress(
    { patchState }: StateContext<QUOTE_PROGRESS_STATE_MODEL>, { user_journey, PRODUCT_CAT }: QUOTE_PROGRESS
  ) {
    var step2 = this._store.selectSnapshot((state) => state.UserInputState.userInput.step2);
    var step3 = this._store.selectSnapshot((state) => state.UserInputState.userInput.step3);

    var generalState = this._store.selectSnapshot((state) => state.GeneralState);
    var quoteState = this._store.selectSnapshot((state) => state.QuoteProgessState.quoteResult);

    const payload = new QUOTE_PROGRESS_MODEL();

    payload.ProductCategory = PRODUCT_CAT;
    payload.ProductShortDescription = 'Businessshield';
    payload.QuotationNumber = quoteState.contract.contractNumber;
    payload.ProductCode = generalState.productConfig.ProductCode;
    payload.AgentCode = generalState.productConfig.AgentCode;
    payload.SourceSystem = generalState.sourceSystem;
    payload.SourceSystemCat = generalState.productConfig.SourceSystemCat;
    payload.QuotationProgress = user_journey;
    let date: any = Date.now();
    payload.CreatedDate = moment(date).format('YYYY-MM-DD');

    payload.ClientIDType = step3.policyholderDetails.idType;
    if (payload.ClientIDType === 'NRIC') {
      payload.ClientID = step3.policyholderDetails.idNo.replaceAll('-', '');
    } else {
      payload.ClientID = step3.policyholderDetails.idNo;
    }
    payload.EffectiveDate = moment(step3.coverageDetails.effectivedate).format('YYYY-MM-DD');
    payload.ExpiryDate = moment(step3.coverageDetails.expirydate).format('YYYY-MM-DD');
    payload.ClientName = step3.policyholderDetails.businessname;
    payload.Gender = '';
    payload.MobileNumber = step3.policyholderDetails.mobilePrefixname + step3.policyholderDetails.phonenumber;
    payload.EmailAddress = step3.policyholderDetails.email;
    payload.Address_1 = step3.policyholderDetails.addressnumber;
    payload.Address_2 = step3.policyholderDetails.buildingname;
    payload.Address_3 = step3.policyholderDetails.streetname;
    payload.City = step3.policyholderDetails.city;
    payload.State = step3.policyholderDetails.state;
    payload.Country = 'MAL';
    payload.PostCode = step3.policyholderDetails.postcode;
    payload.DOB = '';
    payload.Risk = new Risk();
    payload.Risk.RiskGrp = [
      {
        Cover: {
          CoverGrp: [{
            PlanCode: step2.payload.cover.planCode,
            PlanDesc: step2.payload.cover.planDescription
          }],
        },
        RiskLoc: {
          AddressNo: step3.policyholderDetails.addressnumber,
          City: step3.policyholderDetails.city,
          Country: 'MAL',
          InceptionDate: '',
          PostCode: step3.policyholderDetails.postcode,
          RiskArea: step3.policyholderDetails.area,
          RiskBuildingName: step3.policyholderDetails.buildingname,
          RiskStreetName: step3.policyholderDetails.streetname,
          State: step3.policyholderDetails.state,
        }
      },
    ];
    payload.PaymentMode = 'A';
    payload.AutoRenewalInd = false;
    payload.FirstPayment = quoteState.premium.premiumDueRounded;
    payload.BusinessOperation = step3.policyholderDetails.businessoperation;


    return this.quoteProgessService.postQuoteProgress(payload, PRODUCT_CAT).pipe(
      map((res: any) => {
        return patchState({
          quoteProgress: res
        });
      })
    );
  }

  @Action(QUOTE_INFO)
  public absQuoteInfo(
    { patchState }: StateContext<QUOTE_PROGRESS_STATE_MODEL>,
    { referenceNumber, PRODUCT_CAT }: QUOTE_INFO
  ) {
    return this.quoteProgessService.getQuoteInfo(referenceNumber, PRODUCT_CAT).pipe(
      map((res: any) => {
        patchState({
          paymentResult: res.Result,
        });
      })
    );
  }

  @Action(FLOOD_PRONE_AREA)
  public floodProneArea(
    { patchState }: StateContext<QUOTE_PROGRESS_STATE_MODEL>,
    { postCode }: FLOOD_PRONE_AREA
  ) {
    return this.quoteProgessService.getFloodPronePostcode(postCode).pipe(
      map((res: any) => {
        patchState({
          floodProneArea: res,
        });
      })
    );
  }

}
