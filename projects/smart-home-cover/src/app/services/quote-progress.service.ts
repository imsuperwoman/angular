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

  getIsValidBinCardNumber(sourceSystem: any, binNumber: any) {
    const url = this.baseConfig.API_URL + API_PATH.IS_VALID_BIN_CARD_NUMBER + `/${sourceSystem}/${binNumber}`;
    return this.http.get(url);
  }

  getQuoteInfo(referenceNumber: any) {
    const url = this.baseConfig.API_URL + API_PATH.QUOTE_INFO + `?submissionNo=${referenceNumber}`;
    return this.http.get(url);
  }

  postBasicPropertyDetails(payload: any) {
    const url = this.baseConfig.API_URL + API_PATH.BASIC_PROPERTY_DETAILS;
    return this.http.post(url, payload);
  }

  postCalculator(payload: any) {
    const url = this.baseConfig.API_URL + API_PATH.CALCULATOR;
    return this.http.post(url, payload);
  }

  putPlanRecommendation(payload: any) {
    const url = this.baseConfig.API_URL + API_PATH.PLAN_RECOMMENDATION;
    return this.http.put(url, payload);
  }
  postAlimPolicyEnquiry(payload: any) {
    const url = this.baseConfig.API_URL + API_PATH.ALIM_POLICY_ENQUIRY;
    return this.http.post(url, payload);
  }

  postRefreshQuote(payload: any) {
    const url = this.baseConfig.API_URL + API_PATH.REFRESH_QUOTE;
    return this.http.post(url, payload);
  }

  postRenewalPolicies(payload: any) {
    const url = this.baseConfig.API_URL + API_PATH.RENEWAL_POLICIES;
    return this.http.post(url, payload);
  }

  postEpolicyInquiry(payload: any) {
    const url = this.baseConfig.API_URL + API_PATH.EPOLICY_INQUIRY;
    return this.http.post(url, payload);
  }

  putCustomerDetails(payload: any) {
    const url = this.baseConfig.API_URL + API_PATH.CUSTOMER_DETAILS;
    return this.http.put(url, payload);
  }

  postCheckSanction(payload: any) {
    let url = this.baseConfig.API_URL + API_PATH.CHECK_SANCTION;
    return this.http.post(url, payload);
  }

  postQualityCheck(payload: any) {
    const url = this.baseConfig.API_URL + API_PATH.QUALITY_CHECK;
    return this.http.post(url, payload);
  }

  putQuoteDetails(payload: any) {
    const url = this.baseConfig.API_URL + API_PATH.QUOTE_DETAILS;
    return this.http.put(url, payload);
  }

  postBundleConfig(payload: any) {
    const url = this.baseConfig.API_URL + API_PATH.BUNDLE_CONFIG;
    return this.http.post(url, payload);
  }

  postQuoteProgress(payload: any) {
    const url = this.baseConfig.API_URL + API_PATH.QUOTE_PROGRESS;
    return this.http.post(url, payload);
  }

}
