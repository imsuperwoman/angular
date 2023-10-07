export const DEFAULTS = {
  userInput: {
    selected: '',
    step1: {
      idNo: '',
      idType: '',
      plateNumber: '',
      postcode: '',
      gender: '',
      dob: ''
    },
    step2: {
    },
    step3: {
    },
    step4: {

    }

  },
}

export interface UserInputStateModel {
  userInput: {
    selected: any,
    step1: {
      idNo: any,
      idType: any,
      plateNumber: any,
      postcode: any,
      gender: any,
      dob: any
    },
    step2: {
      Gender?: string;
      Dob?: string;
      MaritalStatus?: string;
    },
    step3: {
    },
    step4: {

    }

  }
}