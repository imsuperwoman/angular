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
  EventEmitter,
  ChangeDetectorRef,
  SimpleChanges,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormService } from '@services/form.service';

@Component({
  selector: 'dynamic-table',
  templateUrl: './dynamic-table.component.html',
  styleUrls: ['./dynamic-table.component.scss'],
})
export class DynamicTableComponent implements OnInit, AfterViewInit {

  @Input('accordionData') accordionData: any;
  @Input('control') control!: any;
  @Input('premiumCost') premiumCost: number = 0;

  @Output('accordionError') emitAccordionError: any = new EventEmitter();
  @Output('coverageApplied') coveragedApplied: any = new EventEmitter();

  highlightIcon: boolean[] = [];
  addCoverageCost: number = 0;
  modifiedPlan: any = [];
  newFormValue: boolean = false;
  pastControl!: any;
  pastAccordionData!: any;
  displayPremiumCost!: any;

  /* Dynamic Table */
  @ViewChild('dynamicTable') dynamicTable!: ElementRef<any>;
  tableWidth!: number;
  parentWidth!: number;

  /* Scrollbar */
  @ViewChild('scrollbarInner') scrollbarInner!: ElementRef<any>;
  scrollbarWidth!: number;
  scrollWidthRatio!: number;

  @HostListener('mousemove')
  @HostListener('touchmove')
  updateScrollBarPos() {
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

  @HostListener('window:resize')
  resizeScrollBar() {
    this.initializeScrollBar();
    this.updateScrollBarPos();
  }

  constructor(private renderer: Renderer2, public formService: FormService, public changeDetectionRef: ChangeDetectorRef,) {
  }

  ngOnInit(): void {
    this.pastControl = this.control?.value;
    this.pastAccordionData = JSON.parse(JSON.stringify(this.accordionData));
    this.displayPremiumCost = this.premiumCost;

    this.changeDetectionRef.detectChanges();

    this.control.valueChanges.subscribe((value: FormGroup) => {
      this.checkFormValueChange();
    });
    // handle user switch plan
    this.initCalculateAdditionalCoverage();
    this.checkBoxDisable();
  }

  checkBoxDisable() {
    this.accordionData.additionalCover.forEach((dataBoxDisable: any) => {
      if (dataBoxDisable.mandatoryIndicator) {
        this.control.get(dataBoxDisable.coverCode).disable();
      }
    });
  }

  checkBoxEnable() {
    this.accordionData.additionalCover.forEach((dataBoxEnable: any) => {
      if (dataBoxEnable.mandatoryIndicator) {
        this.control.get(dataBoxEnable.coverCode).enable();
        this.control.get(dataBoxEnable.coverCode).setValue(true);
      }
    })
    this.pastControl = this.control?.value;
  }

  ngAfterViewInit(): void {
    this.initializeScrollBar();
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
    this.newFormValue = false;
    this.emitAccordionError.emit(this.newFormValue);
    this.coveragedApplied.emit(this.pastAccordionData);
  }

  checkFormValueChange(): void {
    const newControl = this.control.value;
    this.newFormValue = Object.keys(newControl).some((key, i) => {
      return !!this.pastControl[key] !== !!this.control.get(key)?.value;
    });

    this.emitAccordionError.emit(this.newFormValue);
  }

  async updateSelectedCheckbox(coverCode: any) {
    if (coverCode != "OBH039B") {
      var lastChar = coverCode.slice(coverCode.length - 1);
      var lastFiveChars = coverCode.substr(0, coverCode.length - 1);
      var oppCoverage: string = '';
      if (lastChar == 'A') {
        oppCoverage = lastFiveChars + 'B'
      }
      if (lastChar == 'B') {
        oppCoverage = lastFiveChars + 'A'
      }

      if (oppCoverage != '') {
        this.pastAccordionData.additionalCover.forEach((coverage: any) => {
          if (coverage.coverCode == oppCoverage) {
            coverage.selectedIndicator = false;
            this.control.get(coverage.coverCode).setValue(false);
          }
        });
      }

      const findDataIndex = await this.pastAccordionData.additionalCover.findIndex((item: any) => item.coverCode == coverCode);
      this.pastAccordionData.additionalCover[findDataIndex].selectedIndicator = await !this.pastAccordionData.additionalCover[findDataIndex].selectedIndicator;
      this.calculateAdditionalCoverage(this.accordionData.basicPremium);
    }
  }

  calculateAdditionalCoverage(basicPremium: number): void {
    this.addCoverageCost = 0;

    this.pastAccordionData.additionalCover.forEach((coverage: any) => {
      if (coverage.selectedIndicator) {
        this.accordionData.additionalCover.forEach((dataCoverage: any) => {
          if (dataCoverage.coverCode === coverage.coverCode) {
            this.addCoverageCost += dataCoverage.displayPremium;
          }
        })
      }
    });
    const newVal = basicPremium + this.addCoverageCost;

    if (newVal == this.premiumCost) {
      this.newFormValue = false; //nothing happens
      this.emitAccordionError.emit(this.newFormValue);
      this.premiumCost = newVal;
    }
    else {
      this.newFormValue = true; //update val
      this.emitAccordionError.emit(this.newFormValue);
      this.premiumCost = newVal;
    }
  }

  initCalculateAdditionalCoverage(): void {
    this.addCoverageCost = 0;

    Object.keys(this.pastControl).forEach((key, i) => {
      this.pastAccordionData.additionalCover.forEach((coverage: any) => {
        if (key == coverage.coverCode && this.pastControl[key]) {
          this.accordionData.additionalCover.forEach((data: any) => {
            if (data.coverCode === coverage.coverCode) {
              this.addCoverageCost += data.displayPremium;
            }
          })
        }
      });
    });
    this.premiumCost = this.accordionData.basicPremium + this.addCoverageCost;
    this.changeDetectionRef.detectChanges();
  }

  ngOnChanges(changes: SimpleChanges) {
    this.checkBoxEnable();
    if (changes['premiumCost']?.previousValue) {
      this.initCalculateAdditionalCoverage();
    }

    if (changes['accordionData']?.previousValue) {
      this.initCalculateAdditionalCoverage();
      this.checkBoxDisable();
    }
  }
}
