import { ValidationErrors } from '@angular/forms';

export function AddressValidator(control: any): ValidationErrors | null {
  const buildingname = control.get('buildingname');
  const streetname = control.get('streetname');
  const area = control.get('area');
  if (!buildingname || !streetname || !area) {
    return null;
  }
  control.get('buildingname').setErrors(null)
  control.get('streetname').setErrors(null)
  control.get('area').setErrors(null)

  if (buildingname.value === '' && streetname.value === '' && area.value === '') {
    control.get('buildingname').setErrors({ oneOfControlRequired: true })
    control.get('streetname').setErrors({ oneOfControlRequired: true })
    control.get('area').setErrors({ oneOfControlRequired: true })
    return { oneOfControlRequired: true, message: 'Please enter building name or street name or area. ' };
  }

  return null;
}