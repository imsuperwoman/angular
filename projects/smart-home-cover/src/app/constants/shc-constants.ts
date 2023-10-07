import { MENU_ITEM } from "@constants/header-constants";

export const AZOL = 'AZOL';
export const ASHC = 'Allianz Smart Home Cover';
export const SHC = 'Smart Home Cover';
export const SUBHEADER = 'A new kind of home insurance';
export const PRODUCT_CAT = 'SHC';
export const LOGO = 'smart-home-cover-logo.png';


export const DOCUMENT_MENU: MENU_ITEM[] = [
    {
        label: 'SMART HOME COVER PRODUCT DISCLOSURE SHEET',
        queryParams: '/smart-home-cover/assets/allianz/forms/SmartHomeCover_ProductDisclosureSheet_ENG_AZ2302.pdf'
    },
];

export const PARTNER_DOCUMENT_MENU = [
    {
        partner: 'HSBCBN',
        document: [
            {
                label: 'SMART HOME COVER PRODUCT DISCLOSURE SHEET',
                queryParams: '/smart-home-cover/assets/allianz/forms/SHC_PDS_0223.pdf'
            },
            {
                label: 'SMART HOME COVER PRODUCT POLICY WORDING',
                queryParams: '/smart-home-cover/assets/allianz/forms/shcpolicy.pdf'
            },
            {
                label: 'SMART HOME COVER PRODUCT BROCHURE',
                queryParams: '/smart-home-cover/assets/allianz/forms/SHC_Brochure_0223.pdf'
            },
        ]

    },
    {
        partner: 'SCSTAFF',
        document: [
            {
                label: 'SMART HOME COVER PRODUCT DISCLOSURE SHEET',
                queryParams: '/smart-home-cover/assets/allianz/forms/shcpdsscstaff.pdf'
            }
        ]
    },
    {
        partner: 'SCOL',
        document: [
            {
                label: 'SMART HOME COVER PRODUCT DISCLOSURE SHEET',
                queryParams: '/smart-home-cover/assets/allianz/forms/SmartHomeCover_ProductDisclosureSheet_ENG_AZ2302.pdf'
            }
        ]
    },
]

export const PARTNER_COVERAGE_TYPE_AN = ['HSBCBN', 'SCOL']