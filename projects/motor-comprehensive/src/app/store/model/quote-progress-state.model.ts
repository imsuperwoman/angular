export const DEFAULTS: QUOTE_PROGRESS_STATE_MODEL = {
    vehicleDetails: '',
    documentData: '',
    bannerData: '',
    agentInfo: '',
    quoteProgress: '',
    AVMakeList: '',
    PIAM_HybridList: [],
    PIAM_VehicleMakeInfo: '',
    PIAM_MakeList: [],
    modelList: '',
    referedRiskDetails: '',
    quote: '',
    SumInsuredList: [],
    checkUserInfo: '',
    contactAgent: '',
    checkSanction: '',
    qualityCheck: '',
    staffResult: '',
    paymentResult: ''
};

export interface QUOTE_PROGRESS_STATE_MODEL {
    vehicleDetails: any;
    documentData: any;
    bannerData: any;
    agentInfo: any;
    quoteProgress: any;
    AVMakeList: any;
    PIAM_HybridList: any;
    PIAM_VehicleMakeInfo: any;
    PIAM_MakeList: any;
    modelList: any,
    referedRiskDetails: any;
    quote: any;
    SumInsuredList: any;
    checkUserInfo: any;
    UBBStatus?: any;
    contactAgent: any;
    checkSanction: any;
    qualityCheck: any,
    staffResult?: any;
    paymentResult?: any;
}