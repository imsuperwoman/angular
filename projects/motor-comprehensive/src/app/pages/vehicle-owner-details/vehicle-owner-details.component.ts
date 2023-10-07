import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { UntypedFormGroup, Validators } from '@angular/forms';
import { FormService } from '@services/form.service';

import { NxDialogService, NxModalRef } from '@aposin/ng-aquila/modal';
import { Router } from '@angular/router';
import quoteForm, { MODAL_MESSAGE } from '../../constants/get-info.constants';
import coveageForm from '../../constants/quotation-form.contants';
import vehicleOwnerDetailsForm, { CONFIRMATION, GENDER } from '../../constants/vehicle-owner-details';
import { SpinnerOverlayService } from 'module/spinner-overlay/spinner-overlay.service';
import { HEADER, LOGO, SUBHEADER } from '../../constants/motor-online-constants';
import policyholderForm from '../../constants/policyholder-details.constants';
import { QuoteProgessState } from 'projects/motor-comprehensive/src/app/store/states';
import { MO_QUOTE, MODEL_LIST, PIAM, MO_CHECKUBB, GET_SUMINSURED_LIST, MO_QUOTE_PROGRESS } from 'projects/motor-comprehensive/src/app/store/actions/quote-progress.action';
import { MO_RESET_STEP_2, MO_SET_STEP_2 } from 'projects/motor-comprehensive/src/app/store/actions/user-input.action';
import { catchError, firstValueFrom, Subject, takeUntil } from 'rxjs';
import { CONDITIONS_DROPDOWN } from '../../constants/vehicle-owner-details';
import { GeneralSelectors } from 'module/store/general.selectors';
import * as moment from 'moment';
import { QuotationService } from '../../services/quotation.service';
import { Select, Store, ActionCompletion, ofActionSuccessful, Actions, ofActionCompleted } from '@ngxs/store';
import { showChatBot } from '@functions/chatBot.function';
import { NavigationService } from '@services/navigation.service';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-vehicle-owner-details',
  templateUrl: './vehicle-owner-details.component.html',
  styleUrls: ['./vehicle-owner-details.component.scss'],
})
export class VehicleOwnerDetailsComponent implements OnInit, OnDestroy {

  LOGO: string = LOGO;
  HEADER = HEADER;
  SUBHEADER = SUBHEADER;
  insurancePeriod: any;

  @ViewChild('stepper') stepper: any;
  @ViewChild('popoverInfoDialog') popoverInfoDialog: any;
  @ViewChild('commonErrorDialog') commonErrorDialog: any;
  @ViewChild('leaveMyDetailsDialog') leaveMyDetailsDialog: any;

  @ViewChild('serverTimeoutDialog') serverTimeoutDialog: any;
  @ViewChild('swipeBar') swipeBarEl: any;
  @ViewChild('comparisonTable', { read: ElementRef }) comparisonTableEl!: ElementRef;
  comparisonTableObserver!: ResizeObserver;

  commonErrorDialogHeader = '';
  commonErrorDescription = `Oops! We are sorry that we are unable to process your request due to our online risk acceptance controls. Please contact an Allianz representative for assistance.`;
  leaveMyDetailsDialogHeader = '';
  leaveMyDetailsDialogDescription = `Oops! We are sorry that we are unable to process your request due to our online risk acceptance controls. Please leave your details and our representative will contact you to assist you further.`;
  serverTimeoutDialogHeader = MODAL_MESSAGE.serverTimeoutDialogHeader;
  serverTimeoutDialogDescription = MODAL_MESSAGE.serverTimeoutDialogDescription;

  /*-- Form --*/
  motorComprehensiveForm: UntypedFormGroup = new UntypedFormGroup({});
  quoteForm!: UntypedFormGroup;
  vehicleOwnerDetailsForm!: UntypedFormGroup;
  vehicleDetails!: UntypedFormGroup;
  ownerDetails!: UntypedFormGroup;
  comDetails !: UntypedFormGroup;

  /*---- From Store ----*/
  @Select(QuoteProgessState.AVMakeList) AVMakeList$: any;
  @Select(QuoteProgessState.VehicleMakeInfo) VehicleMakeInfo$: any;
  @Select(QuoteProgessState.MakeList) MakeList$: any;
  @Select(GeneralSelectors.selectLov('MARITALSTATUS')) maritalStatus$: any;
  @Select(GeneralSelectors.flowType) flowType$: any;
  @Select(QuoteProgessState.selectedPackageCode) selectedPackageCode$: any;
  private ngUnsubscribe = new Subject<void>();
  // Dropdown
  models!: any[];
  years!: any[];
  variants!: any[];
  genders = GENDER;
  conditions = CONDITIONS_DROPDOWN;
  PIAM_brand!: any[];
  PIAM_VehicleMakeInfo!: any[];
  PIAM_MakeList!: any[];
  selectedPackageCode: any;

  maxDateDOB = moment().subtract(16, 'years').subtract(1, 'day');
  minDateDOB = moment().subtract(99, 'years').add(1, 'day');

  //Data
  confirmations: any = CONFIRMATION;

  /*--  Modal Dialog --*/
  activeDialogRef!: NxModalRef<any>;

  /*---- Params ----*/
  activePartner: any;
  flowSelectedType: any;
  vehicleDetails$: any;
  recaptchaEnabled$: any;
  recaptchaKey: any;
  step2$: any;

  constructor(
    private changeDetectionRef: ChangeDetectorRef,
    private formService: FormService,
    public dialogService: NxDialogService,
    private router: Router,
    private spinnerOverlayService: SpinnerOverlayService,
    private _store: Store,
    private quotationService: QuotationService,
    private action$: Actions,
    public navigation: NavigationService,
  ) {
    this.vehicleDetails$ = this._store.selectSnapshot((state) => state.QuoteProgessState.vehicleDetails);
    this.step2$ = this._store.selectSnapshot((state) => state.UserInputState.userInput.step2);

    if (window.location.hostname == 'localhost') {
      this.recaptchaEnabled$ = 'N'
      this.recaptchaKey = environment.recaptcha.siteKey;
    } else {
      this.recaptchaEnabled$ = this._store.selectSnapshot((state) => state.GeneralState.productConfig?.recaptchaEnabled) ? this._store.selectSnapshot((state) => state.GeneralState.productConfig?.recaptchaEnabled) : 'Y';
      this.recaptchaKey = environment.recaptcha.siteKey;
    }
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  ngOnInit(): void {
    var productConfig = this._store.selectSnapshot((state) => state.GeneralState.productConfig);
    showChatBot(productConfig?.chatbotInd);
    var userInput = this._store.selectSnapshot((state) => state.UserInputState.userInput);
    this.flowSelectedType = userInput.selected;

    /*---- Form ----*/
    this.motorComprehensiveForm.addControl('quoteForm', quoteForm);
    this.motorComprehensiveForm.addControl('coverageForm', coveageForm);
    this.motorComprehensiveForm.addControl('vehicleOwnerDetailsForm', vehicleOwnerDetailsForm);
    this.motorComprehensiveForm.addControl('policyholderForm', policyholderForm);

    this.motorComprehensiveForm.patchValue(this.formService.getForms());

    this.vehicleOwnerDetailsForm = this.motorComprehensiveForm?.get(
      'vehicleOwnerDetailsForm'
    ) as UntypedFormGroup;
    this.vehicleDetails = this.vehicleOwnerDetailsForm?.get('vehicleDetails') as UntypedFormGroup;
    this.ownerDetails = this.vehicleOwnerDetailsForm?.get('ownerDetails') as UntypedFormGroup;
    this.comDetails = this.vehicleOwnerDetailsForm?.get('vehicleDetails')?.get('comDetails') as UntypedFormGroup;

    var customViewObj = this._store.selectSnapshot((state) => state.GeneralState.customViewObj);

    if (customViewObj.utm_source != undefined) {
      this.activePartner = true;
    }

    // Update form service when there is changes in value
    this.motorComprehensiveForm.valueChanges.subscribe((values) => {
      this.formService.updateForms(this.motorComprehensiveForm);
    });

    var getHistory = this.navigation.getHistory();

    if (getHistory[getHistory.length - 2] !== '/quotation') {
      this.initializeFormWithStep1();
    } else {
      this.initializeFormWithStep2();
    }

    //Effetctive date and Expiry Data
    var polEffectiveDate = moment(this.vehicleDetails$?.polEffectiveDate).format('DD/MM/YYYY');
    var polExpiryDate = moment(this.vehicleDetails$?.polExpiryDate).format('DD/MM/YYYY');
    this.insurancePeriod = polEffectiveDate + ' to ' + polExpiryDate;

    if (this.recaptchaEnabled$ == 'N') {
      this.vehicleOwnerDetailsForm.get('recaptcha')?.clearValidators();
    } else {
      this.vehicleOwnerDetailsForm.get('recaptcha')?.setValidators(Validators.required);
    }
  }

  ngAfterViewInit(): void {
    this.stepper.steps.get(1).select();
    // Using element size observer
    this.comparisonTableObserver = new ResizeObserver((value: any) => {
      if (this.swipeBarEl) {
        this.swipeBarEl._onResize();
      }
    });
    this.changeDetectionRef.detectChanges();
  }

  get vehicleDetailsDataFilledIn() {
    if (
      this.vehicleDetails?.get('brand')?.value &&
      this.vehicleDetails?.get('model')?.value &&
      this.vehicleDetails?.get('year')?.value &&
      this.vehicleDetails?.get('carType')?.value
    ) {
      return false;
    } else {
      return true;
    }
  }

  initializeFormWithStep1() {
    //drop down
    var step1$ = this._store.selectSnapshot((state) => state.UserInputState.userInput.step1);
    this.models = this._store.selectSnapshot((state) => state.QuoteProgessState.modelList.ReferRiskList.ModelGrp);
    this.years = this.postModelList(this.vehicleDetails$.vehicleModel);
    this.variants = this.postModelList(this.vehicleDetails$.vehicleModel, this.vehicleDetails$.yearOfManufacture);
    this.PIAM_brand = this._store.selectSnapshot((state) => state.QuoteProgessState.PIAM_MakeList);
    this.PIAM_VehicleMakeInfo = this._store.selectSnapshot((state) => state.QuoteProgessState.PIAM_VehicleMakeInfo.Models);
    const vehicleVariant = this.vehicleDetails$.nvicList.map((val: any) => ({
      AvCode: val.nvic,
      Variant: val.vehicleVariant
    }));
    this.PIAM_MakeList = vehicleVariant;
    this.confirmations[0].dropdown = this.PIAM_brand;
    this.confirmations[1].dropdown = this.PIAM_VehicleMakeInfo;
    this.confirmations[3].dropdown = this.PIAM_MakeList;

    //vehicle Details
    if (this.vehicleDetails$.yearOfManufacture) {
      this.vehicleDetails?.get('year')?.setValue(this.vehicleDetails$.yearOfManufacture);
      if (this.years === undefined) {
        this.years = [{ MakeYear: this.vehicleDetails$.yearOfManufacture }]
      }
    }

    var label: any;
    this.AVMakeList$.subscribe((item: any) => {
      label = item.find((item: any) => item.Code === this.vehicleDetails$.avMakeCode);
    });

    this.vehicleDetails?.get('brand')?.setValue(label);
    this.vehicleDetails?.get('model')?.setValue(this.vehicleDetails$.vehicleModel);

    if (this.variants != undefined) {
      if (this.vehicleDetails$.nvicList[0].vehicleVariant) {
        const resultList = this.variants.find((item: any) => item.Variant == this.vehicleDetails$.nvicList[0].vehicleVariant);
        this.vehicleDetails?.get('carType')?.setValue(resultList);
      }
    }
    this.comDetails?.get('capacity')?.setValidators([Validators.max(14), Validators.min(1)]);
    this.comDetails?.get('capacity')?.setValue(this.vehicleDetails$.seatingCapacity);

    //com vehicle
    if (this.getComBrandByName(label.Description)) {
      this.comDetails?.get('comBrandDesc')?.setValue(label.Description);
      this.comDetails?.get('comBrand')?.setValue(this.getComBrandByName(label.Description));
      this.confirmations[0].value = label.Description;
    }
    this.comDetails?.get('comModel')?.setValue(this.getComModelByName(this.vehicleDetails$.vehicleModel));
    this.comDetails?.get('comModelDesc')?.setValue(this.vehicleDetails$.vehicleModel);
    this.comDetails?.get('comCarType')?.setValue(this.vehicleDetails$.nvicList[0].nvic);
    this.comDetails?.get('comCarTypeDesc')?.setValue(this.vehicleDetails$.nvicList[0].vehicleVariant);

    //owner Details
    this.ownerDetails?.get('gender')?.setValue(step1$?.gender);
    if (step1$?.dob == '') {
      this.ownerDetails?.get('dob')?.enable();
      this.ownerDetails?.get('age')?.setValue('');
    } else {
      this.ownerDetails?.get('dob')?.disable();
      this.ownerDetails?.get('dob')?.setValue(step1$?.dob);
    }

    this.confirmations[1].value = this.vehicleDetails?.get('model')?.value;
    this.confirmations[2].value = this.comDetails?.get('capacity')?.value;
    this.confirmations[3].value = this.vehicleDetails$.nvicList[0].vehicleVariant;

  }

  initializeFormWithStep2() {
    this.models = this._store.selectSnapshot((state) => state.QuoteProgessState.modelList.ReferRiskList.ModelGrp);
    this.years = this.postModelList(this.step2$.vehicleDetails.model);
    this.variants = this.postModelList(this.step2$.vehicleDetails.model, this.step2$.vehicleDetails.year);
    this.PIAM_brand = this._store.selectSnapshot((state) => state.QuoteProgessState.PIAM_MakeList);
    this.PIAM_VehicleMakeInfo = this._store.selectSnapshot((state) => state.QuoteProgessState.PIAM_VehicleMakeInfo.Models);
    const vehicleVariant = this.vehicleDetails$.nvicList.map((val: any) => ({
      AvCode: val.nvic,
      Variant: val.vehicleVariant
    }));
    this.PIAM_MakeList = vehicleVariant;
    this.confirmations[0].dropdown = this.PIAM_brand;
    this.confirmations[1].dropdown = this.PIAM_VehicleMakeInfo;
    this.confirmations[3].dropdown = this.PIAM_MakeList;

    //vehicle Details
    var label: any;
    this.AVMakeList$.subscribe((item: any) => {
      label = item.find((item: any) => item.Code === this.vehicleDetails$.avMakeCode);
    });
    this.vehicleDetails?.get('brand')?.setValue(label);
    this.vehicleDetails?.get('year')?.setValue(this.step2$.vehicleDetails.year);
    this.vehicleDetails?.get('model')?.setValue(this.step2$.vehicleDetails.model);

    this.vehicleDetails?.get('carType')?.setValue(this.step2$.vehicleDetails.carType);
    this.comDetails?.get('capacity')?.setValue(this.step2$.vehicleDetails.comDetails.capacity);

    //com vehicle
    this.comDetails?.get('comBrand')?.setValue(this.step2$.vehicleDetails.comDetails.comBrand);
    this.comDetails?.get('comBrandDesc')?.setValue(this.step2$.vehicleDetails.comDetails.comBrandDesc);
    this.comDetails?.get('comModel')?.setValue(this.step2$.vehicleDetails.comDetails.comModel);
    this.comDetails?.get('comModelDesc')?.setValue(this.step2$.vehicleDetails.comDetails.comModelDesc);
    this.comDetails?.get('comCarType')?.setValue(this.step2$.vehicleDetails.comDetails.comCarType);
    this.comDetails?.get('comCarTypeDesc')?.setValue(this.step2$.vehicleDetails.comDetails.comCarTypeDesc);
    this.confirmations[0].value = this.step2$.vehicleDetails.comDetails.comBrandDesc;
    this.confirmations[1].value = this.step2$.vehicleDetails.comDetails.comModelDesc;
    this.confirmations[2].value = this.comDetails?.get('capacity')?.value;
    this.confirmations[3].value = this.step2$.vehicleDetails.comDetails.comCarTypeDesc;
  }

  updateConfirmationsData() {
    this.confirmations[1].value = this.vehicleDetails?.get('model')?.value;
    this.confirmations[2].value = this.comDetails?.get('capacity')?.value;
    this.confirmations[3].value = this.vehicleDetails$.nvicList[0].vehicleVariant;
  }

  openInfoDialog(size?: string): void {
    if (size === 'mobile-full') {
      this.activeDialogRef = this.dialogService.open(this.popoverInfoDialog, {
        showCloseIcon: true,
        panelClass: ['mobile-modal-full-screen--', 'close-button'],
      });
    } else {
      this.activeDialogRef = this.dialogService.open(this.popoverInfoDialog, {
        showCloseIcon: true,
      });
    }
  }

  observe() {
    setTimeout(() => {
      this.comparisonTableObserver.observe(this.comparisonTableEl.nativeElement.children[0]);
    }, 0);
  }

  postModelList(vehicleModel: string, year?: string) {
    var result = this._store.selectSnapshot((state) => state.QuoteProgessState.modelList.ReferRiskList.ModelGrp);
    const resultList = result.find((item: any) => item.AvModelCode == vehicleModel);

    if (year == undefined) {
      return resultList?.MakeYearGrp;
    }

    if (resultList != undefined) {
      const variantsList = resultList.MakeYearGrp.find((item: any) => item.MakeYear == year)
      return variantsList?.VariantGrp
    }
    return [];
  }

  getSumInsured(carType: string) {
    const resultList = this.variants.find((item: any) => item.Variant == carType);
    this.vehicleDetails?.get('SumInsured')?.setValue(resultList.SumInsured);
    this.vehicleDetails?.get('VehicleEngineCC')?.setValue(resultList.VehicleEngineCC);
    this.vehicleDetails?.get('AvCode')?.setValue(resultList.AvCode);
  }

  getComBrandByName(brandName: string) {
    const resultList = this.PIAM_brand.find((item: any) => item.Description == brandName);
    return resultList?.Code;
  }

  getComBrandByCode(code: string) {
    const resultList = this.PIAM_brand.find((item: any) => item.Code == code);
    return resultList?.Description;
  }

  getComModelByName(name: string) {
    const resultList = this.PIAM_VehicleMakeInfo.find((item: any) => item.Description == name);
    return resultList?.Code;
  }

  getComModelByCode(code: string) {
    const resultList = this.PIAM_VehicleMakeInfo.find((item: any) => item.Code == code);
    return resultList?.Description;
  }

  proceedBack(): void {
    this._store.dispatch(new MO_RESET_STEP_2());
    this.vehicleOwnerDetailsForm.reset();
    this.motorComprehensiveForm.get('coveageForm')?.reset();
    this.motorComprehensiveForm.get('policyholderForm')?.reset();
    this.confirmations.find((item: any) => { item.editing = false; return })
  }

  getAgentLocator() {
    const dobDate = new Date(this.ownerDetails?.get('dob')?.value)
    const monthCount = moment().diff(dobDate, 'months');
    const yearCount = monthCount ? monthCount / 12 : '';
    this.ownerDetails?.get('dob')?.setValue(moment(dobDate).format('YYYY-MM-DD'));
    this.ownerDetails?.get('age')?.setValue(yearCount ? Math.floor(yearCount) : '');
    let formValue = this.vehicleOwnerDetailsForm.getRawValue();

    formValue = {
      ...formValue,
      insurancePeriod: this.insurancePeriod,
    }
    this._store.dispatch(new MO_SET_STEP_2(formValue));
    this._store.dispatch(new MO_QUOTE_PROGRESS('VEHICLEDETAILS', 2, ''));
    this.router.navigate(['/find-agent'], { queryParamsHandling: "preserve" });
  }

  async proceedNext(): Promise<void> {
    this.confirmations.find((item: any) => { item.editing = false; return })
    const dobDate = new Date(this.ownerDetails?.get('dob')?.value)
    const monthCount = moment().diff(dobDate, 'months');
    const yearCount = monthCount ? monthCount / 12 : '';

    this.ownerDetails?.get('dob')?.setValue(moment(dobDate).format('YYYY-MM-DD'));
    this.ownerDetails?.get('age')?.setValue(yearCount ? Math.floor(yearCount) : '');

    let formValue = this.vehicleOwnerDetailsForm.getRawValue();
    formValue = {
      ...formValue,
      insurancePeriod: this.insurancePeriod,
    }

    this.spinnerOverlayService.showLoadOverlay();
    this._store.dispatch(new MO_SET_STEP_2(formValue));

    this._store.dispatch(new MO_QUOTE()).pipe(
      catchError(err => {
        var sumInsuredValue = this._store.selectSnapshot((state) => state.UserInputState.userInput.step2?.vehicleDetails?.SumInsured);
        var minSumInsured = this._store.selectSnapshot((state) => state.GeneralState.productConfig?.minSumInsured);

        if (sumInsuredValue < minSumInsured) {
          this.handleSumInsuredError(err);
        } else {
          this.openServerTimeouts();
        }
        throw new Error(err);
      })
    ).subscribe(() => {
      this.selectedPackageCode = this._store.selectSnapshot((state) => state.QuoteProgessState.quote.selectedPackageCode)
      this._store.dispatch(new MO_CHECKUBB()).pipe(
        catchError(err => { this.openServerTimeouts(); throw new Error(err); })
      ).subscribe((_: any) => {
        if (_.QuoteProgessState.UBBStatus.ReferRiskList.length == 0) {
          this._store.dispatch(new MO_QUOTE_PROGRESS('VEHICLEDETAILS', 2, '')).pipe(
            catchError(err => { this.openServerTimeouts(); throw new Error(err); })
          ).subscribe((_: any) => {
            this._store.dispatch(new GET_SUMINSURED_LIST()).pipe(
              catchError(err => { this.openServerTimeouts(); throw new Error(err); })
            )
          })
        } else {
          this.spinnerOverlayService.hideLoadOverlay();
          this.openAgentDialog();
        }
      });
    });

    this.action$
      .pipe(ofActionCompleted(GET_SUMINSURED_LIST),
        takeUntil(this.ngUnsubscribe))
      .subscribe((data: ActionCompletion) => {
        if (data.result.error) {
          this.spinnerOverlayService.hideLoadOverlay();
          this.serverTimeoutDialog.open()
        }
      });

    var flowSelected = this._store.selectSnapshot((state) => state.UserInputState?.userInput?.selected);
    var mainFlowType = this._store.selectSnapshot((state) => state.GeneralState.flowType);

    setTimeout(() => {

      this.selectedPackageCode = this._store.selectSnapshot((state) => state.QuoteProgessState.quote.selectedPackageCode)
      if (this.selectedPackageCode || mainFlowType != 'DIRECT') {
        this.action$.pipe(ofActionSuccessful(GET_SUMINSURED_LIST))
          .subscribe(async () => {
            this.quotationService.getQuotation();
            this.formService.updateForms(this.motorComprehensiveForm);
            this.router.navigate(['/quotation'], { queryParamsHandling: "preserve" });
            this.spinnerOverlayService.hideLoadOverlay();
            this.selectedPackageCode = undefined;
          });

      } else if (!this.selectedPackageCode && flowSelected == 'direct' && mainFlowType == 'DIRECT') {
        this.leaveMyDetailsDialog.open();
        this.spinnerOverlayService.hideLoadOverlay();
      }
    }, 2000);
  }




  openServerTimeouts(): void {
    this.spinnerOverlayService.hideLoadOverlay();
    this.serverTimeoutDialog.open()
  }

  handleSumInsuredError(err: any) {
    this.spinnerOverlayService.hideLoadOverlay();
    this.leaveMyDetailsDialog.open()
  }


  openAgentDialog(): void {

    //flowType = 'DIRECT';'STAFFR'; 'REFERRAL'; 'BANK';'AGENT';
    this.flowType$?.subscribe((res: any) => {
      if (res == 'DIRECT') {
        this.commonErrorDialog.open();
      } else {
        this.leaveMyDetailsDialog.open();
      }
    });
  }

  brandChange(selectedValue: any) {
    const formValue = this.vehicleDetails.get('brand')?.value;

    firstValueFrom(this._store.dispatch(new MODEL_LIST(selectedValue.Code))).then((res: any) => {
      this.models = res.QuoteProgessState.modelList.ReferRiskList.ModelGrp;
    })

    if (selectedValue != formValue) {
      this.vehicleDetails?.get('model')?.setValue('');
      this.vehicleDetails?.get('year')?.setValue('');
      this.vehicleDetails?.get('carType')?.setValue('');
      this.vehicleDetails?.get('capacity')?.setValue('');
      this.vehicleDetails?.get('reconditionedCar')?.setValue('');
      this.vehicleDetails?.get('SumInsured')?.setValue('');
      this.vehicleDetails?.get('VehicleEngineCC')?.setValue('');
      this.vehicleDetails?.get('AvCode')?.setValue('');
      this.variants = [];
    }
  }

  modelChange(selectedValue: any) {
    const formValue = this.vehicleDetails.get('model')?.value;
    this.years = this.postModelList(selectedValue);

    if (selectedValue != formValue) {
      this.vehicleDetails?.get('year')?.setValue('');
      this.vehicleDetails?.get('carType')?.setValue('');
      this.vehicleDetails?.get('capacity')?.setValue('');
      this.vehicleDetails?.get('reconditionedCar')?.setValue('');
      this.vehicleDetails?.get('SumInsured')?.setValue('');
    }

    //vehicle Details
    if (this.vehicleDetails$.yearOfManufacture) {
      this.vehicleDetails?.get('year')?.setValue(this.vehicleDetails$.yearOfManufacture);
      if (this.years === undefined) {
        this.years = [{ MakeYear: this.vehicleDetails$.yearOfManufacture }]
      }
      this.variants = this.postModelList(selectedValue, this.vehicleDetails$.yearOfManufacture);
    }
  }

  yearChange(selectedValue: any) {
    this.vehicleDetails?.get('SumInsured')?.setValue('')
    this.variants = this.postModelList(this.vehicleDetails?.get('model')?.value, selectedValue)
  }

  variantChange(selectedValue: any) {
    this.getSumInsured(selectedValue);
  }

  confirmationChange(selectedValue: any, controlName: any) {
    if (selectedValue !== undefined) {
      if (controlName == 'comBrand') {
        this.confirmations[0].value = this.getComBrandByCode(selectedValue);
        this.comDetails?.get('comBrandDesc')?.setValue(this.confirmations[0].value);
        firstValueFrom(this._store.dispatch(new PIAM(selectedValue))).then((res: any) => {
          this.PIAM_VehicleMakeInfo = res.QuoteProgessState.PIAM_VehicleMakeInfo.Models;
          this.confirmations[1].dropdown = this.PIAM_VehicleMakeInfo;
        })

        if (selectedValue != this.confirmations[0].value) {
          this.comDetails?.get('comModel')?.setValue('');
          this.comDetails?.get('comModelDesc')?.setValue('');
          this.confirmations[1].value = '';
        }
      } else if (controlName == 'comModel') {
        this.confirmations[1].value = this.getComModelByCode(selectedValue);
        this.comDetails?.get('comModelDesc')?.setValue(this.confirmations[1].value);
      } else if (controlName == 'comCarType') {
        var result = this.PIAM_MakeList.find(data => data.AvCode == selectedValue)
        this.comDetails?.get('comCarType')?.setValue(selectedValue);
        this.confirmations[3].value = result.Variant;
        this.comDetails?.get('comCarTypeDesc')?.setValue(this.confirmations[3].value);
      } else if (controlName == 'capacity') {
        this.confirmations[2].value = selectedValue.target.value;
      }
    }

    if (selectedValue === undefined) {
      if (controlName == 'comBrand') {
        this.confirmations[0].value = "";
      } else if (controlName == 'comModel') {
        this.confirmations[1].value = "";
        this.comDetails?.get('comModelDesc')?.setValue(this.confirmations[1].value);
      } else if (controlName == 'comCarType') {
        this.confirmations[3].value = "";
        this.comDetails?.get('comCarTypeDesc')?.setValue(this.confirmations[3].value);
      }
    }
  }
}

