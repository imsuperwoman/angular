export const DEFAULTS = {
  userInput: {
    step1: {},
    step2: {
      mainData: {},
      epolicyInquiry: {},
      alimPolicyInquiry: {}
    },
    step3: {
      propertyDetails: {
        startDate: null,
        endDate: null,
        buildingStorey: '',
        yearOfConstruction: 0,
        yearOfConsUnsure: false,
        ageOfBuilding: '',
        address1: '',
        address2: '',
        address3: '',
        area: '',
        postCode: '',
        city: '',
        state: '',
        cityCode: '',
        stateCode: ''
      },
      customerDetails: {
        fullName: '',
        idType: '',
        idNo: '',
        dob: '',
        gender: '',
        nationality: '',
        phoneCountryCode: '',
        phoneNo: '',
        email: '',
        postCode: '',
        city: '',
        state: '',
        cityCode: '',
        stateCode: '',
        staffId: '',
        cardNo: '',
        cardNoSecond: '',
        cardNoThird: '',
        address1: '',
        address2: '',
        address3: '',
        addressnumber: '',
        country: '',
        viewport: '',
        plusCode: '',
        placeId: ''
      },
      jointNames: [],
      mortgage: []
    }
  },
  renewal: false,
  renewalResponse: [],
  coverageDetails: ''
}

export interface UserInputStateModel {
  userInput: {
    step1: any,
    step2: any,
    step3: {
      propertyDetails: {
        startDate: any;
        endDate: any;
      },
      customerDetails: {
        fullName: string;
        idType: string;
        idNo: string;
        dob: string;
        gender: string;
        nationality: string;
        phoneCountryCode: string;
        phoneNo: string;
        email: string;
        postCode: string,
        cityCode: string,
        stateCode: string,
        city: string,
        state: string,
        staffId: string,
        cardNo: string,
        cardNoSecond: string,
        cardNoThird: string,
        address1: string,
        address2: string,
        address3: string,
        addressnumber: string,
        country: string;
        viewport: any,
        plusCode: string,
        placeId: string
      }
      jointNames: any,
      mortgage: any
    }
  },
  renewal: boolean,
  renewalResponse: any,
  coverageDetails: any
}

export type RENEWAL_CHILD = {
  label: string;
  value: string;
}

export type RENEWAL_ITEM = {
  check: boolean,
  paid: boolean,
  overview: RENEWAL_CHILD[]
  propertyDetails: [
    {
      periodOfInsurance: string,
      startDate: string,
      endDate: string,
    }
  ],
  policyHolderDetails: [
    {
      fullName: string,
      idType: string,
      idNo: string,
    }
  ],
}