
export type COVERAGE_ITEM = {
    additionalCoverages: COVERAGES_ITEM[]
}

export class COVERAGES_ITEM {
    personelDetails: any;
    popoverMessage: string;
    sumInsuredControlName: any;
    coverCode: string;
    label: string;
    formControlName: string;
    selected: boolean;
    premium: number;
    dropdowns: any;
    coverSumInsured!: number;
    checkboxs?: { formControlName: any; label: any; options: any }[];
    constructor(obj?: any) {
        this.dropdowns = (obj && obj.dropdowns);
        this.coverCode = (obj && obj.coverCode);
        this.label = (obj && obj.label);
        this.formControlName = (obj && obj.formControlName);
        this.popoverMessage = (obj && obj.popoverMessage);
        this.selected = (obj && obj.selected);
        this.premium = (obj && obj.premium);
        this.dropdowns = (obj && obj.dropdowns);
    }
}

export type DROPDOWMS_ITEM = {
    formControlName: string,
    selected: boolean,
    label: string,
    popoverMessage: string,
    premium: number
    coverCode: string
}

export type CHECKBOX_ITEM = {
    label: string,
    formControlName: string,
    value: boolean
}

export let FG_LIST = new Map()
    .set("PAB-ERW", "enhancedRoarWarrior")
    .set("89", "windscreens")
    .set("72", "legatLiabilityNegligentActs")
    .set("A209", "carBreak")
    .set("57", "specialPerils")
    .set("A202", "privateCar")
    .set("A206", "keyCare")
    .set("100(a)", "legalLiability")
    .set("A201", "waiverOfBettermentContribution")
    .set("112", "compensation")
    .set("25", "civil")
    .set("111", "NCDRelief")
    .set("112", "compensation")
    .set("100(a)", "legalLiability")
    .set("97A", "gasConversion")
    .set("PAB3", "PAB3")
    .set("A207", "p2pCover")

export const CHECKBOX_LIST = [
    {
        coverCode: "A207",
        formControlName: 'p2pCoverSelection',
        label: 'P2P Service Provider'
    }
]

export const DROPDOWN_LIST = [
    {
        coverCode: 'PAB-ERW',
        formControlName: "ErwCarReplacementDays",
        label: "No. of Car Replacement Days",
        LovType: 'MTERWPLANS'
    },
    {
        coverCode: '89',
        formControlName: 'windScreensSumInsurred',
        label: 'Sum Insurred',
        LovType: 'COVWINDSCROPT'
    },
    {
        coverCode: '112',
        formControlName: 'compensationDays',
        label: 'No. of Days',
        LovType: 'ASSESSREPAIRDAYS'
    },
    {
        coverCode: '112',
        formControlName: 'compensationAmountPerDays',
        label: 'Amount per Day',
        LovType: 'ASSESSREPAIRAMT'
    },
    {
        coverCode: 'PAB3',
        formControlName: 'accidentBenefitAmount',
        label: 'Death/Permanent Disablement Benefit (per person)',
        LovType: 'PAB3'
    }
]