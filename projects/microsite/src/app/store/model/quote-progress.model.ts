import { Risk } from './risk.model';

export const DEFAULTS: QUOTE_PROGRESS_STATE_MODEL = {
  quoteResult: '',
  quoteProgress: '',
  paymentResult: '',
  floodProneArea: '',
};

export interface QUOTE_PROGRESS_STATE_MODEL {
  quoteResult: any;
  quoteProgress: any;
  paymentResult: any;
  floodProneArea: any;
}

export class QUOTE_PROGRESS_MODEL {
  url: string;
  ProductCategory: string;
  ProductShortDescription: string;
  QuotationNumber: number;
  ProductCode: string;
  SourceSystem: string;
  SourceSystemCat: string;
  AgentCode: string;
  Risk: Risk;
  QuotationProgress: string;
  PaymentMode: string;
  EffectiveDate: string;
  ExpiryDate: string;
  AutoRenewalInd: boolean;
  CreatedDate: string;
  ClientID: string;
  ClientIDType: string;
  ClientName: string;
  Gender: string;
  MobileNumber: string;
  EmailAddress: string;
  Address_1: string;
  Address_2: string;
  Address_3: string;
  City: string;
  State: string;
  Country: string;
  PostCode: string;
  DOB!: string;
  FirstPayment: string;
  BusinessOperation: string;

  constructor(obj?: any) {
    this.url = obj && obj.url || '';
    this.ProductCategory = obj && obj.ProductCategory || '';
    this.ProductShortDescription = obj && obj.ProductShortDescription || '';
    this.ProductCode = obj && obj.ProductCode || '';
    this.QuotationNumber = obj && obj.QuotationNumber || '';
    this.SourceSystem = obj && obj.SourceSystem || '';
    this.SourceSystemCat = obj && obj.SourceSystemCat || '';
    this.AgentCode = obj && obj.AgentCode || '';
    this.Risk = obj && obj.Risk || new Risk();
    this.QuotationProgress = obj && obj.QuotationProgress || '';
    this.PaymentMode = obj && obj.PaymentMode || '';
    this.EffectiveDate = obj && obj.EffectiveDate || '';
    this.ExpiryDate = obj && obj.ExpiryDate || '';
    this.AutoRenewalInd = obj && obj.AutoRenewalInd || false;
    this.CreatedDate = obj && obj.CreatedDate || '';
    this.ClientID = obj && obj.ClientID || '';
    this.ClientIDType = obj && obj.ClientIDType || '';
    this.ClientName = obj && obj.ClientName || '';
    this.Gender = obj && obj.Gender || '';
    this.MobileNumber = obj && obj.MobileNumber || '';
    this.EmailAddress = obj && obj.EmailAddress || '';
    this.Address_1 = obj && obj.Address_1 || '';
    this.Address_2 = obj && obj.Address_2 || '';
    this.Address_3 = obj && obj.Address_3 || '';
    this.City = obj && obj.City || '';
    this.State = obj && obj.State || '';
    this.Country = obj && obj.Country || '';
    this.PostCode = obj && obj.PostCode || '';
    this.BusinessOperation = obj && obj.BusinessOperation || '';
    this.FirstPayment = obj && obj.FirstPayment || '';
  }
}
