import { MENU_ITEM } from "@constants/header-constants";

export const AZOL = 'AZOL';

export const CONFIG = {
    travelEasy: {
        PRODUCT_TYPE: 'ATE',
        URL: 'travel-care',
        HEADER: 'Allianz Travel Easy',
        SUBHEADER: 'Your best travel partner',
        PRODUCT_CAT: 'TC',
        CALL_BACK_URL: 'tc',
        LOGO: 'tc-logo.png',
        NOTE: `<ol><li class="nx-margin-bottom-3xs">Trip Cancellation benefit is payable ONLY if policy purchased 2 weeks before travel.</li>
        <li class="nx-margin-bottom-3xs">This policy does not cover flight crew, seagoing vessel crew and train crew unless travelling as a passenger.</li>
        <li class="nx-margin-bottom-3xs">This policy cover is available to Malaysian citizen, Malaysian permanent resident, valid work permit holder, valid student pass holder and the spouse and children who are legally residing in Malaysia.</li>
        <li class="nx-margin-bottom-3xs">For overseas travel, the coverage is ONLY for travel that departs from Malaysia.</li>
        <li class="nx-margin-bottom-3xs">For one way Journey/Trip, coverage under this Policy will cease twenty-four (24) hours from the scheduled time of arrival at the destination abroad.</li>
        <li class="nx-margin-bottom-3xs">For the full feature and benefits, please refer to the policy contract at allianz.com.my.</li>
        <li>This product is only purchasable online.</li></ol>`
    },
    travelCare: {
        PRODUCT_TYPE: 'ATC',
        URL: 'travel-care-plus',
        HEADER: 'Allianz Travel Care',
        SUBHEADER: 'Your best travel partner',
        PRODUCT_CAT: 'TC',
        CALL_BACK_URL: 'travel-care-plus',
        LOGO: 'tc-logo.png',
        NOTE: `<ol><li class="nx-margin-bottom-3xs">Trip Cancellation benefit is payable ONLY if policy purchased 2 weeks before travel.</li>
        <li class="nx-margin-bottom-3xs">This policy does not cover flight crew, seagoing vessel crew and train crew unless travelling as a passenger.</li>
        <li class="nx-margin-bottom-3xs">This policy cover is available to Malaysian citizen, Malaysian permanent resident, valid work permit holder, valid student pass holder and the spouse and children who are legally residing in Malaysia.</li>
        <li class="nx-margin-bottom-3xs">For overseas travel, the coverage is ONLY for travel that departs from Malaysia.</li>
        <li class="nx-margin-bottom-3xs">For one way Journey/Trip, coverage under this Policy will cease twenty-four (24) hours from the scheduled time of arrival at the destination abroad.</li>
        <li>For the full feature and benefits, please refer to the policy contract at allianz.com.my.</li>
        </ol>`
    }
}

export const ATE_DOCUMENT_MENU: MENU_ITEM[] = [
    {
        label: 'ALLIANZ TRAVEL EASY PRODUCT DISCLOSURE SHEET',
        queryParams: '/travel-care/assets/allianz/forms/PDS_Allianz_Travel_Easy.pdf'
    },
];

export const ATC_DOCUMENT_MENU: MENU_ITEM[] = [
    {
        label: 'ALLIANZ TRAVEL CARE PRODUCT DISCLOSURE SHEET',
        queryParams: '/travel-care-plus/assets/allianz/forms/PDS_Allianz_Travel_Care.pdf'
    },
];

export const PARTNER_DOCUMENT_MENU = [
    {
        partner: 'HSBCBN',
        document: [
            {
                label: 'ALLIANZ TRAVEL CARE PRODUCT DISCLOSURE SHEET',
                queryParams: '/travel-care-plus/assets/allianz/forms/PDS_Allianz_Travel_Care.pdf'
            },
            {
                label: 'ALLIANZ TRAVEL CARE BROCHURE',
                queryParams: '/travel-care-plus/assets/allianz/forms/Allianz Travel Care Brochure ENG_AZ0722.pdf'
            },
            {
                label: 'ALLIANZ TRAVEL CARE DOMESTIC POLICY WORDING',
                queryParams: '/travel-care-plus/assets/allianz/forms/Allianz Travel Care Domestic 062022.pdf'
            },
            {
                label: 'ALLIANZ TRAVEL CARE OVERSEAS POLICY WORDING',
                queryParams: '/travel-care-plus/assets/allianz/forms/Allianz Travel Care Overseas 062022.pdf'
            }


        ]

    }
]

export const BANNER = [
    {
        partner: 'HSBCBN',
        header: `Receive Touch 'n Go e-wallet reload pin worth up to RM50 when you purchase Allianz Travel Care`,
        subtext: `<div class="hsbcbn2-tc">From now until 31/05/2023.<br />* Terms and Condition apply.&nbsp;
        <a href="/travel-care/assets/allianz/forms/TnC-Travel_Care_Customer_Campaign_2023_Q2.pdf" target="_blank" rel="noopener"><u>Click Here</u></a><br /><br /></div>
        <div class="hsbcbn2-tc" style="text-align: center;">Now includes COVID-19 coverage for worry-free travel!</div>`,
    }
]