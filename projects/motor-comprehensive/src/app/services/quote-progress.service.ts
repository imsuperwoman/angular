import { Injectable, Inject } from '@angular/core';
import { APP_BASE_CONFIG, BASE_CONFIG } from '@services/interceptors/auth-token.interceptor';
import { HttpClient } from '@angular/common/http';
import { API_PATH } from 'projects/motor-comprehensive/src/app/constants/user-input-constants';

@Injectable({
  providedIn: 'root',
})

export class QuoteProgessService {
  private baseConfig: APP_BASE_CONFIG;
  constructor(@Inject(BASE_CONFIG) baseConfig: APP_BASE_CONFIG, public http: HttpClient) {
    this.baseConfig = baseConfig;
  }

  getReferedRiskDetails(contractNo: any) {
    const url = this.baseConfig.API_URL + API_PATH.REFERED_RISK_DETAILS + contractNo;
    return this.http.get(url);
  }

  getMakeList() {
    let url = this.baseConfig.API_URL + API_PATH.MAKE_LIST;
    return this.http.get(url);
  }

  getSumInsuredList(avCode: any, region: any) {
    let url = this.baseConfig.API_URL + `v1/openapi/mci/sumInsuredList/${avCode}?region=${region}`;
    return this.http.get(url);
  }

  getValidateId(idNo: any) {
    let url = this.baseConfig.API_URL + `v1/openapi/mci/validateId/${idNo}`;
    return this.http.get(url);
  }

  postValidateVoucher(payload: any) {
    let url = this.baseConfig.API_URL + API_PATH.VALIDATE_VOUCHER;
    return this.http.post(url, payload);
  }

  getQuoteInfo(referenceNumber: any) {
    const url = this.baseConfig.API_URL + API_PATH.QUOTE_INFO + `?submissionNo=${referenceNumber}`;
    return this.http.get(url);
  }

  postPIAM(payload: any) {
    let url = this.baseConfig.API_URL + API_PATH.PIAM;
    return this.http.post(url, payload);
  }
  postContactAgent(payload: any) {
    const url = this.baseConfig.API_URL + API_PATH.MCI_CONTACT_AGENT;
    return this.http.post(url, payload);
  }
  postCheckSanction(payload: any) {
    const url = this.baseConfig.API_URL + API_PATH.CHECK_SANCTION;
    return this.http.post(url, payload);
  }
  postQualityCheck(payload: any) {
    const url = this.baseConfig.API_URL + API_PATH.MO_QUALITY_CHECK;
    return this.http.post(url, payload);
  }

  postVehicleDetails(payload: any) {
    const url = this.baseConfig.API_URL + API_PATH.VEHICLE_DETAILS;
    return this.http.post(url, payload);
  }

  postAgentInfo(payload: any) {
    const url = this.baseConfig.API_URL + API_PATH.AGENT_INFO;
    return this.http.post(url, payload);
  }

  postQuoteProgress(payload: any) {
    const url = this.baseConfig.API_URL + API_PATH.QUOTE_PROGRESS;
    return this.http.post(url, payload);
  }

  postQuote(payload: any) {
    const url = this.baseConfig.API_URL + API_PATH.QUOTE;
    return this.http.post(url, payload);
  }

  postModelList(payload: any) {
    let url = this.baseConfig.API_URL + API_PATH.MODEL_LIST;
    return this.http.post(url, payload);
  }

  postCheckUbb(payload: any) {
    let url = this.baseConfig.API_URL + API_PATH.CHECKUBB;
    return this.http.post(url, payload);
  }
  getIsValidBinCardNumber(sourceSystem: any, binNumber: any) {
    const url = this.baseConfig.API_URL + API_PATH.IS_VALID_BIN_CARD_NUMBER + `/${sourceSystem}/${binNumber}`;
    return this.http.get(url);
  }
}
