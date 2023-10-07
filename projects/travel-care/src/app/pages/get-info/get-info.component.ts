import { Component, TemplateRef, OnInit, ViewChild, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { UntypedFormArray, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { showChatBot } from '@functions/chatBot.function';
import { NxDialogService, NxModalRef } from '@aposin/ng-aquila/modal';
import { GeneralSelectors } from 'module/store/general.selectors';
import {
  ActionCompletion,
  ofActionCompleted,
  Actions,
  Select,
  Store,
} from '@ngxs/store';
import { FormService } from '@services/form.service';
import quoteForm, {
  AN_TRDESTINATION_DROPDOWN, A_NONAN_TRGYPCODE_DROPDOWN,
  COVERAGETYPE_DROPDOWN, PAXNO_DROPDOWN, PAXNO_ONLYONE_DROPDOWN, SENIOR_COVERAGETYPE_DROPDOWN,
  TRDESTINATION_DROPDOWN, TRGYPCODE_DROPDOWN
} from '../../constants/get-info.constants';
import { Subject, filter, firstValueFrom, takeUntil } from 'rxjs';
import { SET_STEP_1 } from '../../store/actions/user-input.action';
import { GET_VALIDATE_VOUCHER, PLAN_RECOMMENDATION } from '../../store/actions/quote-progress.action';
import * as moment from 'moment';
import { SpinnerOverlayService } from 'module/spinner-overlay/spinner-overlay.service';
import { GeneralService } from '../../services/general.service';
import { BANNER } from '../../constants/travel-care-constants';
import { NavigationEnd, Router } from '@angular/router';
import coverageForm, { domesticCoverage, mountaineeringCoverage, sportsCoverage } from '../../constants/quotation-form.contants';
import { ServerTimeoutDialogComponent } from 'module/server-timeout-dialog/server-timeout-dialog.component';
import customerDetailsForm, { AgeRange, FMAgeRange, Type } from '../../constants/customer-details.constants';
import { QuoteProgessState } from '../../store/states/quote-progress.state';

@Component({
  selector: 'app-get-info',
  templateUrl: './get-info.component.html',
  styleUrls: ['./get-info.component.scss'],
})

export class GetInfoComponent implements OnInit, OnDestroy {
  LOGO: any;
  HEADER: any;
  SUBHEADER: any;
  PRODUCT_TYPE: any
  activePartner: any = false;
  imageFolder: string = 'assets/images/ui/';

  /*---- From Store ----*/
  @Select(GeneralSelectors.selectLov('TRAGERANGE')) tragerange$: any;
  @Select(GeneralSelectors.selectLov('TRGRPCODE')) trgrpcode$: any;
  @Select(GeneralSelectors.selectLov('PAXNO')) paxno$: any;
  @Select(QuoteProgessState.documentData) documentData$: any;
  @Select(GeneralSelectors.flowType) flowType$: any;
  @Select(GeneralSelectors.sourceSystem) sourceSystem$: any;
  activeDialogRef!: NxModalRef<any>;
  bannerData: any;

  private ngUnsubscribe = new Subject<void>();

  SENIOR_COVERAGETYPE_DROPDOWN = SENIOR_COVERAGETYPE_DROPDOWN;
  COVERAGETYPE_DROPDOWN = COVERAGETYPE_DROPDOWN;

  AN_TRDESTINATION_DROPDOWN = AN_TRDESTINATION_DROPDOWN;
  TRDESTINATION_DROPDOWN = TRDESTINATION_DROPDOWN;

  A_NONAN_TRGYPCODE_DROPDOWN = A_NONAN_TRGYPCODE_DROPDOWN;
  TRGYPCODE_DROPDOWN = TRGYPCODE_DROPDOWN;

  PAXNO_ONLYONE_DROPDOWN = PAXNO_ONLYONE_DROPDOWN;

  travelCareForm: UntypedFormGroup = new UntypedFormGroup({});
  quoteForm!: UntypedFormGroup;
  coverageForm!: UntypedFormGroup;

  minDate = moment().add(1, 'day');
  maxDate = moment().add(3, 'month').subtract(1, 'day');

  minEndDate = moment().add(1, 'day');
  maxEndDate = moment().add(3, 'month').subtract(1, 'day');

  numbers: any;
  CHILD_PAXNO_DROPDOWN = structuredClone(PAXNO_DROPDOWN);
  ADULT_PAXNO_DROPDOWN = structuredClone(PAXNO_DROPDOWN);;
  SENIOR_PAXNO_DROPDOWN = structuredClone(PAXNO_DROPDOWN);;


  /*--  Modal information --*/
  @ViewChild('template') templateRef!: TemplateRef<any>;
  @ViewChild('coverageDateDialog') coverageDateDialog!: TemplateRef<any>;

  constructor(
    public dialogService: NxDialogService,
    public action$: Actions,
    public _store: Store,
    private router: Router,
    public spinnerOverlayService: SpinnerOverlayService,
    public formService: FormService,
    public generalService: GeneralService,
    private changeDetectionRef: ChangeDetectorRef,) {
    this.LOGO = generalService.getConfig().LOGO;
    this.HEADER = generalService.getConfig().HEADER;
    this.SUBHEADER = generalService.getConfig().SUBHEADER;
    this.PRODUCT_TYPE = generalService.getConfig().PRODUCT_TYPE;

    this.router.events
      .pipe(filter((rs): rs is NavigationEnd => rs instanceof NavigationEnd))
      .subscribe(event => {
        if (
          event.id === 1 &&
          event.url === event.urlAfterRedirects
        ) {
          window.localStorage.clear();
        }
      })
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  ngOnInit() {
    this.travelCareForm.addControl('quoteForm', quoteForm);
    this.travelCareForm.patchValue(this.formService.getForms());

    this.quoteForm = this.travelCareForm?.get('quoteForm') as UntypedFormGroup;

    //  Update form service when there is changes in value
    this.travelCareForm.valueChanges.subscribe((values: any) => {
      this.formService.updateForms(this.travelCareForm);
    });


    var productConfig = this._store.selectSnapshot((state) => state.GeneralState.productConfig);
    showChatBot(productConfig?.chatbotInd);

    this.getActivePartner();
    this.coveragetypeChange();
    this.resetEndDate();
    this.startDate.valueChanges.subscribe((value: any) => {
      this.resetEndDate()
    });
  }

  get startDate() {
    return this.quoteForm.get('startDate') as UntypedFormControl;
  }

  getActivePartner() {
    var generalState = this._store.selectSnapshot((state) => state.GeneralState);
    var bannerData = generalState.dynamicContent?.Header?.contents?.custCollFields?.promo;

    if (generalState.customViewObj.utm_source != undefined) {
      this.activePartner = true;
    }

    var bannerList = BANNER;
    this.bannerData = bannerList.find((partner: any) => {
      return partner.partner === generalState.sourceSystem
    });
  }

  openDialog(dialog: any): void {
    this.dialogService.open(dialog, {
      showCloseIcon: true
    });
  }

  // Annual
  // Start date allowable range: T+1 up to 2 months ahead (T)

  // One way/two way
  // Start date allowable range: T+1 up to 1 year ahead (T)
  // End Date allowable range:
  // Asia/Worldwide: 200 days
  // Domestic: 30 days

  resetEndDate() {
    const domestic = Boolean(this.quoteForm.get('trdestination')?.value == 'DOM');
    const annual = Boolean(this.quoteForm.get('coveragetype')?.value == 'AN');
    const today = new Date();

    if (domestic) {
      this.minEndDate = moment(this.startDate.value).add(1, 'day');
      this.maxEndDate = moment(this.startDate.value).subtract(1, 'day').add(1, 'month');
    } else {
      this.minEndDate = moment(this.startDate.value).add(1, 'day');
      this.maxEndDate = moment(this.startDate.value).subtract(1, 'day').add(200, 'day');
    }


    if (annual) {
      this.maxDate = moment(today).add(1, 'day').add(2, 'month');
      this.quoteForm.get('endDate')?.setValue(moment(this.startDate.value).add(1, 'year').subtract(1, 'day'));
    } else {
      this.maxDate = moment(today).subtract(1, 'day').add(1, 'year');
    }
  }

  trdestinationChange() {
    this.quoteForm.get('endDate')?.setValue('');
    this.resetEndDate();
  }

  tragerangeChange() {
    const tragerange = Boolean(this.quoteForm.get('tragerange')?.value == 'S');
    const coveragetype = Boolean(this.quoteForm.get('coveragetype')?.value == 'AN');
    if (tragerange) {
      if (coveragetype) {
        this.quoteForm.get('coveragetype')?.setValue('');
      }
    }
  }

  trgrpcodeChange() {
    const tragerange = this.quoteForm.get('trgrpcode')?.value;

    if (this.quoteForm.get('NoOfChildren')) this.quoteForm.get('NoOfChildren')?.setValue('0');
    if (this.quoteForm.get('NoOfSeniors')) this.quoteForm.get('NoOfSeniors')?.setValue('0');
    if (this.quoteForm.get('NoOfAdults')) this.quoteForm.get('NoOfAdults')?.setValue('0');

    if (tragerange == "MT") {
      for (let i = 0; i < 11; i++) {
        this.CHILD_PAXNO_DROPDOWN[i].Disabled = false;
        this.ADULT_PAXNO_DROPDOWN[i].Disabled = false;
        this.SENIOR_PAXNO_DROPDOWN[i].Disabled = false;
      }
    }
    this.travelCareForm?.updateValueAndValidity();

  }

  coveragetypeChange() {
    const annual = Boolean(this.quoteForm.get('coveragetype')?.value == 'AN');
    if (annual) {
      this.quoteForm.get('endDate')?.setValue(moment(this.quoteForm.get('startDate')?.value).add(1, 'day'));
      this.quoteForm.get('endDate')?.clearValidators();
      (this.travelCareForm?.get('quoteForm') as UntypedFormGroup).removeControl(
        'endDate'
      );
    } else {
      this.quoteForm?.addControl('endDate', new UntypedFormControl());
      this.quoteForm.get('endDate')?.setValidators([Validators.required]);
    }
    this.travelCareForm?.updateValueAndValidity();
    this.changeDetectionRef.detectChanges();
  }

  updateNoOfChildren() {
    var noOfChildren = parseInt(this.quoteForm?.get('NoOfChildren')?.value);
    var noOfAdults = parseInt(this.quoteForm?.get('NoOfAdults')?.value);
    var noOfSeniors = parseInt(this.quoteForm?.get('NoOfSeniors')?.value);

    var trgrpcode = this.quoteForm.get('trgrpcode')?.value;
    if (trgrpcode == 'FM') {
      let remainingTravellers = 10 - noOfChildren;
      if (remainingTravellers == 0) {
        this.PAXNO_ONLYONE_DROPDOWN[1].Disabled = true;
      } else {
        this.PAXNO_ONLYONE_DROPDOWN[1].Disabled = false;
      }
    } else {
      let totalTravellers = noOfChildren + noOfAdults + noOfSeniors;
      let remainingTravellers = 10 - totalTravellers;


      for (let i = 0; i < 11; i++) {
        this.CHILD_PAXNO_DROPDOWN[i].Disabled = false;
        this.ADULT_PAXNO_DROPDOWN[i].Disabled = false;
        this.SENIOR_PAXNO_DROPDOWN[i].Disabled = false;

        if (i > noOfChildren + remainingTravellers) this.CHILD_PAXNO_DROPDOWN[i].Disabled = true;
        if (i > noOfAdults + remainingTravellers) this.ADULT_PAXNO_DROPDOWN[i].Disabled = true;
        if (i > noOfSeniors + remainingTravellers) this.SENIOR_PAXNO_DROPDOWN[i].Disabled = true;
      }

    }
  }

  updateNoOfAdultsFM() {
    var NoOfAdults = this.quoteForm?.get('NoOfAdults')?.value;
    var trgrpcode = this.quoteForm.get('trgrpcode')?.value;
    this.CHILD_PAXNO_DROPDOWN[10].Disabled = false;
    if (trgrpcode == 'FM') {
      if (NoOfAdults == 1) {
        this.CHILD_PAXNO_DROPDOWN[10].Disabled = true;
      }
    }
  }

  updateEndDate() {
    var endDate = this.quoteForm.get('endDate')?.value;
    var startDate = this.quoteForm.get('startDate')?.value;

    if (endDate !== null && endDate !== '' && startDate !== null && startDate !== '') {
      if (this.quoteForm.get('trdestination')?.value == 'WRW1' && this.quoteForm.get('coveragetype')?.value == 'TW') {
        const diffInDays = moment(endDate).diff(moment(startDate), 'days');
        if (diffInDays >= 44 && diffInDays < 90) {
          this.openDialog(this.coverageDateDialog);
        }
      }
    }
  }

  endDateclose(): void {
    this.dialogService.closeAll();
  }

  endDateYes() {
    this.quoteForm.get('coveragetype')?.setValue('AN');
    this.dialogService.closeAll();
  }

  openAlertCoverage() {
    this.updateEndDate();
  }


  nextQuestion() {
    this.spinnerOverlayService.showLoadOverlay();
    var generalState = this._store.selectSnapshot((state) => state.GeneralState);

    if (generalState.sourceSystem === 'STAFFR') {
      firstValueFrom(this._store.dispatch(new GET_VALIDATE_VOUCHER())).then((res: any) => {
        var response = res.QuoteProgessState.staffResult;
        if (response) {
          this.processNext();
        }
      })
    } else {
      this.processNext();
    }

  }

  processNext() {
    var coveragetype = this.quoteForm.get('coveragetype')?.value;
    if (coveragetype == 'AN') {
      this.quoteForm?.addControl('endDate', new UntypedFormControl());
      this.quoteForm.get('endDate')?.setValue(moment(this.quoteForm.get('startDate')?.value).add(-1, 'day').add(1, 'year'));
    }

    const formValue = this.quoteForm.getRawValue();

    firstValueFrom(this._store.dispatch(new SET_STEP_1(formValue))).then((_) => {
      firstValueFrom(this._store.dispatch(new PLAN_RECOMMENDATION('GETINFO', 1))).then((_) => {
        if (_.QuoteProgessState.planRecommendation.quoteDetails.Status == "Success") {
          this.defineFormObject(_.QuoteProgessState.planRecommendation.planRecommendation.subCoverBenefits,
            _.QuoteProgessState.planRecommendation.quoteDetails.Result.Risk.RiskGrp);
          this.spinnerOverlayService.hideLoadOverlay();
          this.router.navigate(['/quotation'], {
            queryParamsHandling: 'preserve',
          })
        }
      });
    });

    this.action$
      .pipe(ofActionCompleted(PLAN_RECOMMENDATION), takeUntil(this.ngUnsubscribe))
      .subscribe((data: ActionCompletion) => {
        if (data.result.error) {
          //handle mulitple popup
          if (this.activeDialogRef == undefined) {
            this.activeDialogRef = this.dialogService.open(ServerTimeoutDialogComponent, {
              showCloseIcon: true,
              data: { refreshPage: true },
            });
          }
          // in case timeout again
          else if (this.activeDialogRef.getState() == 2) {
            this.activeDialogRef = this.dialogService.open(ServerTimeoutDialogComponent, {
              showCloseIcon: true,
              data: { refreshPage: true },
            });
          }
        }
      });
  }

  dialogServiceOpen(): void {
    this.dialogService.open(ServerTimeoutDialogComponent, {
      showCloseIcon: true,
    });
  }

  defineFormObject(subCoverBenefits: any, riskGrp: any) {
    this.travelCareForm.addControl('coverageForm', coverageForm);
    this.coverageForm = this.travelCareForm?.get('coverageForm') as UntypedFormGroup;
    this.coverageForm.removeControl('domesticCoverage');
    (this.coverageForm?.get('sportsCoverage') as UntypedFormGroup)?.removeControl('sportsArray');
    (this.coverageForm?.get('sportsCoverage') as UntypedFormGroup)?.removeControl('sportSelectAll');
    (this.coverageForm?.get('mountaineeringCoverage') as UntypedFormGroup)?.removeControl('mountaineerArray');
    (this.coverageForm?.get('mountaineeringCoverage') as UntypedFormGroup)?.removeControl('mountaineerSelectAll');
    this.coverageForm.removeControl('sportsCoverage');
    this.coverageForm.removeControl('mountaineeringCoverage');


    var step1 = this._store.selectSnapshot((state) => state.UserInputState.userInput.step1);

    if (step1.trdestination !== "DOM") {
      this.coverageForm.addControl("domesticCoverage", domesticCoverage);
    }

    var sports = subCoverBenefits.find((item: any) => item.category === "Additional Sports");
    if (sports) {
      this.coverageForm.addControl("sportsCoverage", sportsCoverage);
      if (step1.trgrpcode == 'MT') {
        const ageRange: { [key: string]: null } = {
          A: <any>"Adult [18-70 years old]",
          C: <any>"Child / Student [0-17 years old]"
        };

        var nonSenior = riskGrp.filter((item: any) => item.RiskPerson.AgeRange !== "S");
        var nonSeniorSorted = this.generalService.sortTravelerSequence(nonSenior);
        var sportsArray = new UntypedFormArray([]);
        var sportSelectAll = new UntypedFormControl(false);
        nonSeniorSorted.forEach((element: any) => {
          sportsArray.push(
            new UntypedFormGroup({
              TravelerSequence: new UntypedFormControl(element.TravelerSequence),
              ExtSportsInd: new UntypedFormControl(false),
              ageRange: new UntypedFormControl(element.RiskPerson.AgeRange),
              traveller: new UntypedFormControl(element.RiskPerson.Name),
              ageRangeDesc: new UntypedFormControl(ageRange[element.RiskPerson.AgeRange])
            })
          );
        });
        (this.coverageForm.get('sportsCoverage') as UntypedFormGroup).addControl('sportsArray', sportsArray);
        (this.coverageForm.get('sportsCoverage') as UntypedFormGroup).addControl('sportSelectAll', sportSelectAll);
      }
    }

    var mountaineer = subCoverBenefits.find((item: any) => item.category === "Mountaineering");
    if (mountaineer) {
      this.coverageForm.addControl("mountaineeringCoverage", mountaineeringCoverage);
      var adultOnly = riskGrp.filter((item: any) => item.RiskPerson.AgeRange === "A");
      var adultOnlySorted = this.generalService.sortTravelerSequence(adultOnly);
      var mountaineerArray = new UntypedFormArray([]);
      var mountaineerSelectAll = new UntypedFormControl(false);
      adultOnlySorted.forEach((element: any) => {
        mountaineerArray.push(
          new UntypedFormGroup({
            TravelerSequence: new UntypedFormControl(element.TravelerSequence),
            MountaineeringInd: new UntypedFormControl(false),
            ageRange: new UntypedFormControl(element.RiskPerson.AgeRange),
            traveller: new UntypedFormControl(element.RiskPerson.Name),
            adultGroup: new UntypedFormControl(),
            premiumPerPerson: new UntypedFormControl(0.00),
          })
        );
      });
      (this.coverageForm.get('mountaineeringCoverage') as UntypedFormGroup).addControl('mountaineerArray', mountaineerArray);
      (this.coverageForm.get('mountaineeringCoverage') as UntypedFormGroup).addControl('mountaineerSelectAll', mountaineerSelectAll);
    }

    this.formService.updateForms(this.travelCareForm);
    this.defineQuotationFormObject(riskGrp);
  }

  travellerArray = new UntypedFormArray([]);
  nomineeArray = new UntypedFormArray([]);

  defineQuotationFormObject(riskGrp: any) {
    this.travelCareForm.removeControl('customerDetailsForm');
    this.travelCareForm.addControl('customerDetailsForm', customerDetailsForm);

    var userInput$ = this._store.selectSnapshot((state: any) => state.UserInputState.userInput);
    var customerDetails = this.travelCareForm?.get('customerDetailsForm') as UntypedFormGroup;
    customerDetails.removeControl('travellerArrayForm')
    customerDetails.removeControl('nomineeArrayForm');

    var label = AgeRange[this.quoteForm.get('tragerange')?.value]

    customerDetails?.get('mainPolicyHolder')?.get('mainPolicyholderLabel')?.setValue(label);

    this.travellerArray = new UntypedFormArray([]);
    var riskGrpSorted = this.generalService.sortTravelerSequence(riskGrp);

    if (userInput$.step1.trgrpcode !== 'MS') {
      var otherTraveller = riskGrpSorted.filter(r => r.RiskPerson.Name !== "TRAVELLER 1");
      customerDetails.addControl('travellerArrayForm', new UntypedFormArray([]))
      this.travellerArray = customerDetails.get('travellerArrayForm') as UntypedFormArray;
      var policyValue = customerDetails?.get('travellerArrayForm')?.value

      for (let data of otherTraveller) {
        this.addTravellerArray(data, userInput$.step1.trgrpcode, policyValue)
      }

    }

    customerDetails.addControl('nomineeArrayForm', new UntypedFormArray([]))
    var nomineeArrayName = customerDetails.get('nomineeArrayForm') as UntypedFormArray;

    for (let i = 1; i <= riskGrpSorted.length; i++) {
      nomineeArrayName.push(
        new UntypedFormGroup({
          nomineeArrayName: new UntypedFormArray([
            this.initOptions()
          ]),
          percentage: new UntypedFormControl(0),
          parentName: new UntypedFormControl(''),
          TravelerSequence: new UntypedFormControl(i),
          totalPercentage: new UntypedFormControl(0)
        }))
    }

    this.formService.updateForms(this.travelCareForm);
  }


  initOptions() {
    return new UntypedFormGroup({
      fullname: new UntypedFormControl(''),
      idType: new UntypedFormControl(''),
      idNo: new UntypedFormControl(''),
      age: new UntypedFormControl(''),
      relationship: new UntypedFormControl(''),
      nationality: new UntypedFormControl(''),
      percentage: new UntypedFormControl(''),
    });
  }


  addTravellerArray(data: any, trgrpcode: any, policyValue: any) {
    this.travellerArray.push(
      new UntypedFormGroup({
        travellerLabel: new UntypedFormControl(''),
        travellerSport: new UntypedFormControl(''),
        travellerMount: new UntypedFormControl(''),
        mountAdultGroup: new UntypedFormControl(''),
        fullname: new UntypedFormControl('', Validators.required),
        idType: new UntypedFormControl('NRIC'),
        age: new UntypedFormControl(''),
        gender: new UntypedFormControl('M', Validators.required),
        idNo: new UntypedFormControl('', Validators.required),
        dob: new UntypedFormControl('', Validators.required),
        relationship: new UntypedFormControl(''),
        nationality: new UntypedFormControl('MAL'),
        phonePrefix: new UntypedFormControl('+6010'),
        phoneNo: new UntypedFormControl(''),
        email: new UntypedFormControl(''),
        ageMin: new UntypedFormControl(''),
        ageMax: new UntypedFormControl(''),
        ageMinTrPass: new UntypedFormControl(''),
        ageMaxTrPass: new UntypedFormControl(''),
        ageRange: new UntypedFormControl(''),
        TravelerSequence: new UntypedFormControl(data.TravelerSequence),
      })
    );

    var label;
    if (trgrpcode !== 'FM') {
      label = Type[trgrpcode + data.RiskPerson.AgeRange] + " (" + AgeRange[data.RiskPerson.AgeRange] + ")";
    } else {
      label = Type[trgrpcode + data.RiskPerson.AgeRange] + " (" + FMAgeRange[data.RiskPerson.AgeRange] + ")";
    }
    this.travellerArray.at(policyValue.length - 1).get('ageRange')?.setValue(data.RiskPerson.AgeRange);
    this.travellerArray.at(policyValue.length - 1).get('travellerLabel')?.setValue(label);
    this.travellerArray.at(policyValue.length - 1).get('travellerSport')?.setValue(data.RiskPerson.ExtSportsInd);
    this.travellerArray.at(policyValue.length - 1).get('travellerMount')?.setValue(data.RiskPerson.MountaineeringInd);
    this.travellerArray.at(policyValue.length - 1).get('ageMin')?.setValue(this.generalService.getAgeRangeMin(data.RiskPerson.AgeRange, true));
    this.travellerArray.at(policyValue.length - 1).get('ageMax')?.setValue(this.generalService.getAgeRangeMin(data.RiskPerson.AgeRange, false));
  }
}
