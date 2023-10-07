import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { APP_BASE_CONFIG, BASE_CONFIG } from '@services/interceptors/auth-token.interceptor';
import { API_PATH } from '../constants/user-input-constants';


@Injectable({
  providedIn: 'root',
})
export class QuoteProgessService {
  private baseConfig: APP_BASE_CONFIG;

  constructor(@Inject(BASE_CONFIG) baseConfig: APP_BASE_CONFIG, public http: HttpClient) {
    this.baseConfig = baseConfig;
  }

  putPlanRecommendations(payload: any) {
    const url = this.baseConfig.API_URL + API_PATH.PLAN_RECOMMENDATIONS;
    return this.http.put(url, payload);
  }

  putQuoteProgress(payload: any) {
    const url = this.baseConfig.API_URL + API_PATH.QUOTE_PROGRESS;
    return this.http.put(url, payload);
  }

  putJourneyTravellerDetails(payload: any) {
    const url = this.baseConfig.API_URL + API_PATH.JOURNEY_TRAVELLER_DETAILS;
    return this.http.put(url, payload);
  }

  postQualityCheck(payload: any) {
    const url = this.baseConfig.API_URL + API_PATH.QUALITY_CHECK;
    return this.http.post(url, payload);
  }

  postValidateVoucher(payload: any) {
    let url = this.baseConfig.API_URL + API_PATH.VALIDATE_VOUCHER;
    return this.http.post(url, payload);
  }

  getIsValidBinCardNumber(sourceSystem: any, binNumber: any) {
    const url = this.baseConfig.API_URL + API_PATH.IS_VALID_BIN_CARD_NUMBER + `/${sourceSystem}/${binNumber}`;
    return this.http.get(url);
  }

  postCheckSanction(payload: any) {
    let url = this.baseConfig.API_URL + API_PATH.CHECK_SANCTION;
    return this.http.post(url, payload);
  }

  getPromoList(contractNumber: any) {
    const url = this.baseConfig.API_URL + API_PATH.PROMO_LIST + `/${contractNumber}`;
    return this.http.get(url);
  }

  getQuoteInfo(referenceNumber: any) {
    const url = this.baseConfig.API_URL + API_PATH.QUOTE_INFO + `?submissionNo=${referenceNumber}`;
    return this.http.get(url);
  }

  postUtilizePromo(payload: any) {
    const url = this.baseConfig.API_URL + API_PATH.UTILIZE_PROMO;
    return this.http.post(url, payload);
  }

  postPromoSubmission(payload: any) {
    const url = this.baseConfig.API_URL + API_PATH.PROMO_SUBMISSION;
    return this.http.post(url, payload);
  }
}
