import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';

export default new UntypedFormGroup({

});
export const sportsCoverage: any = new UntypedFormGroup({
  sportsCoverageCheck: new UntypedFormControl(false),
  sportsAmount: new UntypedFormControl(0),
});

export const mountaineeringCoverage: any = new UntypedFormGroup({
  mountaineeringCoverageCheck: new UntypedFormControl(false)
});

export const domesticCoverage: any = new UntypedFormGroup({
  domesticCoverageCheck: new UntypedFormControl(false),
  domesticAmount: new UntypedFormControl(),
});