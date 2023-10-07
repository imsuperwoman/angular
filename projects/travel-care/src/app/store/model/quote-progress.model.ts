import { Risk } from "./risk.model";

export const DEFAULTS: QUOTE_PROGRESS_STATE_MODEL = {
  documentData: '',
  quoteProgress: '',
  planRecommendation: '',
  checkUserInfo: '',
  paymentResult: '',
  staffResult: '',
  sanction: '',
  journeyTravellerDetails: '',
  promoList: '',
  pomoPlanRecommendation: '',
  travellerCheckout: '',
};

export interface QUOTE_PROGRESS_STATE_MODEL {
  documentData: any;
  planRecommendation: any;
  quoteProgress: any;
  journeyTravellerDetails: any;
  checkUserInfo: any;
  paymentResult: any;
  staffResult: any;
  sanction: any;
  promoList: any;
  pomoPlanRecommendation: any;
  travellerCheckout: any;
}

export type CheckSanction = {
  appName?: string;
  clientRefNo?: string;
  personsList?: any;
}

export type PlanRecommendation = {
  AgeRange?: string;
  AgentCode?: string;
  ProductCode?: string;
  Area?: string;
  CoverageType?: string;
  MountEvent?: string;
  Journeys?: any;
  DomesticInd?: boolean;
  EffectiveDate?: string;
  ExpiryDate?: string;
  NoOfAdults?: string;
  NoOfChildren?: string;
  NoOfSeniors?: string;
  ProductCategory?: string;
  ProductType?: string;
  QuotationProgress?: string;
  TravelWith?: string;
  ProductShortDescription?: string;
  SourceSystemCat?: string;
  SourceSystem?: string;
  Risk: Risk;
  Voucher?: any;
  QuotationNumber?: any;

  ClientID?: any;
  ClientIDType?: any;
  ClientName?: any;
  Country?: any;
  DOB?: any;
  EmailAddress?: any;
  Gender?: any;
  DiscountAmt?: any;
  DiscountPct?: any;
  PremiumDueRounded?: any;

  MatchAgentEmail?: string;
  MatchAgentMobile?: string;
  MobileNumber?: string;

  ClientRefNo?: string;
  ClientRefName?: string;
  ClientRefPolicyNo?: string;
  ReferralSalesStaffId?: string;

  UTMCampaign?: string;
  UTMMedium?: string;

  Address_1?: string;
  Address_2?: string;
  Address_3?: string;
  PostCode?: string;
  City?: string;
  State?: string;

  AutoRenewalInd?: any;
  PromoList?: any;
}