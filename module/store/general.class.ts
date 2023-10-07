export class PRODUCT_CONFIG {
  AgentEmail: string;
  AgentPhoneNo: string;
  rebatePct: string;
  expiryDaysLimit: string;
  AgentCode: string;
  ProductCode: string;
  SourceSystemCat: string;
  STaxInd: string;
  STaxPct: string;
  LeaveMyDetailsBtnInd: string;
  SiCalculatorInd: string;
  voucherCodeInd: string;
  constructor(obj?: any) {
    this.AgentEmail = (obj && obj.AgentEmail) || '';
    this.AgentPhoneNo = (obj && obj.AgentPhoneNo) || '';
    this.rebatePct = (obj && obj.rebatePct) || '';
    this.expiryDaysLimit = (obj && obj.expiryDaysLimit) || '';
    this.AgentCode = (obj && obj.AgentCode) || '';
    this.ProductCode = (obj && obj.ProductCode) || '';
    this.SourceSystemCat = (obj && obj.SourceSystemCat) || '';
    this.STaxInd = (obj && obj.STaxInd) || '';
    this.STaxPct = (obj && obj.STaxPct) || '';
    this.LeaveMyDetailsBtnInd = (obj && obj.LeaveMyDetailsBtnInd) || '';
    this.SiCalculatorInd = (obj && obj.SiCalculatorInd) || '';
    this.voucherCodeInd = (obj && obj.voucherCodeInd) || 'N';
  }
}