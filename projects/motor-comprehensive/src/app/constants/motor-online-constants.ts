import { MENU_ITEM } from "@constants/header-constants";

export const AZOL = 'AZOL';
export const AMO = 'Allianz Smart Home Cover';
export const HEADER = 'Motor Private Comprehensive Cover';
export const SUBHEADER = 'Reliable protection and the peace of mind you need';
export const PRODUCT_CAT = 'MT';
export const LOGO = 'mc-logo.svg';

export const DOCUMENT_MENU: MENU_ITEM[] = [
    {
        label: 'MOTOR COMPREHENSIVE INSURANCE PRODUCT DISCLOSURE SHEET',
        queryParams: '/motor-online/assets/allianz/forms/PDS_MT.pdf'
    },
];
export const PARTNER_DOCUMENT_MENU = [
    {
        partner: 'HSBCBN',
        document: [
            {
                label: 'MOTOR COMPREHENSIVE INSURANCE PRODUCT DISCLOSURE SHEET',
                queryParams: '/motor-online/assets/allianz/forms/PDS_MT.pdf'
            },
            {
                label: 'MOTOR COMPREHENSIVE  COVER PRIVATE CAR POLICY ENG',
                queryParams: '/motor-online/assets/allianz/forms/PrivateCarPolicy_Eng.pdf'
            },
            {
                label: 'MOTOR COMPREHENSIVE  COVER PRIVATE CAR POLICY BM',
                queryParams: '/motor-online/assets/allianz/forms/PrivateCarPolicy_BM.pdf'
            },


        ]

    },

]
export const EMAIL_SUBJECT = {
    customer: `Our Allianz Representative Will be Contacting You Soon!`,
    agentInQuoteLeaveDetails: `Contact the Customer Soon to Secure the Business!`,
    agentRisk: `Contact the Customer Soon to Secure the Business! (Referred Risk)`,
    agentQuotation: `A customer is interested in Motor Insurance!`,
};

export const ERROR_DESC = {
    agentDesc: `underwriting control`,
};