export class CheckUBB {
    ReferenceNo: string;
    SourceSystem: string;
    CheckUbbInd: string;
    ClaimsExp: string;
    ReconInd: string;
    Policy: Policy;
    ProductCat: string;
    ExcessWaiveInd: boolean;
    channel?: string;
    voucherCode?: string;
    constructor(obj?: any) {
        this.ReferenceNo = obj && obj.ReferenceNo || '';
        this.SourceSystem = obj && obj.SourceSystem || '';
        this.CheckUbbInd = obj && obj.CheckUbbInd || '2';
        this.Policy = obj && obj.Policy || new Policy();
        this.ProductCat = obj && obj.ProductCat || 'MT';
        this.ClaimsExp = obj && obj.ClaimsExp || '';
        this.ReconInd = obj && obj.ReconInd || '';
        this.ExcessWaiveInd = obj && obj.ExcessWaiveInd || '';
    }
}
export class Policy {
    PolicyEffectiveDate: string;
    PolicyExpiryDate: string;
    Agent: Agent;
    Client: Client;
    RiskList: RiskList[];
    constructor(obj?: any) {
        this.PolicyEffectiveDate = obj && obj.PolicyEffectiveDate || '';
        this.PolicyExpiryDate = obj && obj.PolicyExpiryDate || '';
        this.Agent = obj && obj.Agent || new Agent();
        this.Client = obj && obj.Client || new Client();
        this.RiskList = obj && obj.RiskList || [new RiskList()];
    }
}

export class Agent {
    Code: string;
    constructor(obj?: any) {
        this.Code = obj && obj.Code || '';
    }
}

export class Client {
    IdentificationNumber: string;
    IdType: string;
    Age: string;
    constructor(obj?: any) {
        this.IdentificationNumber = obj && obj.IdentificationNumber || '';
        this.IdType = obj && obj.IdType || '';
        this.Age = obj && obj.Age || '';
    }
}

export class RiskList {
    RiskId: string;
    InsuredPerson: InsuredPerson;
    Vehicle: Vehicle;
    CoverList: CoverList[];
    constructor(obj?: any) {
        this.RiskId = obj && obj.RiskId || '';
        this.InsuredPerson = obj && obj.InsuredPerson || new InsuredPerson();
        this.Vehicle = obj && obj.Vehicle || new Vehicle();
        this.CoverList = obj && obj.CoverList || [new CoverList()];
    }
}

export class InsuredPerson {
    IdentificationNumber: string;
    IdType: string;
    constructor(obj?: any) {
        this.IdentificationNumber = obj && obj.IdentificationNumber || '';
        this.IdType = obj && obj.IdType || '';
    }
}

export class Vehicle {
    AvCode: string;
    Capacity: string;
    MakeCode: string;
    Model: string;
    PiamModel: string;
    ReconInd: string;
    Seat: string;
    VehicleNo: string;
    YearOfManufacture: string;
    NamedDriverList: NamedDriverList[];
    ClaimsExp: string;
    HighPerformanceInd: boolean;
    HrtvInd: boolean;
    constructor(obj?: any) {
        this.AvCode = obj && obj.AvCode || '';
        this.Capacity = obj && obj.Capacity || '';
        this.MakeCode = obj && obj.MakeCode || '';
        this.Model = obj && obj.Model || '';
        this.PiamModel = obj && obj.PiamModel || '';
        this.ReconInd = obj && obj.ReconInd || '';
        this.Seat = obj && obj.Seat || '';
        this.VehicleNo = obj && obj.VehicleNo || '';
        this.YearOfManufacture = obj && obj.VehicleNo || '';
        this.NamedDriverList = obj && obj.NamedDriverList || [new NamedDriverList()];
        this.ClaimsExp = obj && obj.ClaimsExp || '';
        this.HighPerformanceInd = obj && obj.HighPerformanceInd || '';
        this.HrtvInd = obj && obj.HrtvInd || '';
    }
}

export class NamedDriverList {
    Age: string;
    IdentificationNumber: string;
    constructor(obj?: any) {
        this.Age = obj && obj.Age || '';
        this.IdentificationNumber = obj && obj.IdentificationNumber || '';
    }
}

export class CoverList {
    CoverPremium: CoverPremium;
    constructor(obj?: any) {
        this.CoverPremium = obj && obj.CoverPremium || new CoverPremium();
    }
}
export class CoverPremium {
    SumInsured!: string;
}
