import {
  Component,
  Input,
  OnInit,
  Output,
  EventEmitter,
} from '@angular/core';
import { ChangeDetectionStrategy } from '@angular/core';
import { FormControl } from '@angular/forms';


@Component({
  selector: 'dynamic-table-sport',
  templateUrl: './dynamic-table-sport.component.html',
  styleUrls: ['./dynamic-table-sport.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class DynamicTableSportComponent implements OnInit {
  @Input('benefits') benefits!: any;
  @Input('control') control!: any;
  @Output('selectAllChange') checkBoxChnageEmit: any = new EventEmitter();
  @Input('selectAllCheckBox') selectAllCheckBox: any;

  constructor() { }

  ngOnInit(): void {
  }
  //select All check box
  updateSportsCheckbox(event: any) {
    if (event) {
      for (let i = 0; i < this.benefits.length; i++) {
        this.control.at(i).get("ExtSportsInd")?.setValue(true, { emitEvent: false });
      }
    }
    else {
      for (let i = 0; i < this.benefits.length; i++) {
        this.control.at(i).get("ExtSportsInd")?.setValue(false, { emitEvent: false });
      }
    }
    this.checkBoxChnageEmit.emit(event);
  }

  onIndividualCheckBoxChange() {
    var count = 0;
    this.control.controls.filter((value: any) => {
      if (value.controls.ExtSportsInd.value == true) {
        count = count + 1
      }
    })
    if (count == this.control.controls.length) {
      this.selectAllCheckBox.setValue('true')
    }
    else {
      this.selectAllCheckBox.setValue('false')
    }
  }
}
