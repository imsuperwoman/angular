import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';

export default new UntypedFormGroup({
  coverageAmount: new UntypedFormControl(),
  additionalCoverages: new UntypedFormGroup({
  })
});

