import {
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
  ViewChild
} from '@angular/core';

import {
  Select
} from '@ngxs/store';
import { ChangeDetectionStrategy } from '@angular/core';
import { GeneralSelectors } from 'module/store/general.selectors';
import { UntypedFormArray, UntypedFormControl, UntypedFormGroup, ValidationErrors, Validators } from '@angular/forms';
import { nricValidator } from '@functions/validator-nric.function';


@Component({
  selector: 'nx-expansion-panel-nomi',
  templateUrl: './nx-expansion-panel-nomi.component.html',
  styleUrls: ['./nx-expansion-panel-nomi.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class NxExpansionPanelNomiComponent implements OnInit {
  @Input('customerDetailsForm') customerDetailsForm!: any;
  @Input('control') control!: any;

  @Select(GeneralSelectors.selectLov('NEWCUSTIDTYPE')) custIDType$: any;
  @Select(GeneralSelectors.selectLov('NATIONALITY')) nationality$: any;
  @Select(GeneralSelectors.selectLov('RELATIONSHIP')) relationship$: any;

  nomineeArrayLength: any = 0;
  nomineeArrayForm: any;

  constructor(public changeDetectionRef: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.nomineeArrayForm = this.customerDetailsForm?.get('nomineeArrayForm') as UntypedFormArray;

    var count = 0;
    for (let allNominee of this.getAllNominee(this.customerDetailsForm)) {
      for (var c = 0; c < this.getNominee(allNominee).length; c++) {
        this.validateNomineeArray(count, c);
      }
      count++;
    }
  }

  getTravellerName(parent: number) {
    if (parent == 0) {
      this.nomineeArrayForm.at(parent).get('parentName').setValue(this.customerDetailsForm?.get('mainPolicyHolder').get('fullname').value)
      return this.customerDetailsForm?.get('mainPolicyHolder').get('fullname').value;
    } else {
      parent--;
      var fullname = this.customerDetailsForm?.get('travellerArrayForm').at(parent).get('fullname').value
      this.nomineeArrayForm.at(++parent).get('parentName').setValue(fullname)
      return fullname
    }
  }

  getAllNominee(form: any) {
    return form.controls.nomineeArrayForm.controls;
  }

  getNominee(form: any) {
    return form.controls.nomineeArrayName.controls;
  }

  idTypeNomineeArrayChange(event: any, parent: number, child: number) {
    if (event.value === 'NRIC') {
      this.nomineeArrayForm.at(parent).get('nomineeArrayName').at(child).get('nationality')?.setValue('MAL');
      this.nomineeArrayForm.at(parent).get('nomineeArrayName').at(child).get('nationality')?.disable();
    } else {
      this.nomineeArrayForm.at(parent).get('nomineeArrayName').at(child).get('nationality')?.enable();
    }
  }

  percentageNomineeArrayChange(event: any, parent: number) {

    if (event.target.value > 100) {
    }
    this.checkPercentage(parent);
    this.nomineeArrayForm.at(parent).updateValueAndValidity();
  }

  checkPercentage(parent: number) {
    var nomineeArrayName = this.nomineeArrayForm.at(parent).get('nomineeArrayName') as UntypedFormArray;
    var nomineeArray = this.nomineeArrayForm.at(parent).get('nomineeArrayName').value;
    let total = 0;
    for (let i = 0; i <= nomineeArrayName.length - 1; i++) {
      if (nomineeArrayName.controls[i].get('percentage')?.value) {
        total = total + parseInt(nomineeArrayName.controls[i].get('percentage')?.value);
      }
      this.nomineeArrayForm.at(parent)?.get('totalPercentage')?.setValue(total ? total : 0);
    }
  }

  addNomineeArray(child: number) {
    var nomineeArrayName = this.nomineeArrayForm.at(child).get('nomineeArrayName');
    nomineeArrayName.push(
      new UntypedFormGroup({
        fullname: new UntypedFormControl(''),
        idType: new UntypedFormControl(''),
        idNo: new UntypedFormControl(''),
        relationship: new UntypedFormControl(''),
        nationality: new UntypedFormControl(''),
        percentage: new UntypedFormControl(0),
      })
    );

    nomineeArrayName.at(nomineeArrayName.length - 1).get('idType')?.disable();
    nomineeArrayName.at(nomineeArrayName.length - 1).get('idNo')?.disable();
    nomineeArrayName.at(nomineeArrayName.length - 1).get('relationship')?.disable();
    nomineeArrayName.at(nomineeArrayName.length - 1).get('nationality')?.disable();
    nomineeArrayName.at(nomineeArrayName.length - 1).get('percentage')?.disable();

    this.changeDetectionRef.detectChanges();
  }

  // to clear feilds
  removeNomineeArray(parent: number, child: number) {
    const combineArray = this.nomineeArrayForm.at(parent).get('nomineeArrayName') as UntypedFormArray;
    this.clearNomineeArray(parent, child)
    combineArray.removeAt(child);
    this.checkPercentage(parent);
    this.changeDetectionRef.detectChanges();
  }

  validateNomineeArray(parent: number, child: number) {
    var nomineeArray = this.nomineeArrayForm.at(parent).get('nomineeArrayName').at(child) as UntypedFormControl;
    var nomineeArrayName = this.nomineeArrayForm.at(parent).get('nomineeArrayName');

    if (nomineeArray.get('fullname')?.value !== '') {
      nomineeArray.get('idType')?.enable();
      nomineeArray.get('idNo')?.enable();
      nomineeArray.get('nationality')?.enable();
      nomineeArray.get('relationship')?.enable();
      nomineeArray.get('percentage')?.enable();
      nomineeArray.get('idType')?.setValue('NRIC');
      nomineeArray.get('idNo')?.setValidators(nricValidator.bind(nomineeArray, 0, 80));
      nomineeArray.get('nationality')?.setValue('MAL');
      nomineeArray.get('relationship')?.setValidators([Validators.required]);
      nomineeArrayName.setValidators([percentageValidator.bind(this)]);
      nomineeArray.get('percentage')?.setValidators([Validators.required]);
    } else {
      this.customerDetailsForm?.get('nomineeArrayForm').at(parent).get('percentage')?.clearValidators();
      nomineeArray.get('idType')?.setValue('');
      nomineeArray.get('idNo')?.setValue('');
      nomineeArray.get('relationship')?.setValue('');
      nomineeArray.get('nationality')?.setValue('');
      nomineeArray.get('percentage')?.setValue(0);
      nomineeArray.get('idType')?.disable();
      nomineeArray.get('idNo')?.disable();
      nomineeArray.get('nationality')?.disable();
      nomineeArray.get('relationship')?.disable();
      nomineeArray.get('percentage')?.disable();

      this.checkPercentage(parent);
    }
    this.changeDetectionRef.detectChanges();
  }

  clearNomineeArray(parent: number, child: number) {
    var nomineeArrayName = this.nomineeArrayForm.at(parent).get('nomineeArrayName') as UntypedFormArray;
    var nomineeArray = this.nomineeArrayForm.at(parent).get('nomineeArrayName').at(child) as UntypedFormControl;
    var nomineeArrayNamecntls = this.nomineeArrayForm.at(parent).get('nomineeArrayName')
    var nomineeArrayCntl = this.nomineeArrayForm.at(parent).get('nomineeArrayName').at(child)
    nomineeArray.reset();
    nomineeArray.patchValue({
      fullname: ""
    });
    this.validateNomineeArray(parent, child);
    nomineeArray.get('percentage')?.setErrors(null);
    nomineeArray.get('percentage')?.updateValueAndValidity();


    for (let i = 0; i < nomineeArrayNamecntls.length; i++) {
      if (child == i) {
        nomineeArrayCntl?.controls?.percentage?.setErrors(null);
        nomineeArrayNamecntls?.controls[child]?.get('percetage')?.setErrors(null);
      }
    }
    if (!nomineeArrayName.invalid) {
      nomineeArrayName.clearValidators();
      nomineeArrayName.updateValueAndValidity();
    }
    this.checkPercentage(parent);
    this.changeDetectionRef.detectChanges();
  }
}

export function percentageValidator(control: any): ValidationErrors | null {
  var nomineeArrayValue = control.value;
  var nomineeArrayResult = nomineeArrayValue.filter((x: any) => x.percentage);

  let total: number = nomineeArrayResult.reduce(
    (a: number, b: any) => a + parseInt(b.percentage), 0);

  if (total == 0) {
    let diasabledCount = 0;
    control.controls.forEach((element: any) => {
      if (element.controls.percentage.disabled) {
        diasabledCount = diasabledCount + 1;
      }
    });
    if (control.controls.length == diasabledCount) {
      return null;
    }
  }

  if (total < 100 || total > 100) {
    control.controls.forEach((element: any) => {
      element.controls.percentage.setErrors({ invalidNumber: true })
      element.controls.percentage.markAllAsTouched();
    });
    return { invalid: true };
  }

  control.controls.forEach((element: any) => {
    element.controls.percentage.setErrors(null);
    element.controls.percentage.markAllAsTouched();
  });
  return null;
}