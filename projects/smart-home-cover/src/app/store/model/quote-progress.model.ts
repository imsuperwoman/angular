import { AZOL } from "../../constants/shc-constants";

export const DEFAULTS: QUOTE_PROGRESS_STATE_MODEL = {
  bundleConfig: '',
  documentData: '',
  bannerData: '',
  bundle: '',
  relatedPolicyNo: '',
  quoteProgress: '',
  planRecommendation: '',
  sanction: '',
  checkUserInfo: '',
  paymentResult: '',
  alimPolicyNo: '',
  alimCustomerInd: false,
  AlimPolicyNo: '',
  calculator: {},
};

export interface QUOTE_PROGRESS_STATE_MODEL {
  calculator: any;
  bundleConfig: any;
  bannerData: any;
  documentData: any;
  bundle: any,
  relatedPolicyNo: any,
  planRecommendation: any,
  quoteProgress: any,
  sanction: any;
  checkUserInfo: any;
  paymentResult: any;
  alimPolicyNo: any;
  alimCustomerInd: any;
  AlimPolicyNo: any;
}

export class PropertyDetails {
  QuotationProgress?: string;
  QuotationNumber?: string;
  PolicyNumber?: string;
  ProductCategory: string;
  SourceSystem: string;
  Risk: Risk;
  Voucher?: Voucher;
  VoucherCode?: string;
  RebateAmount?: string;
  RebatePercentage?: string;
  UnderWritingDeclaration?: UnderWriting[];
  AgentCode: any;
  channel: any;
  constructor(obj?: any) {
    this.ProductCategory = (obj && obj.ProductCategory) || 'SHC';
    this.SourceSystem = (obj && obj.SourceSystem) || AZOL;
    this.Risk = (obj && obj.Risk) || new Risk();
    this.UnderWritingDeclaration = (obj && obj.UnderWritingDeclaration) || [new UnderWriting];
  }
}
export class UnderWriting {
  DeclarationQuestion: string;
  DeclarationAnswer: boolean;
  constructor(obj?: any) {
    this.DeclarationQuestion = (obj && obj.DeclarationQuestion) || '';
    this.DeclarationAnswer = (obj && obj.DeclarationAnswer) || false;
  }
}

export class PlanRecommendation {
  checkUBB: CheckUBB;
  quoteProgress: PropertyDetails;
  constructor(obj?: any) {
    this.checkUBB = (obj && obj.checkUBB) || new CheckUBB();
    this.quoteProgress = (obj && obj.quoteProgress) || new PropertyDetails();
  }
}

export class CheckUBB {
  SourceSystem: string;
  ProductCat: string;
  Bundle: string;
  Policy: RiskList;
  channel?: string;
  constructor(obj?: any) {
    this.Bundle = (obj && obj.ProductCat) || '';
    this.ProductCat = (obj && obj.ProductCat) || '';
    this.SourceSystem = (obj && obj.SourceSystem) || '';
    this.Policy = (obj && obj.Policy) || new RiskList();
  }
}

export class RiskList {
  RiskList: QuestionnaireList[];
  constructor(obj?: any) {
    this.RiskList = (obj && obj.RiskList) || [new QuestionnaireList];
  }
}

export class QuestionnaireList {
  CustomerType?: string;
  PostCode: string;
  QuestionnaireList: Questionnaire[];
  constructor(obj?: any) {
    this.PostCode = (obj && obj.PostCode) || '';
    this.QuestionnaireList = (obj && obj.QuestionnaireList) || [new Questionnaire];
  }
}

export class Questionnaire {
  QuestionAnswer: boolean;
  QuestionId: string;
  constructor(obj?: any) {
    this.QuestionAnswer = (obj && obj.QuestionAnswer) || '';
    this.QuestionId = (obj && obj.QuestionId) || '';
  }
}

export class RiskLoc {
  AddressNo?: string;
  RiskBuildingName?: string;
  RiskStreetName?: string;
  RiskArea?: string;
  BuildingStorey?: string;
  CustomerType: string;
  PropertyType: string;
  PostCode: string;
  BuiltUsingBrick: string;
  SumInsured: string;
  ExistingLoan: string;
  HasTenant: string;
  CoverageType: string;
  ConstructionYear?: any;
  Latitude?: string;
  Longitude?: string;
  constructor(obj?: any) {
    this.CustomerType = (obj && obj.CustomerType) || '';
    this.PropertyType = (obj && obj.PropertyType) || '';
    this.PostCode = (obj && obj.PostCode) || '';
    this.BuiltUsingBrick = (obj && obj.BuiltUsingBrick) || '';

    this.SumInsured = (obj && obj.SumInsured) || '';
    this.ExistingLoan = (obj && obj.ExistingLoan) || 'false';
    this.HasTenant = (obj && obj.HasTenant) || 'false';
    this.CoverageType = (obj && obj.CoverageType) || '';
  }
}

export class RiskGrp {
  RiskLocated: string;
  RiskType: string;
  RiskLoc: RiskLoc;
  constructor(obj?: any) {
    this.RiskLocated = (obj && obj.RiskLocated) || '';
    this.RiskType = (obj && obj.RiskType) || '';
    this.RiskLoc = (obj && obj.RiskLoc) || new RiskLoc();
  }
}

export class Risk {
  RiskGrp: RiskGrp[];
  RiskType: string | undefined;
  RiskLoc: RiskLoc | undefined;
  constructor(obj?: any) {
    this.RiskGrp = (obj && obj.RiskGrp) || [new RiskGrp()];
  }
}

export class Voucher {
  VoucherCode: string;
  VoucherStatus: string;
  constructor(obj?: any) {
    this.VoucherCode = (obj && obj.VoucherCode) || '';
    this.VoucherStatus = (obj && obj.VoucherStatus) || 'N';
  }
}

export class QuoteDetailsRiskGrp {
  Cover?: any;
  ItmNo?: string;
  RiskId?: string;
  RiskLoc?: {};
}

export class QuoteDetailsRisk {
  RiskGrp?: QuoteDetailsRiskGrp[];
}

export class QuoteDetails {
  QuotationNumber: string;
  ProductShortDescription: string;
  QuotationProgress: string;
  ProductCategory: string;
  SourceSystem: string;
  SourceSystemCat: string;
  UTMMedium?: string;
  UTMCampaign?: string;
  AgentCode?: string;
  AgentName?: string;
  PostCode?: string;
  RebateAmount?: string;
  RebatePercentage?: string;
  PremiumDue?: string;
  PremiumDueRounded?: string;
  TotalPremExclStamp?: string;
  Stamp?: string;
  IsEPolicy?: string;
  ProductCode?: string;
  ProductType?: string;
  CNoteType?: string;
  MasterPolicyInd?: string;
  EPolicyEmailRecipientCode?: string;
  EpolicyResponseAttachInd?: string;
  GrossPremium?: string;
  Risk?: QuoteDetailsRisk;
  IsAgreedValue?: string;
  ReferenceNo?: string;
  SumInsuredId?: null;
  STaxAmt?: string;
  STaxPct?: string;
  CreatedDate?: string;
  EffectiveDate?: string;
  ExpiryDate?: string;
  Address_1?: string;
  Address_2?: string;
  Address_3?: string;
  Area?: string;
  ClientID?: string;
  ClientIDType?: string;
  ClientName?: string;
  City?: string;
  State?: string;
  Country?: string;
  Latitude?: string;
  Longitude?: string;
  PlusCode?: string;
  PlaceId?: string;
  DOB?: string;
  EmailAddress?: string;
  Gender?: string;
  MobileNumber?: string;
  Nationality?: string;
  MatchAgentEmail?: string;
  MatchAgentMobile?: string;
  CombinedName?: {};
  ClientRefNo?: string;
  ClientRefName?: string;
  ClientRefPolicyNo?: string;
  ReferralSalesStaffId?: string;
  GUID?: string;
  RelatedPolicyNo: any;
  UnderWritingDeclaration?: {};
  AvExternalImp?: string;
  AvGrossBuildUpArea?: string;
  AvQualOfProperty?: string;
  AvTypeOfProperty?: string;
  Uom?: string;
  alimPolicyNo?: string;
  alimCustomerInd?: string;
  AlimPolicyNo?: string;
  Agent?: any;


  constructor(obj?: any) {
    this.QuotationNumber = (obj && obj.QuotationNumber) || '';
    this.ProductShortDescription = (obj && obj.ProductShortDescription) || '';
    this.QuotationProgress = (obj && obj.QuotationProgress) || '';
    this.ProductCategory = (obj && obj.ProductCategory) || 'SHC';
    this.SourceSystem = (obj && obj.SourceSystem) || AZOL;
    this.SourceSystemCat = (obj && obj.SourceSystemCat) || '';
  }
}