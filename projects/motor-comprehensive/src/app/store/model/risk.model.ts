export class Risk {
    RiskGrp: RiskGrp[];
    constructor(obj?: any) {
        this.RiskGrp = obj && obj.RiskGrp || [new RiskGrp()];
    }
}

export class RiskGrp {
    RiskLocated: string;
    RiskType: string;
    RiskVeh: RiskVeh;
    Cover: Cover;
    ItmNo?: string;
    RiskId: string;
    RiskPerson: RiskPerson;
    constructor(obj?: any) {
        this.RiskLocated = obj && obj.RiskLocated || '';
        this.RiskType = obj && obj.RiskType || '';
        this.RiskVeh = obj && obj.RiskVeh || new RiskVeh();
        this.Cover = obj && obj.Cover || new Cover();
        this.RiskId = obj && obj.RiskId || '';
        this.RiskPerson = obj && obj.RiskPerson || new RiskPerson();
    }
}
export class RiskVeh {
    RiskId!: string;
    RiskLocated: string;
    VehicleNo: number;
    VehicleSeat: string;
    VehicleModel: string;
    VehicleDescription: string;
    CompanyVehicle: string;
    VehicleCapacity: string;
    VehicleUOM: string;
    AvMakeCode: string;
    AvModelCode: string;
    AvVehDescp!: string;
    AvVehSumInsured: number;
    IsmMakeCode: string;
    IsmModelCode: string;
    NcdPct!: number;
    NcdAmt!: number;
    NoOfClaims!: string;
    VehMakeYear: number;
    ReconInd: string;
    MakeDescp: string;
    ModelDescp: string;
    constructor(obj?: any) {
        this.RiskLocated = obj && obj.RiskLocated || '';
        this.VehicleNo = obj && obj.VehicleNo || '';
        this.VehicleSeat = obj && obj.VehicleSeat || '';
        this.VehicleModel = obj && obj.VehicleModel || '';
        this.VehicleDescription = obj && obj.VehicleDescription || '';
        this.CompanyVehicle = obj && obj.CompanyVehicle || '';
        this.VehicleCapacity = obj && obj.VehicleCapacity || '';
        this.VehicleUOM = obj && obj.VehicleUOM || '';
        this.AvMakeCode = obj && obj.AvMakeCode || '';
        this.AvModelCode = obj && obj.AvModelCode || '';
        this.AvVehSumInsured = obj && obj.AvVehSumInsured || null;
        this.IsmMakeCode = obj && obj.IsmMakeCode || '';
        this.IsmModelCode = obj && obj.IsmModelCode || '';
        this.VehMakeYear = obj && obj.VehMakeYear || '';
        this.ReconInd = obj && obj.ReconInd || '';
        this.MakeDescp = obj && obj.MakeDescp || '';
        this.ModelDescp = obj && obj.ModelDescp || '';
    }
}

export class Cover {
    CoverGrp: CoverGrp[];
    constructor(obj?: any) {
        this.CoverGrp = obj && obj.CoverGrp || [new CoverGrp()];
    }
}

export class CoverGrp {
    CoverCode: string;
    Si!: string;
    BasicPrem!: string;
    AnnualPrem!: string;
    GrossPrem!: string;
    NettPrem!: string;
    SubCover!: SubCover;
    constructor(obj?: any) {
        this.SubCover = obj && obj.CoverGrp || new SubCover();
        this.CoverCode = obj && obj.CoverCode || '01';
    }
}

export class SubCover {
    SubCoverGrp: SubCoverGrp[];
    constructor(obj?: any) {
        this.SubCoverGrp = obj && obj.SubCoverGrp || [new SubCoverGrp()];
    }
}

export class SubCoverGrp {
    SubCoverCode: string;
    SubPrem?: string;
    SubCoverDescp?: string;
    CartAmt?: number;
    CartDays?: number;
    WindscreenSi?: number;
    constructor(obj?: any) {
        this.SubCoverCode = obj && obj.SubCoverCode || '';
    }
}

export class RiskDrvrList {
    DriverGrp: DriverGrp[];
    constructor(obj?: any) {
        this.DriverGrp = obj && obj.DriverGrp || [new DriverGrp()];
    }
}

export class DriverGrp {
    DriverSeq: number;
    DriverName: string;
    DriverId: string;
    DriverAge: number;
    RiskDriverId: number;
    DriverType: string;
    constructor(obj?: any) {
        this.DriverSeq = obj && obj.DriverSeq || 1;
        this.DriverName = obj && obj.DriverName || '';
        this.DriverId = obj && obj.DriverId || '';
        this.DriverAge = obj && obj.DriverAge || null;
        this.RiskDriverId = obj && obj.RiskDriverId || null;
        this.DriverType = obj && obj.DriverType || null;
    }
}

export class RiskPerson {
    Name: string;
    MobileNumber: string;
    Email: string;
    constructor(obj?: any) {
        this.Name = obj && obj.Name || '';
        this.MobileNumber = obj && obj.MobileNumber || '';
        this.Email = obj && obj.Email || '';
    }
}
