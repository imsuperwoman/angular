import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';

export default new UntypedFormGroup({
    vehicleType: new UntypedFormControl('', Validators.required),
    plateNumber: new UntypedFormControl('', Validators.required),
    idType: new UntypedFormControl('', Validators.required),
    idNo: new UntypedFormControl('', Validators.required),
    postcode: new UntypedFormControl('', Validators.required),
    acknowledgement: new UntypedFormControl(false, Validators.requiredTrue),
    gender: new UntypedFormControl(''),
    dob: new UntypedFormControl('')
});

export const MODAL_MESSAGE = {
    serverTimeoutDialogHeader: 'Oops! ......',
    serverTimeoutDialogDescription: 'Oops! There appears to be a connectivity issue. Please close this message and try refreshing the tab. Thank you!',

    motorcycleDialogDescription:
        'We have identified that your vehicle is a motorcycle. This function is currently only for private cars.',
    UBBE001DialogDescription:
        'Oops! Your previous policy expired on ##expiredDate## and therefore we are unable to process your request online.' +
        ' Please leave your details and our representative will contact you to assist you further.',
    UBBE001DirectDialogDescription:
        'Oops! Your previous policy expired on ##expiredDate## and therefore we are unable to process your request online.' +
        ' Please contact an Allianz representative for assistance.',

    incorrectIdDialogDescription:
        'Oops! The ID ##idNo## no. does not match the vehicle no. provided. Please refer to your previous policy or vehicle registration card for the ID no. and retry.',

    UBBE002DialogDescription:
        'Oops! Your motor policy will expire on ##expiredDate##. Please come back again on ##renewDay## to renew your motor policy.',

    renewedDialogDescription: 'Oops! ! We are unable to obtain your vehicle No Claim Discount or your motor insurance has already been renewed.' +
        ' Please check with your agent / insurer to assist you further.',
    claimingDialogDescription:
        'Oops! Your current policy has a claim and we are unable to process your request online. ' +
        'Please leave your details and our representative will contact you to assist you further.',
    claimingAgentErrorDescription: 'Oops! Your current policy has a claim and we are unable to process your request online.' +
        ' Please contact an Allianz representative for assistance.',

    commonErrorDescription: 'Oops! We are sorry that we are unable to process your request due to our online risk acceptance controls.' +
        ' Please leave your details and our representative will contact you to assist you further.',
    commonDirectErrorDescription: 'Oops! We are sorry that we are unable to process your request due to our online risk acceptance controls. ' +
        ' Please contact an Allianz representative for assistance.',


    staffErrorDescription: 'Sorry, we are unable to find the IC No./Passport No. provided in Staff/Staff '
        + 'Immediate Family listing. You may either '
        + ` <br><br> 1. Contact HR to update the information of you or your immediate family`
        + ` <br><br> 2. Or email to <a href="mailto:allianzstaffrebate@allianz.com.my" class="agent-dialog__link">allianzstaffrebate@allianz.com.my</a> to assist on the Motor Policy.`
};

export const FORM_NAME = {
    windScreensSumInsurred: "windScreensSumInsurred",
    compensationDays: "compensationDays",
    compensationAmountPerDays: "compensationAmountPerDays",
    gasConversionSumInsurred: "gasConversionSumInsurred",
    ErwCarReplacementDays: "ErwCarReplacementDays",
    accidentBenefitAmount: "accidentBenefitAmount",
    p2pCoverSelection: "p2pCoverSelection",
    additionalDriverAmount: "additionalDriverAmount"
}
