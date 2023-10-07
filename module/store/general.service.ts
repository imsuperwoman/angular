import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { APP_BASE_CONFIG, BASE_CONFIG } from '@services/interceptors/auth-token.interceptor';
import { retry } from 'rxjs/operators';
import { API_PATH } from './general-constants';
@Injectable({
  providedIn: 'root'
})
export class GeneralService {

  private baseConfig: APP_BASE_CONFIG
  static baseConfig: any;

  checkingOut: boolean = false;

  constructor(
    @Inject(BASE_CONFIG) baseConfig: APP_BASE_CONFIG,
    public http: HttpClient
  ) {
    this.baseConfig = baseConfig;
  }

  postAccessToken() {
    const _header = {
      Authorization: `Basic ${this.baseConfig.API_TOKEN}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    };
    const _url = this.baseConfig.API_URL + API_PATH.ACCESS_TOKEN;
    const _body = 'grant_type=client_credentials';
    return this.http.post(_url, _body, { headers: _header }).pipe(retry(1));
  }

  getDynamicContent(partnerCode: string) {
    const url = this.baseConfig.API_URL + API_PATH.PARTNER_CUSTOMIZATION + `${partnerCode}`;
    return this.http.get(url).pipe(retry(2));
  }

  postAgentLocator(payload: any) {
    const url = this.baseConfig.API_URL + API_PATH.AGENT_LOCATOR;
    return this.http.post(url, payload);
  }

  postAgentDetails(payload: any) {
    const url = this.baseConfig.API_URL + API_PATH.AGENT;
    return this.http.post(url, payload);
  }

  postContactAgent(payload: any) {
    const url = this.baseConfig.API_URL + API_PATH.CONTACT_AGENT;
    return this.http.post(url, payload);
  }

  postReferredRisk(payload: any, productCode: string) {
    const url = this.baseConfig.API_URL + API_PATH.EMAIL_NOTIFICATION + productCode + API_PATH.REFERRED_RISK;
    return this.http.post(url, payload);
  }

  postLOV(payload: any) {
    const url = this.baseConfig.API_URL + API_PATH.LOV;
    return this.http.post(url, payload)
  }

  postPostCodes(postcode: any) {
    const url = this.baseConfig.API_URL + API_PATH.POSTAL_CODES;
    return this.http.post(url, postcode).pipe(retry(2));
  }

  postProductConfig(payload: any) {
    const _url = this.baseConfig.API_URL + API_PATH.PRODUCT_CONFIG;
    return this.http.post(_url, payload);
  }

  postUnderwriting(payload: any) {
    const url = this.baseConfig.API_URL + API_PATH.UNDERWRITING_QUESTIONS;
    return this.http.post(url, payload);
  }

  getPaymentSubmission(payload: any) {
    const url = this.baseConfig.API_URL + 'v1/openapi/paymentSubmission';
    return this.http.post(url, payload);
  }

  getSignature(payload: any) {
    const url = this.baseConfig.API_URL + 'v1/openapi/paymentSignature';
    return this.http.post(url, payload);
  }

  getQuoteProgress(payload: any, productCode: any) {
    const url = this.baseConfig.API_URL + 'v1/openapi/uiservices/' + productCode + '/quoteProgress';
    return this.http.post(url, payload);
  }

  getFormattedAddress(payload: any) {
    const url = this.baseConfig.API_URL + API_PATH.FORMATTED_ADDRESS;
    return this.http.post(url, payload);
  }
}
