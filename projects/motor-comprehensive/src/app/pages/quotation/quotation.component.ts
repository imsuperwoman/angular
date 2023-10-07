import { Component, ElementRef, OnDestroy, OnInit, ViewChild, ViewChildren } from '@angular/core';
import { UntypedFormArray, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { ChangeDetectorRef } from '@angular/core';
import { QuotationService } from '../../services/quotation.service';
import { QuotationSummaryService } from '../../services/quotation-summary.service';
import { Router } from '@angular/router';

import { SpinnerOverlayService } from 'module/spinner-overlay/spinner-overlay.service';
import { HEADER, LOGO, SUBHEADER } from '../../constants/motor-online-constants';
import { MO_QUOTE_PROGRESS, MO_QUOTE } from 'projects/motor-comprehensive/src/app/store/actions/quote-progress.action';
import { Select, Store, ActionCompletion, ofActionSuccessful, Actions, ofActionCompleted } from '@ngxs/store';
import { UserInputState } from '../../store/states/user-input.state';
import { catchError, Observable, Subject, takeUntil } from 'rxjs';
import { MO_RESET_STEP_3, MO_SET_STEP_2, MO_SET_STEP_3 } from '../../store/actions/user-input.action';
import { NavigationService } from '@services/navigation.service';
import { QuoteProgessState } from '../../store/states/quote-progress.state';
import { GeneralService } from '../../services/general.service';
import { FormService } from '@services/form.service';
import { FORM_NAME, MODAL_MESSAGE } from '../../constants/get-info.constants';
import { showChatBot } from '@functions/chatBot.function';
import { GeneralSelectors } from 'module/store/general.selectors';
@Component({
  selector: 'app-quotation',
  templateUrl: './quotation.component.html',
  styleUrls: ['./quotation.component.scss'],
})
export class QuotationComponent implements OnInit, OnDestroy {
  LOGO: string = LOGO;
  HEADER = HEADER;
  SUBHEADER = SUBHEADER;

  @ViewChild('stepper') stepper: any;
  @ViewChildren('swipeBar') swipeBarEl: any;
  @ViewChild('comparisonTable', { read: ElementRef }) comparisonTableEl!: ElementRef;
  @ViewChild('serverTimeoutDialog') serverTimeoutDialog: any;
  serverTimeoutDialogHeader = MODAL_MESSAGE.serverTimeoutDialogHeader;
  serverTimeoutDialogDescription = MODAL_MESSAGE.serverTimeoutDialogDescription;

  /*---- From Store ----*/
  @Select(UserInputState.plateNumber) plateNumber$: any;
  @Select(QuoteProgessState.SumInsuredList) SumInsuredList$: any;
  @Select(GeneralSelectors.flowType) flowType$: any;
  @Select(QuoteProgessState.selectedPackageCode) selectedPackageCode$: any;
  private ngUnsubscribe = new Subject<void>();
  quote$: Observable<any>;
  userInput$: any;
  selectedPackageCode: any;
  sumInsuredValue: any;
  comparisonTableObserver!: ResizeObserver;
  isLoading: boolean = true;
  isSummariesLoading: boolean = true;
  isQuotationLoading: boolean = true;

  /*---- Form ----*/
  motorComprehensiveForm: UntypedFormGroup = new UntypedFormGroup({});
  quoteForm!: UntypedFormGroup;
  coverageForm!: UntypedFormGroup;

  /*---- Data ----*/
  flowSelectedType: any;
  comparisonTableData: any;
  additionalCoverages: any = [];
  accordionRefreshRequried = false;

  /*---- Quotation Summaries ----*/
  summaries: any = [];
  purchaseNote: any;
  additionalPartnerPurchaseNote: string = '';

  /*---- Params ----*/
  activePartner: any = false;

  constructor(
    private changeDetectionRef: ChangeDetectorRef,
    private formService: FormService,
    private quotationService: QuotationService,
    private quotationSummaryService: QuotationSummaryService,
    private router: Router,
    private spinnerOverlayService: SpinnerOverlayService,
    private _store: Store,
    public navigation: NavigationService,
    private generalService: GeneralService,
    private action$: Actions,
  ) {
    this.quote$ = this._store.select((state) => state.QuoteProgessState.quote);
    this.userInput$ = this._store.selectSnapshot((state) => state.UserInputState.userInput);
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  ngOnInit(): void {
    var productConfig = this._store.selectSnapshot((state) => state.GeneralState.productConfig);
    showChatBot(productConfig?.chatbotInd);

    var flowSelected = this._store.selectSnapshot((state) => state.UserInputState?.userInput?.selected);
    this.flowSelectedType = flowSelected
    this.selectedPackageCode = this._store.selectSnapshot((state) => state.QuoteProgessState.quote.selectedPackageCode)

    var step2 = this._store.selectSnapshot((state) => state.UserInputState.userInput.step2);
    var sumInsured = step2.vehicleDetails.SumInsured;
    this.sumInsuredValue = sumInsured;

    const formValues = this.formService.getForms();
    if (!formValues) return;

    Object.keys(formValues).forEach((formValue: any) => {
      if (formValue === 'coverageForm') {
        let formGroup = this.generalService.coverageFormControls(formValues[formValue]);
        this.motorComprehensiveForm.addControl(formValue, formGroup);
      } else {
        let formGroup = this.formService.generateControls(formValues[formValue]);
        this.motorComprehensiveForm.addControl(formValue, formGroup);
      }
    });

    this.motorComprehensiveForm.valueChanges.subscribe((value) => {
      this.formService.updateForms(this.motorComprehensiveForm);
    });
    /*---- Form ----*/
    this.coverageForm = this.motorComprehensiveForm.get('coverageForm') as UntypedFormGroup;

    var customViewObj = this._store.selectSnapshot(
      (state) => state.GeneralState.customViewObj
    )

    if (customViewObj.utm_source != undefined) {
      this.activePartner = true;
    }

    this.quotationService.getQuotations().then((data: any) => {
      this.additionalCoverages = data.quotation.additionalCoverages;

      this.isQuotationLoading = false;
      this.checkAdditionalCoveragesValue();
      this.isLoading = this.isAllLoaded;
      this.coverageForm.get('additionalCoverages')?.get("p2pCoverSelection")?.setValue(this.coverageForm.get('additionalCoverages')?.get("p2pCoverSelection")?.value);
    });

    this.coverageForm.get('additionalCoverages')?.get('roadRangers')?.disable();
    this.coverageForm.get('additionalCoverages')?.get('RP_0100')?.disable();

    this.getQuotationSummaryService();
    this.initializeForm();
  }

  ngAfterViewInit(): void {
    this.stepper.steps.get(1).completed = true;
    this.stepper.steps.get(2).select();
    this.comparisonTableObserver = new ResizeObserver((value: any) => {
      this.swipeBarEl.forEach((swipeBar: any) => {
        swipeBar._onResize();
      });
    });

    this.changeDetectionRef.detectChanges();
  }

  get isAllLoaded(): boolean {
    return !this.isQuotationLoading && !this.isSummariesLoading;
  }


  get additionalDriverDetailsFormArray() {
    return this.coverageForm
      .get('additionalCoverages')
      ?.get('additionalDriverDetails') as UntypedFormArray;
  }

  initializeForm(): void {
    this.coverageForm
      .get('coverageAmount')?.setValue(this.userInput$.step2.vehicleDetails.AvCode)
  }

  getQuotationSummaryService(): void {
    this.quotationSummaryService.getSummary().then((data: any) => {
      this.summaries = data;
      this.updateTotalPremiumPayable(this.additionalCoverages);
      this.isSummariesLoading = false;
      this.isLoading = !this.isAllLoaded;
      var excessAmount = this._store.selectSnapshot((state) =>state.quote?.premium?.excessAmount)
      var selectedPackageCode = this._store.selectSnapshot((state) => state.QuoteProgessState.quote.selectedPackageCode)
      var mainFlowType = this._store.selectSnapshot((state) => state.GeneralState.flowType);
      var flowSelected = this._store.selectSnapshot((state) => state.UserInputState?.userInput?.selected);
       this.summaries.purchaseNote = `*Excess of RM ${excessAmount?excessAmount:0} is applicable.`
      if (selectedPackageCode && flowSelected == 'direct' && mainFlowType == 'DIRECT') {
        // this.summaries.purchaseNote = `*Excess of RM ${excessAmount?excessAmount:0} is applicable.`
        this.summaries.additionalPartnerPurchaseNote = "";
      }
    });
  }

  additionalCoveragesState(): void {
    let additionalCoverages = JSON.parse(JSON.stringify(this.additionalCoverages));
    let coverages = this.coverageForm.getRawValue();
    let obj = coverages.additionalCoverages;
    let checkBoxGrp: string[] = [];
    let checkBoxGrpValue: any = [];

    Object.entries(obj).forEach(([key, value]) => {
      if (value === true) {
        checkBoxGrp.push(key);
      } else if (value !== '' && value !== false) {
        checkBoxGrp.push(key);
        checkBoxGrpValue.push({ key: key, value: value });
      }
    });

    let payload: any = {};
    let additionalCover: any = [];
    additionalCoverages.forEach((element: any) => {
      if (element.formControlName === 'roadRangers') return;
      if (element.formControlName === 'RP_0100') return;

      if (checkBoxGrp.includes(element.formControlName)) {
        switch (element.coverCode) {
          case "112":
            additionalCover.push({
              coverCode: element.coverCode,
              coverDescription: element.label,
              cartDay: checkBoxGrpValue.find((obj: any) => { return obj.key === FORM_NAME.compensationDays }).value,
              cartAmount: checkBoxGrpValue.find((obj: any) => { return obj.key === FORM_NAME.compensationAmountPerDays }).value
            });
            break;
          case "89":
            additionalCover.push({
              coverCode: element.coverCode,
              coverDescription: element.label,
              coverSumInsured: Number(checkBoxGrpValue.find((obj: any) => {
                return obj.key === FORM_NAME.windScreensSumInsurred;
              }).value)
            });
            break;
          case "97A":
            additionalCover.push({
              coverCode: element.coverCode,
              coverDescription: element.label,
              coverSumInsured:
                Number(checkBoxGrpValue.find((obj: any) => { return obj.key === FORM_NAME.gasConversionSumInsurred }).value),
            });
            break;
          case "PAB-ERW":
            additionalCover.push({
              coverCode: element.coverCode,
              coverDescription: element.label,
              planCode: checkBoxGrpValue.find((obj: any) => { return obj.key === FORM_NAME.ErwCarReplacementDays }).value,
            });
            break;
          case "PAB3":
            additionalCover.push({
              coverCode: element.coverCode,
              coverDescription: element.label,
              planCode: checkBoxGrpValue.find((obj: any) => {
                return obj.key === FORM_NAME.accidentBenefitAmount;
              }).value
            });
            break;
          case "A207":
            let checked = checkBoxGrpValue.find((obj: any) => { return obj.key === FORM_NAME.p2pCoverSelection }).value
            let options: any = []
            element.checkboxs[0].options.forEach((option: any) => {
              if (checked.includes(option.code)) {
                options.push({
                  code: option.code,
                  coverDescription: element.label,
                  actionCode: 'A',
                  sequence: option.sequence
                })
              }
            })
            additionalCover.push({
              coverCode: element.coverCode,
              coverDescription: element.label,
              coverSumInsured: element.coverSumInsured,
              coverOptions: options
            });
            break;
          case "DRIVER":
            let driver = checkBoxGrpValue.find((obj: any) => { return obj.key === FORM_NAME.additionalDriverAmount }).value
            if (driver === '1 additional drivers') {
              payload['driverDetails'] = [{ fullName: "Policy Holder Driver" }, { fullName: "Additional Driver 1" }]
              payload['unlimitedDriverInd'] = false;
            } else if (driver === '2 additional drivers') {
              payload["driverDetails"] = [{ fullName: "Policy Holder Driver" }, { fullName: "Additional Driver 1" },
              { fullName: "Additional Driver 2" }]
              payload['unlimitedDriverInd'] = false;
            } else {
              payload['driverDetails'] = []
              payload['unlimitedDriverInd'] = true;
            }
            break;
          default:
            additionalCover.push({
              coverCode: element.coverCode,
              coverDescription: element.label,
              coverSumInsured: element.coverSumInsured
            });
            break;
        }
      }
    });
    payload.additionalCover = additionalCover;

    this.spinnerOverlayService.showLoadOverlay();
    this._store.dispatch(new MO_SET_STEP_3(payload));

    // clear eHailingDriver if unselected
    if (!additionalCoverages.filter((item: any) => item.coverCode == 'A202')[0].selected) {
      this.motorComprehensiveForm.get('policyholderForm')?.get('ehailingDriver')?.reset()
    }
  }

  coverageAmountChange(selectedValue: any): void {
    this.spinnerOverlayService.showLoadOverlay();
    var SumInsuredList = this._store.select((state) => state.QuoteProgessState.SumInsuredList);
    SumInsuredList.subscribe((sum: any) => {
      let sumResult = sum.find((item: any) => item.AvCode === selectedValue);
      let step2 = JSON.parse(JSON.stringify(this.userInput$.step2));
      step2.vehicleDetails.SumInsured = sumResult.SumInsured;
      step2.vehicleDetails.AvCode = sumResult.AvCode;
      this._store.dispatch(new MO_SET_STEP_2(step2));
      this._store.dispatch(new MO_QUOTE()).subscribe(async () => {
        this.getQuotationSummaryService();
        this.spinnerOverlayService.hideLoadOverlay();
      });
    })
  }

  /*---- Functions ----*/
  updateCoverageForm(accordion?: any): void {
    this.formService.updateForms(this.motorComprehensiveForm);
    this.additionalCoveragesState();
    this._store.dispatch(new MO_QUOTE()).pipe(
      catchError(err => {
        this.spinnerOverlayService.hideLoadOverlay();
        this.serverTimeoutDialog.open();
        throw new Error(err);
      })
    ).subscribe(() => {
      this.getQuotationSummaryService();
      this.updateDisplayPremium();
      this.spinnerOverlayService.hideLoadOverlay();
    });
  }

  updateDisplayPremium() {
    var quote$ = this._store.selectSnapshot((state) => state.QuoteProgessState.quote);
    var step3 = this._store.selectSnapshot((state) => state.UserInputState.userInput.step3);

    if (step3.additionalCover.length > 0) {
      let newData = step3.additionalCover.map((element: any) =>
        Object.assign({}, element, {
          displayPremium: quote$.additionalCover.filter((item: any) => item.coverCode == element.coverCode)[0].displayPremium
        })
      )

      var payload = { additionalCover: newData }
      this._store.dispatch(new MO_SET_STEP_3(payload));
    }
  }

  updateTotalPremiumPayable(accordion?: any): void {
    //reset summmaries additional coverages section to avoid repeat adding items
    this.formService.updateForms(this.motorComprehensiveForm);

    this.checkAdditionalDriversValue();

    var quote$ = this._store.selectSnapshot((state) => state.QuoteProgessState.quote);
    accordion.forEach((data: any) => {
      if (data.formControlName != "roadRangers" && data.formControlName != "RP_0100") {

        if (data.selected) {
          if (data.label === 'Add Additional Driver') {
            this.summaries.costBreakdown[1].items.push({
              type: 'currency',
              label: quote$.unlimitedDriverInfo.description,
              value: quote$.unlimitedDriverInfo.amount
            });
          } else {
            var premium = quote$.additionalCover.find((obj: any) => { return obj.coverCode === data.coverCode }).displayPremium;
            this.summaries.costBreakdown[1].items.push({
              type: 'currency',
              label: data.label,
              value: premium,
            });
          }
        }
      }
    });
    this.quotationSummaryService.updateSummary(this.summaries);
  }

  updateAccordionError(value: boolean): void {
    if (value) {
      this.accordionRefreshRequried = true;
    } else {
      this.accordionRefreshRequried = false;
    }
  }

  checkAdditionalDriversValue() {
    let checkboxValue = this.coverageForm
      .get('additionalCoverages')
      ?.get('additionalDriver')?.value;
    let value = this.coverageForm.get('additionalCoverages')?.get('additionalDriverAmount')?.value;

    if (checkboxValue) {
      this.additionalDriverDetailsFormArray.enable({ emitEvent: false });
    } else {
      this.additionalDriverDetailsFormArray.disable({ emitEvent: false });
      this.coverageForm.get('additionalCoverages')?.get('additionalDriverDetails')?.reset()
      this.motorComprehensiveForm.get('policyholderForm')?.get('additionalDriver')?.reset()
    }

    switch (value) {
      case 1: {
        if (this.additionalDriverDetailsFormArray.value.length === 2) {
          this.additionalDriverDetailsFormArray.removeAt(1, { emitEvent: false });
          this.additionalCoverages[2].personelDetails.splice(1, 1);
        }
        break;
      }

      case 2: {
        if (this.additionalDriverDetailsFormArray.length !== 2) {
          for (let i = 0; i <= 2 - this.additionalDriverDetailsFormArray.length; i++) {
            this.additionalDriverDetailsFormArray.push(
              new UntypedFormGroup({
                idType: new UntypedFormControl('NRIC', Validators.required),
                idNo: new UntypedFormControl('', Validators.required),
              }),
              { emitEvent: false }
            );
            this.additionalCoverages[2].personelDetails.push({
              idTypeControlName: 'idType',
              idNoControlName: 'idNo',
            });
          }
        }
        break;
      }

      default: {
        for (let i = 0; i < this.additionalDriverDetailsFormArray.length; i++) {
          this.additionalDriverDetailsFormArray.removeAt(i);
        }
        this.additionalCoverages[2].personelDetails = [];
        break;
      }
    }
  }

  checkAdditionalCoveragesValue() {
    if (this.additionalCoverages) {
      this.additionalCoverages.forEach((additionalCoverage: any) => {
        if (
          this.coverageForm.get('additionalCoverages')?.get(additionalCoverage.formControlName)
            ?.value
        ) {
          additionalCoverage.selected = true;
        }
      });
    }
  }

  proceedNext(): void {
    this.spinnerOverlayService.showLoadOverlay();
    this._store.dispatch(new MO_QUOTE_PROGRESS("QUOTATION", 3, ''));

    this.action$
      .pipe(ofActionCompleted(MO_QUOTE_PROGRESS),
        takeUntil(this.ngUnsubscribe))
      .subscribe((data: ActionCompletion) => {
        if (data.result.error) {
          this.spinnerOverlayService.hideLoadOverlay();
          this.serverTimeoutDialog.open()
        }
      });

    this.action$.pipe(ofActionSuccessful(MO_QUOTE_PROGRESS))
      .subscribe(async () => {
        var flowSelected = this._store.selectSnapshot((state) => state.UserInputState?.userInput?.selected);
        var selectedPackageCode = this._store.selectSnapshot((state) => state.QuoteProgessState.quote.selectedPackageCode)
        if (this.activePartner || flowSelected == 'direct' && (selectedPackageCode)) {
          this.router.navigate(['/policyholder-details'], { queryParamsHandling: 'preserve' });
        }
        else {
          this.router.navigate(['/find-agent']);
        }
        this.spinnerOverlayService.hideLoadOverlay();
      });
  }

  proceedBack(): void {
    /*---- Form ----*/
    this.coverageForm.removeControl('additionalCoverages');
    this._store.dispatch(new MO_RESET_STEP_3());
  }
}
