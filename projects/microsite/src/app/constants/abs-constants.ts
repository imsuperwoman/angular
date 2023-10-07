import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { MENU_ITEM } from "@constants/header-constants";
import { emailRequiredValidator } from "@functions/validator.function";
import * as moment from "moment";

export const AZOL = 'AZOL';
export const HEADER = 'Allianz Business Shield';
export const SUBHEADER = 'A comprehensive business solution that gives you the flexibility to customise your business insurance coverage and sum assured.';
export const PRODUCT_CAT = 'abse';
export const LOGO = 'allianz-abs.svg';

export const DOCUMENT_DATA: MENU_ITEM[] = [
    {
        label: 'Brochure',
        queryParams: 'assets/allianz/forms/abs_Brochure.pdf'
    },
    {
        label: 'Product Disclosure Sheet',
        queryParams: 'assets/allianz/forms/abs_PDS.pdf'
    },
];

export const COVERAGE_DETAILS: any = [
    { label: 'Effective Date' },
    { label: 'Expiry Date' }
];


export const POLICYHOLDER_DETAILS: any = [
    { label: 'Business name / Name as per ID' },
    { label: 'ID type' },
    { label: 'ID no.' },
    { label: 'Mobile no.' },
    { label: 'Email address' },
    { label: 'Location of business' },
    { label: 'Business operation' }
];

export const FORMGROUP = new FormGroup({
    coverageDetails: new FormBuilder().group({
        effectivedate: new FormControl(moment().add(1, 'day'), Validators.required),
        expirydate: new FormControl(moment().add(1, 'year'), Validators.required),
    }),
    policyholderDetails: new FormBuilder().group({
        businessname: new FormControl('', Validators.required),
        idType: new FormControl('', Validators.required),
        idNo: new FormControl('', Validators.required),
        mobilePrefixname: new FormControl('+6010', Validators.required),
        phonenumber: new FormControl('', Validators.required),
        email: new FormControl('', [Validators.required, emailRequiredValidator]),
        addressnumber: new FormControl('', Validators.required),
        buildingname: new FormControl(''),
        streetname: new FormControl(''),
        area: new FormControl(''),
        postcode: new FormControl('', Validators.required),
        state: new FormControl('', Validators.required),
        city: new FormControl('', Validators.required),
        businessoperation: new FormControl('', Validators.required)
    })
});

export const AGREED_POLICY_FORM = new FormGroup({
    policyAgreed: new FormControl(false, Validators.requiredTrue),
    recaptcha: new FormControl('')
})