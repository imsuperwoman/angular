export const DEFAULTS = {
  userInput: {
    step1: {},
    step2: {},
    step3: {
      coverageDetails: {
      },
      policyholderDetails: {
      }
    }
  },
}

export interface UserInputStateModel {
  userInput: {
    step1: {},
    step2: any,
    step3: {
      coverageDetails: {
      },
      policyholderDetails: any
    }
  },
}