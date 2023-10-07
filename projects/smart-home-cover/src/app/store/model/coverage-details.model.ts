
export type COVERAGE_ITEM = {
    accordions: ACCORDIONS_ITEM[]
    summary: SUMMARY_ITEM

}

export class ACCORDIONS_ITEM {
    coverCode: string;
    title: string;
    formGroupName: string;
    parentFormGroupName: string;
    formLevel: string;
    formControlName: string;
    coverNarration: string;
    selected: boolean;
    displayPremium: number;
    checkbox: {};
    comparisonTable: COMPARISON_ITEM;
    additionalCoverage: ADDITIONAL_ITEM[];
    constructor(obj?: any) {
        this.coverCode = (obj && obj.coverCode);
        this.title = (obj && obj.title);
        this.formGroupName = (obj && obj.formGroupName);
        this.parentFormGroupName = (obj && obj.parentFormGroupName);
        this.formLevel = (obj && obj.formLevel);
        this.formControlName = (obj && obj.formControlName);
        this.coverNarration = (obj && obj.coverNarration);
        this.selected = (obj && obj.selected);
        this.checkbox = (obj && obj.checkbox);
        this.displayPremium = (obj && obj.displayPremium);
        this.comparisonTable = (obj && obj.comparisonTable);
        this.additionalCoverage = (obj && obj.additionalCoverage);
    }
}

export type ADDITIONAL_ITEM = {
    formControlName: string,
    selected: boolean,
    label: string,
    popoverMessage: string,
    premium: number
    coverCode: string
}

export type SUMMARY_ITEM = {
    upper: LB_VALUE_ITEM[],
    amount: LB_VALUE_ITEM[],
    premiumPayable: number
}

export type COMPARISON_ITEM = {
    headerFooter: COP_HEADER_ITEM,
    tableRows: COP_TABLE_ITEM[],
}

export type COP_TABLE_ITEM = {
    headline: string,
    popoverMessage: string,
    coverage: string,
    details: string[]
}

export type COP_HEADER_ITEM = {
    selectedPlan: number,
    plans: COP_PLAN[]
}

export type COP_PLAN = {
    planCode: string,
    planName: string,
    planPremium: string
}

export type LB_VALUE_ITEM = {
    label: string,
    value: string
}

export type CHECKBOX_ITEM = {
    label: string,
    formControlName: string,
    value: boolean
}

export let HO_FG_LIST = new Map()
    .set("03", "coverBuildingDamage")
    .set("04", "coverHouseholdContent")
    .set("11", "coverLoanTroubles")
    .set("12", "coverRepairsMaintenance")
    .set("13", "coverFromTroublesomeTenants")
    .set("14","coverBuildingDamage")
    .set("15","coverHouseholdContent")
    .set("16","coverLoanTroubles")
    .set("17","coverRepairsMaintenance")
    .set("18","coverFromTroublesomeTenants");

export let FG_LIST = new Map()
    .set("03", "houseOwner")
    .set("04", "houseHolder")
    .set("11", "mortgageLoanInstallmentProtection")
    .set("12", "homeFix")
    .set("13", "landlordInsurance")
    .set("14","houseOwner")
    .set("15","houseHolder")
    .set("16","mortgageLoanInstallmentProtection")
    .set("17","homeFix")
    .set("18","landlordInsurance");