export type Risk = {
    RiskGrp: RiskGrp[];
}

export class RiskGrp {
    RiskLocated: string;
    RiskType: string;
    TravelerSequence: number;
    RiskPerson: RiskPerson;
    Cover: any;
    ItmNo!: any;
    RiskId!: any;
    RiskNomineeList!: any;
    RiskParentId!: any;
    constructor(obj?: any) {
        this.RiskLocated = obj && obj.RiskLocated || '';
        this.RiskType = obj && obj.RiskType || '';
        this.TravelerSequence = obj && obj.TravelerSequence || '';
        this.RiskPerson = obj && obj.RiskPerson || new RiskPerson();
    }
}

export class RiskList {
    RiskId: number;
    InsuredPerson!: InsuredPerson;
    CoverList: any;
    constructor(obj?: any) {
        this.RiskId = obj && obj.RiskId || '';
    }
}

export class InsuredPerson {
    IdentificationNumber: any;
    IdType: any;
    CoverageType: any;
}

export class RiskPerson {
    RiskId?: string;
    Name: string;
    DOB!: string;
    Email?: string;
    AgeRange?: string;
    Nationality?: string;
    InsuredType?: string;
    ExtSportsInd?: boolean;
    MountaineeringInd?: boolean;
    Principal?: boolean;
    IdType1?: string;
    IdValue1?: string;
    Age?: number;
    Gender?: string;

    Relationship?: string;
    CountryOfBirth?: string;
    MobileNumber?: string;
    Valid?: boolean;

    Address_1?: string;
    Address_2?: string;
    Address_3?: string;
    PostCode?: string;
    City?: string;
    State?: string;

    GuardianIdType?: string;
    GuardianIdValue?: string;
    GuardianName?: string;

    constructor(obj?: any) {
        this.Name = obj && obj.Name || '';
        this.AgeRange = obj && obj.AgeRange || '';
        this.Nationality = obj && obj.Nationality || '';
        this.MountaineeringInd = obj && obj.MountaineeringInd || false;
        this.ExtSportsInd = obj && obj.ExtSportsInd || false;
        this.Principal = obj && obj.Principal || false;
        this.IdType1 = obj && obj.IdType1 || '';

        this.IdValue1 = obj && obj.IdValue1 || '';
        this.Age = obj && obj.Age || '';
        this.Gender = obj && obj.Gender || '';
        this.Relationship = obj && obj.Relationship || '';

        this.CountryOfBirth = obj && obj.CountryOfBirth || '';
        this.MobileNumber = obj && obj.MobileNumber || '';
    }
}
