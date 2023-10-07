export class Risk {
    RiskGrp: RiskGrp[];
    constructor(obj?: any) {
        this.RiskGrp = obj && obj.RiskGrp || [new RiskGrp()];
    }
}

export class RiskGrp {
    Cover: Cover;
    RiskLoc: RiskLoc;
    constructor(obj?: any) {
        this.Cover = obj && obj.Cover || new Cover();
        this.RiskLoc = obj && obj.RiskLoc || new RiskLoc();
    }
}

export class Cover {
    CoverGrp: CoverGrp[];
    constructor(obj?: any) {
        this.CoverGrp = obj && obj.CoverGrp || [new CoverGrp()];
    }
}

export class CoverGrp {
    PlanCode: string;
    PlanDesc?: string;
    constructor(obj?: any) {
        this.PlanCode = obj && obj.PlanCode || '';
        this.PlanDesc = obj && obj.PlanDesc || '';
    }
}

export class RiskLoc {
    AddressNo: string;
    City: string;
    Country: string;
    InceptionDate: string;
    PostCode: string;
    RiskArea: string;
    RiskBuildingName: string;
    RiskStreetName: string;
    State: string;
    constructor(obj?: any) {
        this.AddressNo = obj && obj.AddressNo || '';
        this.City = obj && obj.City || '';
        this.Country = obj && obj.Country || '';
        this.InceptionDate = obj && obj.InceptionDate || '';
        this.PostCode = obj && obj.PostCode || '';
        this.RiskArea = obj && obj.RiskArea || '';
        this.RiskBuildingName = obj && obj.RiskBuildingName || '';
        this.RiskStreetName = obj && obj.RiskStreetName || '';
        this.State = obj && obj.State || '';
    }
}
