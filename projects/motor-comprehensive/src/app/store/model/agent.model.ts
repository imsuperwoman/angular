
export class AgentInfo {
    AgentCode: string;
    AgentName: string;
    Email: string;
    TelNo: string;
    HpNo: string;
    MobileNumber: string;
    Address: string;

    Branch: string;
    BranchCd: string;
    DistChannel: string;
    DistChannelCd: string;
    SubChannel: string;
    SubChannelCd: string;

    HrtvGrp: string;
    Region: string;
    RegionGrpCode: string;

    UwExcessGrp: string;
    UwGuidelineGrp: string;
    UwMtaccessGrp: string;
    UwNmaccessGrp: string;
    UwParamGrp: string;

    constructor(obj?: AgentInfo) {
        this.AgentCode = obj && obj.AgentCode || '';
        this.AgentName = obj && obj.AgentName || '';
        this.Email = obj && obj.Email || '';
        this.TelNo = obj && obj.TelNo || '';
        this.HpNo = obj && obj.HpNo || '';
        this.MobileNumber = obj && obj.MobileNumber || '';
        this.Address = obj && obj.Address || '';

        this.Branch = obj && obj.Branch || '';
        this.BranchCd = obj && obj.BranchCd || '';
        this.DistChannel = obj && obj.DistChannel || '';
        this.DistChannelCd = obj && obj.DistChannelCd || '';
        this.SubChannel = obj && obj.SubChannel || '';
        this.SubChannelCd = obj && obj.SubChannelCd || '';

        this.HrtvGrp = obj && obj.HrtvGrp || '';
        this.Region = obj && obj.Region || '';
        this.RegionGrpCode = obj && obj.RegionGrpCode || '';

        this.UwExcessGrp = obj && obj.UwExcessGrp || '';
        this.UwGuidelineGrp = obj && obj.UwGuidelineGrp || '';
        this.UwMtaccessGrp = obj && obj.UwMtaccessGrp || '';
        this.UwNmaccessGrp = obj && obj.UwNmaccessGrp || '';
        this.UwParamGrp = obj && obj.UwParamGrp || '';
    }
}
