import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';

export default new UntypedFormGroup({
  promoDialogForm: new UntypedFormGroup({
    policyLevel: new UntypedFormControl(false),
    riskLevel: new UntypedFormControl(false),
  }),
  agreedPolicyForm: new UntypedFormGroup({
    renew: new UntypedFormControl(false),
    policyAgreed: new UntypedFormControl(false, Validators.requiredTrue),
    recaptcha: new UntypedFormControl('', Validators.required)
  })

});
