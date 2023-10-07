import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { APP_BASE_CONFIG, BASE_CONFIG } from '@services/interceptors/auth-token.interceptor';


@Injectable({
  providedIn: 'root',
})
export class QuoteProgessService {
  private baseConfig: APP_BASE_CONFIG;

  constructor(@Inject(BASE_CONFIG) baseConfig: APP_BASE_CONFIG,
    public http: HttpClient) {
    this.baseConfig = baseConfig;
  }

  postQuote(payload: any, productCode: any) {
    const url = this.baseConfig.API_URL + 'v1/openapi/' + productCode + '/quote';
    return this.http.post(url, payload);
  }

  getQuoteInfo(referenceNumber: any, productCode: any) {
    const url = this.baseConfig.API_URL + 'v1/openapi/uiservices/' + productCode + '/quoteInfo' + `?submissionNo=${referenceNumber}`;
    return this.http.get(url);
  }

  postQuoteProgress(payload: any, productCode: any) {
    const url = this.baseConfig.API_URL + 'v1/openapi/uiservices/' + productCode + '/quoteProgress';
    return this.http.post(url, payload);

  }

  getFloodPronePostcode(postCode: any) {
    const url = this.baseConfig.API_URL + 'v1/openapi/floodProneCheck/' + postCode;
    return this.http.get(url);

  }
}
