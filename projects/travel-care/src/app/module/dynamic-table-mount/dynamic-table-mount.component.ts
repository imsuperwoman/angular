import {
  Component,
  Input,
  Output,
  OnInit,
  EventEmitter,
} from '@angular/core';
import { ChangeDetectionStrategy } from '@angular/core';


@Component({
  selector: 'dynamic-table-mount',
  templateUrl: './dynamic-table-mount.component.html',
  styleUrls: ['./dynamic-table-mount.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class DynamicTableMountComponent implements OnInit {
  @Input('benefits') benefits!: any;
  @Input('control') control!: any;
  @Input('selectAllCheckBox') selectAllCheckBox: any;

  @Output('accordionError') emitAccordionError: any = new EventEmitter();
  @Output('selectALLEmit') selectALLEmit: any = new EventEmitter();


  constructor() { }

  ngOnInit(): void {
  }

  getCheckbox(i: any) {
    return this.control.at(i).get("MountaineeringInd")?.value;
  }

  //individual check box selection
  updateSelectedCheckbox(i: any, event: any) {
    this.emitAccordionError.emit({
      value: event,
      index: i
    });
    if (event && (this.control.at(i).get("adultGroup").value == '' || this.control.at(i).get("adultGroup").value == null)) {
      this.control.at(i).get("adultGroup").setValue('', { emitEvent: false });
      this.control.at(i).get("adultGroup").markAsTouched();
    }
  }
  //table header check box selection
  updateMTCheckbox(event: any) {
    if (event) {
      for (let i = 0; i < this.benefits.length; i++) {
        // if( this.control.at(i).get("MountaineeringInd") ?.value){
        //   this.control.at(i) ?.get('premiumPerPerson').setValue(0.00);

        // }
        this.control.at(i).get("MountaineeringInd")?.setValue(true, { emitEvent: false });
        this.updateSelectedCheckbox(i, event);
      }
    }
    else {
      for (let i = 0; i < this.benefits.length; i++) {
        this.control.at(i).get("MountaineeringInd")?.setValue(false, { emitEvent: false });
        this.control.at(i).get('adultGroup')?.setValue("", { emitEvent: false });
        this.control.at(i)?.get('premiumPerPerson').setValue(0.00, { emitEvent: false });
        this.control.at(i).get('adultGroup')?.clearValidators({ emitEvent: false });
        this.control.at(i).get('adultGroup')?.updateValueAndValidity({ emitEvent: false });
      }
      this.selectALLEmit.emit();
    }
  }

  onIndividualCheckBoxChange() {
    var count = 0;
    this.control.controls.filter((value: any) => {
      if (value.controls.MountaineeringInd.value == true) {
        count = count + 1
      }
    })
    if (count == this.control.controls.length) {
      this.selectAllCheckBox.setValue('true', { emitEvent: false })
    }
    else {
      this.selectAllCheckBox.setValue('false', { emitEvent: false })
    }
  }

}
