import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  Input,
  OnInit,
  Output,
  Renderer2,
  ViewChild,
  EventEmitter
} from '@angular/core';
import { UntypedFormGroup, ValidationErrors } from '@angular/forms';
import { GeneralSelectors } from 'module/store/general.selectors';
import { Select } from '@ngxs/store';
import { throwError } from 'rxjs';
import { FORM_NAME } from '../../constants/get-info.constants';

@Component({
  selector: 'dynamic-table',
  templateUrl: './dynamic-table.component.html',
  styleUrls: ['./dynamic-table.component.scss'],
})
export class DynamicTableComponent implements OnInit, AfterViewInit {
  @Input('premiumSummaryData') premiumSummaryData!: any;
  @Input('accordionData') accordionData!: any;
  @Input('control') control!: any;
  @Input('premiumCost') premiumCost: number = 0;
  @Input('showPricing') showPricing: boolean = true;
  @Input('displayNumber') displayNumber: number = 6;
  @Output('accordionError') emitAccordionError: any = new EventEmitter();
  @Output('coverageApplied') coveragedApplied: any = new EventEmitter();
  imageFolder: string = 'assets/images/ui'
  @ViewChild('commonErrorDialog') commonErrorDialog: any;
  commonErrorDialogHeader = '';
  commonErrorDescription = '';

  highlightIcon: boolean[] = [];
  addCoverageCost: number = 0;

  newFormValue: boolean = false;
  pastControl!: any;

  showAdditionalCoveagesAmounts: number = 6;
  showMore = false;

  /* Dynamic Table */
  @ViewChild('dynamicTable') dynamicTable!: ElementRef<any>;
  tableWidth!: number;
  parentWidth!: number;

  /* Scrollbar */
  @ViewChild('scrollbarInner') scrollbarInner!: ElementRef<any>;
  scrollbarWidth!: number;
  scrollbarPosition!: number;
  scrollWidthRatio!: number;

  @HostListener('mousemove')
  @HostListener('touchmove')
  updateScrollBarPos() {
    if (this.showPricing) {
      let childPos = this.dynamicTable.nativeElement.getBoundingClientRect();
      let parentPos = this.renderer
        .parentNode(this.dynamicTable.nativeElement)
        .getBoundingClientRect();

      let scrollPos = parentPos.left - childPos.left;

      this.renderer.setStyle(
        this.scrollbarInner.nativeElement,
        'left',
        `${scrollPos * this.scrollWidthRatio}px`
      );
    }
  }

  @HostListener('window:resize')
  resizeScrollBar() {
    if (this.showPricing) {
      this.initializeScrollBar();
      this.updateScrollBarPos();
    }
  }

  /*---- From Store ----*/
  @Select(GeneralSelectors.selectLov('CUSTIDTYPE')) custIDType$: any;

  constructor(private renderer: Renderer2) { }

  ngOnInit(): void {
    this.showAdditionalCoveagesAmounts = this.displayNumber;

    this.pastControl = this.control?.value;

    this.control.valueChanges.subscribe((value: UntypedFormGroup) => {
      this.checkFormValueChange();
      this.enableDropdownFormControl();
    });

    if (this.accordionData) {
      this.accordionData.forEach((data: any) => {
        if (data.dropdowns) {
          data.dropdowns.forEach((dropdown: any) => {
            this.control.get(dropdown.formControlName).disable();
          });
        }
        if (data.sumInsuredControlName) {
          this.control.get(data.sumInsuredControlName).disable();
        }
      });
    }
  }

  ngAfterViewInit(): void {
    if (this.showPricing) {
      this.initializeScrollBar();
    }
  }

  initializeScrollBar(): void {
    this.tableWidth = this.dynamicTable.nativeElement.offsetWidth;
    this.parentWidth = this.renderer.parentNode(this.dynamicTable.nativeElement).offsetWidth;

    this.scrollWidthRatio = this.parentWidth / this.tableWidth;
    this.scrollbarWidth = this.scrollWidthRatio * 100;

    this.renderer.setStyle(this.scrollbarInner.nativeElement, 'width', `${this.scrollbarWidth}%`);
  }

  applyCoverage(): void {
    this.pastControl = this.control.value;

    this.getFormValidationErrors()
    if (!this.control.invalid) {
      this.newFormValue = false;
      this.emitAccordionError.emit(this.newFormValue);
      this.coveragedApplied.emit(this.accordionData);

      this.accordionData.premiumCost = this.premiumCost;
    }
  }

  getFormValidationErrors() {
    try {
      Object.keys(this.control.controls).forEach(key => {
        const controlErrors: ValidationErrors = this.control.get(key).errors;
        if (controlErrors != null) {
          Object.keys(controlErrors).forEach(keyError => {
            //console.log(' Key control: ' + key + ', keyError: ' + keyError + ', err value: ', controlErrors[keyError]);
            throw key;
          });
        }

        if (key === FORM_NAME.gasConversionSumInsurred && this.control.get("gasConversion").value) {
          if (this.control.get(key).value == 0) {
            this.openDialog("");
          }
        }
      });
    }
    catch (e) {
      this.openDialog(e);
    }
  }

  openDialog(data: any): void {

    switch (data) {
      case 'gasConversionSumInsurred':
        this.commonErrorDescription = 'Please enter a value for the sum insured of Gas Conversion Kit and Tank add-on.';
        this.commonErrorDialog.open();
        break;
      case 'p2pCoverSelection':
        this.commonErrorDescription = 'Please select Peer-to-Peer Service Provider(s).';
        this.commonErrorDialog.open();
        break;
      default:
        this.commonErrorDescription = 'The sum insured for Gas Conversion Kit and Tank add-on must be more than 0.';
        this.commonErrorDialog.open();
        break;
    }
  }

  checkFormValueChange(): void {
    const newControl = this.control.value;

    this.newFormValue = Object.keys(newControl).some((key, i) => {
      return this.pastControl[key] !== this.control.get(key)?.value;
    });

    this.emitAccordionError.emit(this.newFormValue);
  }

  updateSelectedCheckbox(groupControl: string, formControl: string, event: any): void {
    if (this.accordionData.formGroupName === groupControl) {
      this.accordionData.additionalCoverage.forEach((additionalCoverage: any) => {
        if (additionalCoverage.formControlName === formControl) {
          additionalCoverage.selected = !additionalCoverage.selected;
        }
      });
    } else {
      this.accordionData.forEach((coverage: any) => {
        if (coverage.formControlName === formControl) {
          coverage.selected = !coverage.selected;
        }
      });
    }
    if (formControl === "p2pCover" && this.control.get(formControl).value) {
      this.control.get("p2pCoverSelection").setValue([]);
    }
  }

  enableDropdownFormControl() {
    if (this.accordionData) {
      this.accordionData.forEach((data: any) => {
        if (data.dropdowns && this.control.get(data.formControlName)?.value) {
          data.dropdowns.forEach((dropdown: any) => {
            this.control.get(dropdown.formControlName).enable({ emitEvent: false });
          });
        } else if (data.dropdowns && !this.control.get(data.formControlName)?.value) {
          data.dropdowns.forEach((dropdown: any) => {
            this.control.get(dropdown.formControlName).disable({ emitEvent: false });
          });
        }

        if (data.sumInsuredControlName && this.control.get(data.formControlName)?.value) {
          this.control.get(data.sumInsuredControlName).enable({ emitEvent: false });
        } else if (data.sumInsuredControlName && !this.control.get(data.formControlName)?.value) {
          this.control.get(data.sumInsuredControlName).disable({ emitEvent: false });
        }

        if (data.checkboxs && this.control.get(data.formControlName)?.value) {
          data.checkboxs.forEach((checkbox: any) => {
            this.control.get(checkbox.formControlName).enable({ emitEvent: false });
          });
        } else if (data.checkboxs && !this.control.get(data.formControlName)?.value) {
          data.checkboxs.forEach((checkbox: any) => {
            this.control.get(checkbox.formControlName).disable({ emitEvent: false });
          });
        }
      });
    }
  }
}
