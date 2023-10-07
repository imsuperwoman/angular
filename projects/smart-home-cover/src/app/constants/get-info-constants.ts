import { FormGroup, FormControl, FormArray, Validators, ValidationErrors, ValidatorFn, AbstractControl } from '@angular/forms';
import geoLocationValidator from '@functions/validator-geo-location.function';

export const KNOW: any[] = [
  {
    value: 'know',
    label: 'know',
  },
  {
    value: 'donotknow',
    label: 'do not know',
  }
];

export const LEASE_TYPES: any[] = [
  {
    value: 'LD',
    label: 'landed',
  },
  {
    value: 'NL',
    label: 'non-landed',
  },
];

export const BUILT_USING_BRICK: any[] = [
  {
    value: true,
    label: 'is',
  },
  {
    value: false,
    label: 'is not',
  },
];

export const DO_STATE_TYPES: any[] = [
  {
    value: true,
    label: 'do',
  },
  {
    value: false,
    label: 'do not',
  },
];

// Insured Calculator
export const INSURED_QUESTIONS_ERROR: any = {
  1: "Please proceed next.",
  2: "Please proceed next.",
  3: "Please click 'CALCULATE'."
}
export const INSURED_QUESTIONS_CHOICES: any = {
  1: "What kind of home are you staying in?",
  2: "What is the quality of your home in a bare condition?",
  3: "Please provide us with the following information about your home.",
  buildingType: [
    {
      image: 'terrace.png',
      radio: {
        value: '01',
        label: 'Terrace / Townhouse',
      },
    },
    {
      image: 'semidetached-clusterhouse.png',
      radio: {
        value: '02',
        label: 'Semi-Detached / Cluster House',
      },
    },
    {
      image: 'detachedhouse-bungalow.png',
      radio: {
        value: '03',
        label: 'Detached House / Bungalow',
      },
    },
  ],
  finishedCost: [
    {
      image: 'low-cost.png',
      imageLabel: ['Cement floor', 'PVC door', 'Normal switch'],
      info: 'Cement render floor; skim coating ceiling; plywood or PVC door, louvered windows; common brand of sanitary fittings and ironmongery; normal switches or sockets.',
      radio: {
        value: 'L',
        label: 'Low Cost',
      },
      popover:
        'Cement render floor; skim coating ceiling; plywood or PVC door, louvered windows; common brand of sanitary fittings and ironmongery; normal switches or sockets.',
    },
    {
      image: 'medium-cost.png',
      imageLabel: ['Ceramic floor', 'Wooden door', 'Branded switch'],
      info: 'Ceramic/porcelain/parquet/laminated floor; skim coating ceiling; casement window; plywood and some hardwood decor; common brand or sanitary fittings and iron mongery; common brand of switches or sockets.',
      radio: {
        value: 'M',
        label: 'Medium Cost',
      },
      popover:
        'Ceramic/porcelain/parquet/laminated floor; skim coating ceiling; casement window; plywood and some hardwood decor; common brand or sanitary fittings and iron mongery; common brand of switches or sockets.',
    },
    {
      image: 'high-cost.png',
      imageLabel: ['Marble floor', 'Solid wooden door', 'Branded switch with LED'],
      info: 'Marble/granite/natural wood floor; plaster ceiling with LED lights; heavy duty casement window or door (soundproof); solid wooden door; luxury or imported brand of sanitary fittings and ironmongery; branded switches and sockets (touch sensor or some with LED lights).',
      radio: {
        value: 'H',
        label: 'High Cost',
      },
      popover:
        'Marble/granite/natural wood floor; plaster ceiling with LED lights; heavy duty casement window or door (soundproof); solid wooden door; luxury or imported brand of sanitary fittings and ironmongery; branded switches and sockets (touch sensor or some with LED lights).',
    },
  ],
  questionThree: [
    {
      value: 'SQFT',
      label: 'Square feet',
    },
    {
      value: 'SQMT',
      label: 'Square meter',
    },
  ],
};

export const MEASUREMENT_SQFT = 'Area (sq ft)';
export const MEASUREMENT_METER = 'Area (sq m)';

export const FORMGROUP = new FormGroup({
  quoteForm: new FormGroup({
    CustomerType: new FormControl(''),
    BuiltUsingBrick: new FormControl(''),
    sufferedDamage: new FormControl(''),
    PropertyType: new FormControl('', Validators.required),
    CoverageType: new FormControl('', Validators.required),
    BuildingStorey: new FormControl('', Validators.required),
    ageOfBuilding: new FormControl(''),
    yearOfConstruction: new FormControl(''),
    yearOfConsUnsure: new FormControl('', Validators.required),
    ExistingLoan: new FormControl('', Validators.required),
    HasTenant: new FormControl('', Validators.required),
    SumInsured: new FormControl(''),
    address: new FormGroup({
      address1: new FormControl('', Validators.required),
      address2: new FormControl(''),
      address3: new FormControl(''),
      addressnumber: new FormControl(''),
      addressType: new FormControl('R'),
      postCode: new FormControl('', Validators.required),
      city: new FormControl('', Validators.required),
      state: new FormControl('', Validators.required),
      cityCode: new FormControl('', Validators.required),
      stateCode: new FormControl('', Validators.required),
      searchControl: new FormControl(''),
      viewport: new FormControl(''),
      plusCode: new FormControl(''),
      placeId: new FormControl('')
    }, {
      validators: [geoLocationValidator.match('addressnumber', 'address1')]
    }),
  }),
  insuredDialogForm: new FormGroup({
    agreedValue: new FormControl('', Validators.required),
    buildingType: new FormControl('', Validators.required),
    finishedCost: new FormControl('', Validators.required),
    houseInfo: new FormGroup({
      improvedFinishes: new FormControl(''),
      area: new FormControl('', Validators.required),
      unitOfMeasure: new FormControl('SQFT', Validators.required),
    }),
  }),
  policyForm: new FormGroup({
    cardsFormArray: new FormArray([]),
  }),
  coverageForm: new FormGroup({
    houseHolder: new FormGroup({
      coverHouseholdContent: new FormControl(true),
    }),
    homeFix: new FormGroup({ coverRepairsMaintenance: new FormControl(true) }),
  }),
  policyDetailsForm: new FormGroup({
    propertyDetails: new FormGroup({
      startDate: new FormControl(''),
      endDate: new FormControl(''),
    }),
    customerDetails: new FormGroup({
      fullName: new FormControl(''),
      dob: new FormControl(''),
      idType: new FormControl('NRIC'),
      idNo: new FormControl(''),
      gender: new FormControl('M'),
      nationality: new FormControl('MAL'),
      phoneCountryCode: new FormControl('+6010'),
      phoneNo: new FormControl(''),
      email: new FormControl(''),
      correspondenceCheckbox: new FormControl(false),
      correspondenceDetails: new FormGroup({
        address1: new FormControl('', Validators.required),
        address2: new FormControl(''),
        address3: new FormControl(''),
        addressnumber: new FormControl(''),
        addressType: new FormControl('C'),
        postCode: new FormControl(''),
        city: new FormControl(''),
        state: new FormControl(''),
        country: new FormControl('MAL'),
        searchControl: new FormControl(''),
        viewport: new FormControl(''),
        plusCode: new FormControl(''),
        placeId: new FormControl('')
      }, {
        validators: [geoLocationValidator.match('addressnumber', 'address1')]
      }),
    }),
    financialInterest: new FormGroup({
      financialInterestName: new FormControl(''),
      financialType: new FormControl('M'),
      loanReferenceNo: new FormControl(''),
      banksEmail: new FormControl(''),
      consentBankDetailsCheckBox: new FormControl(false)
    }),
    combinesNamesArray: new FormArray([
      new FormGroup({
        fullName: new FormControl(''),
        idType: new FormControl('NRIC'),
        idNo: new FormControl(''),
        role: new FormControl(''),
        nationality: new FormControl(''),
        eligible: new FormControl(false),
      }),
    ]),
    hsbcCardChecking: new FormGroup({
      hsbcCardHolder: new FormControl(''),
      hsbcCardHolderNumber: new FormControl(''),
    }),
  }),
  policySummaryPaymentForm: new FormGroup({
    policyAgreed: new FormControl(false, Validators.requiredTrue),
    recaptcha: new FormControl('', Validators.required)
  }),
});
