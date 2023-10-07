import { Component, OnInit, ViewChild } from '@angular/core';

import { ChangeDetectorRef } from '@angular/core';
import { UntypedFormArray, UntypedFormGroup, UntypedFormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { Observable, firstValueFrom } from 'rxjs';
import { NavigationService } from '@services/navigation.service';
import { FormService } from '@services/form.service';
import { GeneralService } from '../../services/general.service';
import { QuotationSummaryService } from '../../services/quotation-summary.service';
import { RESET_STEP_2, SET_STEP_2 } from '../../store/actions/user-input.action';
import { PLAN_RECOMMENDATION, QUOTE_PROGRESS, RESET_PLAN_RECOMMENDATION } from '../../store/actions/quote-progress.action';
import { SpinnerOverlayService } from 'module/spinner-overlay/spinner-overlay.service';
import { GeneralSelectors } from 'module/store/general.selectors';
import { PRODUCT_CONFIG } from 'module/store/general.class';
import { AgeRange } from '../../constants/customer-details.constants';

@Component({
  selector: 'app-quotation',
  templateUrl: './quotation.component.html',
  styleUrls: ['./quotation.component.scss'],
})
export class QuotationComponent implements OnInit {
  LOGO: any;
  HEADER: any;
  SUBHEADER: any;
  benefits: [];
  subCoverBenefits: any;
  summaries: any;
  isLoading: boolean = true;
  sportsCoverageList: [] = [];
  mountaineeringCoverageList: [] = [];
  domesticCoverageList: [] = [];
  sportsArray: any;
  sportsArrayControl: any;
  mountArray: any;
  mountArrayControl: any;
  Adult1Amount = 0;
  Adult2Amount = 0;
  selectAllControl: any;
  sportSelectAllControl: any;

  @ViewChild('stepper') stepper: any;
  @Select(GeneralSelectors.productConfig) productConfig$: Observable<PRODUCT_CONFIG> | undefined;

  travelCareForm: UntypedFormGroup = new UntypedFormGroup({});
  quoteForm!: UntypedFormGroup;
  coverageForm!: UntypedFormGroup;
  customerDetailsForm!: UntypedFormGroup;
  travellerArrayForm!: UntypedFormArray;

  constructor(
    private changeDetectionRef: ChangeDetectorRef,
    private _store: Store,
    public navigation: NavigationService,
    private quotationSummaryService: QuotationSummaryService,
    public spinnerOverlayService: SpinnerOverlayService,
    private router: Router,
    public formService: FormService,
    public generalService: GeneralService) {
    this.LOGO = generalService.getConfig().LOGO;
    this.HEADER = generalService.getConfig().HEADER;
    this.SUBHEADER = generalService.getConfig().SUBHEADER;
    this.benefits = this._store.selectSnapshot((state) => state.QuoteProgessState.planRecommendation.planRecommendation.benefits);
    this.subCoverBenefits = this._store.selectSnapshot((state) => state.QuoteProgessState.planRecommendation.planRecommendation.subCoverBenefits);
  }

  ngOnInit() {
    this.getQuotationSummaryService();
    this.domesticList();

    const formValues = this.formService.getForms();
    if (!formValues) return;
    Object.keys(formValues).forEach((formValue: any) => {
      let formGroup = this.formService.generateControls(formValues[formValue]);
      this.travelCareForm.addControl(formValue, formGroup);
    });
    this.quoteForm = this.travelCareForm?.get('quoteForm') as UntypedFormGroup;
    this.coverageForm = this.travelCareForm?.get('coverageForm') as UntypedFormGroup;
    this.customerDetailsForm = this.travelCareForm?.get('customerDetailsForm') as UntypedFormGroup;
    this.travellerArrayForm = this.customerDetailsForm?.get('travellerArrayForm') as UntypedFormArray;

    this.sportsArrayControl = this.coverageForm?.get('sportsCoverage')?.get('sportsArray') as UntypedFormArray;
    this.sportsArray = formValues.coverageForm?.sportsCoverage?.sportsArray;
    this.sportSelectAllControl = this.coverageForm?.get('sportsCoverage')?.get('sportSelectAll') as UntypedFormControl;

    this.mountArrayControl = this.coverageForm?.get('mountaineeringCoverage')?.get('mountaineerArray') as UntypedFormArray;
    this.mountArray = formValues.coverageForm.mountaineeringCoverage?.mountaineerArray;
    this.selectAllControl = this.coverageForm?.get('mountaineeringCoverage')?.get('mountaineerSelectAll') as UntypedFormControl;

    this.subCoverBenefitsList();

    // Update form service when there is changes in value
    this.coverageForm.valueChanges.subscribe(() => {
      this.formService.updateForms(this.travelCareForm);
    });

    this.customerDetailsForm.valueChanges.subscribe(() => {
      this.formService.updateForms(this.travelCareForm);
    });

    if (this.sportsArrayControl) {
      this.sportsArrayControl.valueChanges.subscribe(() => {
        this.updateSportsArrayDisplay();
        this.storeToState();
      });
    }
    if (this.mountArrayControl) {
      for (var i = 0; i < this.mountArray.length; i++) {
        this.mountArrayControl.at(i).get('adultGroup')?.valueChanges.subscribe(() => {
          this.updateMountArrayDisplay();
          this.storeToState();
        });

        this.mountArrayControl.at(i).get('MountaineeringInd')?.valueChanges.subscribe((value: any) => {
          if (!value) {
            this.mountArrayControl?.at(i)?.get('adultGroup')?.setValue("");
            this.mountArrayControl?.at(i)?.get('adultGroup')?.clearValidators();
            this.updateMountArrayDisplay();
            this.storeToState();
          }
        });
      }
    }

    this.mountDisplayValue(this._store.selectSnapshot((state) => state.QuoteProgessState))
    this.isLoading = false;
  }

  ngAfterViewInit() {
    this.stepper.steps.get(0).completed = true;
    this.stepper.steps.get(1).select();
    this.changeDetectionRef.detectChanges();
  }

  subCoverBenefitsList() {
    this.sportsCoverageList = this.subCoverBenefits.filter((item: any) => item.category === "Additional Sports");
    this.mountaineeringCoverageList = this.subCoverBenefits.filter((item: any) => item.category === "Mountaineering")
  }

  domesticList() {
    this.domesticCoverageList = this._store.selectSnapshot((state) => state.QuoteProgessState.planRecommendation.planRecommendation.domesticBenefits);
    this.changeDetectionRef.detectChanges();
  }

  getQuotationSummaryService() {
    this.quotationSummaryService.getSummary(false).then((data: any) => {
      this.summaries = data;
    });
  }

  getCoverageFormGroupName(formName: string, formNameCheck: string) {
    return this.coverageForm?.get(formName)?.get(formNameCheck)?.value;
  }

  /*---- Functions ----*/
  updatePanelByCheckbox(type: any) {
    if (type === 'SPORT') {
      if (this.sportsArray?.length > 0) {
        if (!this.coverageForm?.get('sportsCoverage')?.get('sportsCoverageCheck')?.value) {
          for (var i = 0; i < this.sportsArray.length; i++) {
            this.sportsArrayControl.at(i).get('ExtSportsInd').setValue(false, { emitEvent: false });
            this.sportSelectAllControl.setValue(false, { emitEvent: false });
          }
          this.coverageForm?.get('sportsCoverage')?.get('sportsAmount')?.setValue(0);

          if (this.travellerArrayForm.value) {
            for (var i = 0; i < this.travellerArrayForm.value.length; i++) {
              this.travellerArrayForm.at(i).get('travellerSport')?.setValue(false);
            }
          }
          if (!this.coverageForm?.get('sportsCoverage')?.get('sportsCoverageCheck')?.value) {
            this.customerDetailsForm?.get('mainPolicyHolder')?.get('mainPolicyholderSport')?.setValue(false);
          }
          this.storeToState();
        }
      } else {
        if (!this.coverageForm?.get('sportsCoverage')?.get('sportsCoverageCheck')?.value) {
          if (this.travellerArrayForm !== null) {
            if (this.travellerArrayForm.value) {
              for (var i = 0; i < this.travellerArrayForm.value.length; i++) {
                this.travellerArrayForm.at(i).get('travellerSport')?.setValue(false);
              }
            }
          }
        } else {
          if (this.quoteForm.get('trgrpcode')?.value === 'FM')
            for (var i = 0; i < this.travellerArrayForm.value.length; i++) {
              this.travellerArrayForm.at(i).get('travellerSport')?.setValue(true);
            }
        }

        if (!this.coverageForm?.get('sportsCoverage')?.get('sportsCoverageCheck')?.value) {
          this.customerDetailsForm?.get('mainPolicyHolder')?.get('mainPolicyholderSport')?.setValue(false);
        } else {
          this.customerDetailsForm?.get('mainPolicyHolder')?.get('mainPolicyholderSport')?.setValue(true);
        }
        this.storeToState();
      }
    } else if (type === 'DOM') {
      this.storeToState();
    } else {
      if (this.mountArray?.length > 0) {
        if (!this.coverageForm?.get('mountaineeringCoverage')?.get('mountaineeringCoverageCheck')?.value) {
          for (var i = 0; i < this.mountArray.length; i++) {
            this.mountArrayControl.at(i).get('adultGroup').setValue("", { emitEvent: false });
            this.mountArrayControl.at(i).get('MountaineeringInd').setValue(false, { emitEvent: false });
            this.mountArrayControl.at(i).get('adultGroup')?.clearValidators({ emitEvent: false });
            this.mountArrayControl.at(i).get('adultGroup')?.updateValueAndValidity({ emitEvent: false });
            this.selectAllControl.setValue(false, { emitEvent: false });
          }
          this.updateMountArrayDisplay();
          this.storeToState();
        }
      }
    }
  }

  updateSportsArrayDisplay() {
    const sportsArray = this.sportsArrayControl.value;
    var mainPolicy = sportsArray.find((r: any) => r.TravelerSequence === 1);

    if (mainPolicy) {
      this.customerDetailsForm?.get('mainPolicyHolder')?.get('mainPolicyholderSport')?.setValue(mainPolicy.ExtSportsInd);
    }

    if (this.sportsArray?.length > 0) {
      for (var i = 0; i < this.travellerArrayForm.value.length; i++) {
        var othersMount = sportsArray.find((othersMount: any) => othersMount.TravelerSequence == this.travellerArrayForm.at(i).get('TravelerSequence')?.value)
        if (othersMount) {
          this.travellerArrayForm.at(i).get('travellerSport')?.setValue(othersMount.ExtSportsInd);
        }
      }
    }
  }


  updateMountArrayDisplay() {
    const formValue = this.coverageForm.getRawValue();
    const mountArray = formValue.mountaineeringCoverage.mountaineerArray;

    var mainPolicy = mountArray.find((r: any) => r.TravelerSequence === 1);
    if (mainPolicy) {
      this.customerDetailsForm?.get('mainPolicyHolder')?.get('mainPolicyholderMount')?.setValue(mainPolicy.MountaineeringInd);
      this.customerDetailsForm?.get('mainPolicyHolder')?.get('mainPolicyholderMountAdultGroup')?.setValue(mainPolicy.adultGroup);
      if (mainPolicy.MountaineeringInd) {
        var label = AgeRange[mainPolicy.adultGroup]
        this.customerDetailsForm?.get('mainPolicyHolder')?.get('mainPolicyholderLabel')?.setValue(label);
      } else {
        var label = AgeRange[this.quoteForm.get('tragerange')?.value]

        this.customerDetailsForm?.get('mainPolicyHolder')?.get('mainPolicyholderLabel')?.setValue(label);
        this.customerDetailsForm?.get('mainPolicyHolder')?.get('mainPolicyholderMountAdultGroup')?.setValue("");
      }
    }

    if (this.travellerArrayForm?.value?.length && this.mountArray?.length > 0) {

      for (var i = 0; i < this.travellerArrayForm.value.length; i++) {
        var othersMount = mountArray.find((othersMount: any) => othersMount.TravelerSequence == this.travellerArrayForm.at(i).get('TravelerSequence')?.value)
        if (othersMount) {
          this.travellerArrayForm.at(i).get('travellerMount')?.setValue(othersMount.MountaineeringInd);
          this.travellerArrayForm.at(i).get('mountAdultGroup')?.setValue(othersMount.adultGroup);
          if (othersMount.MountaineeringInd) {
            var label = AgeRange[othersMount.adultGroup]
            this.travellerArrayForm.at(i).get('travellerLabel')?.setValue(label);
          } else {
            var label = AgeRange[othersMount.ageRange]
            this.travellerArrayForm.at(i).get('travellerLabel')?.setValue(label);
            this.travellerArrayForm.at(i).get('mountAdultGroup')?.setValue("");
          }
        }
      }
    }
  }

  storeToState() {
    this.spinnerOverlayService.showLoadOverlay();
    const formValue = this.coverageForm.getRawValue();

    this._store.dispatch(new SET_STEP_2(formValue));

    this._store.dispatch(new PLAN_RECOMMENDATION('QUOTATIONSELECTION', 2)).subscribe((_) => {
      if (_.QuoteProgessState.planRecommendation.quoteDetails.Status == "Success") {
        this.getQuotationSummaryService();
        this.mountDisplayValue(_.QuoteProgessState);

        if (this.coverageForm?.get('sportsCoverage')?.get('sportsCoverageCheck')?.value) {
          var sportsPremium = _.QuoteProgessState.planRecommendation.planRecommendation.premiumList.find((s: any) => s.premium.sportsPremium)
          if (sportsPremium?.premium?.sportsPremium > 0) {
            this.coverageForm?.get('sportsCoverage')?.get('sportsAmount')?.setValue(sportsPremium.premium?.sportsPremium);
          } else {
            this.coverageForm?.get('sportsCoverage')?.get('sportsAmount')?.setValue(0)
          }
        }
        if (this.coverageForm?.get('domesticCoverage')?.get('domesticCoverageCheck')?.value) {
          this.domesticList();
        } else {
          this.domesticCoverageList = [];
          this.changeDetectionRef.detectChanges();
        }
      }
      this.spinnerOverlayService.hideLoadOverlay();
    });

  }

  mountDisplayValue(quoteProgessState: any): void {

    var step2 = this._store.selectSnapshot((state) => state.UserInputState.userInput.step2);
    if (this.coverageForm?.get('mountaineeringCoverage')?.get('mountaineeringCoverageCheck')?.value) {
      var amountsArray = quoteProgessState.planRecommendation.planRecommendation.premiumList;
      var travelerArray = step2.mountaineeringCoverage.mountaineerArray;
      var adult1Result = travelerArray.find((s: any) => s.adultGroup === 'adult1' && s.MountaineeringInd);
      var adult2Result = travelerArray.find((s: any) => s.adultGroup === 'adult2' && s.MountaineeringInd);
      this.Adult1Amount = amountsArray.find((s: any) => s.id === adult1Result?.TravelerSequence)?.premium?.mountaineeringPremium;
      this.Adult2Amount = amountsArray.find((s: any) => s.id === adult2Result?.TravelerSequence)?.premium?.mountaineeringPremium;


      // find the indexes of MT traveller
      var Adult1travelIndexArr: any = [];
      var Adult2travelIndexArr: any = [];
      travelerArray.filter((obj: any, i: any) => {
        if (obj.adultGroup === 'adult1' && obj.MountaineeringInd) {
          Adult1travelIndexArr.push(i)
        }
        else if (obj.adultGroup === 'adult2' && obj.MountaineeringInd) {
          Adult2travelIndexArr.push(i)
        }
      });
      //after selecting the radio button at Mt  to update the premiumperpersion
      if (Adult1travelIndexArr && Adult1travelIndexArr.length > 0) {
        Adult1travelIndexArr.map((ind: any) => {
          this.mountArrayControl?.at(ind)?.get('premiumPerPerson').setValue(this.Adult1Amount);
          const formValue = this.coverageForm.getRawValue();
          this.mountArray = formValue.mountaineeringCoverage.mountaineerArray;
        })
      }
      if (Adult2travelIndexArr && Adult2travelIndexArr.length > 0) {
        Adult2travelIndexArr.map((ind: any) => {
          this.mountArrayControl?.at(ind)?.get('premiumPerPerson').setValue(this.Adult2Amount);
          const formValue = this.coverageForm.getRawValue();
          this.mountArray = formValue.mountaineeringCoverage.mountaineerArray;
        })
      }
      if (this.Adult1Amount == undefined && this.Adult2Amount == undefined) {
        for (let i = 0; i < this.mountArrayControl?.length; i++) {
          this.mountArrayControl?.at(i)?.get('premiumPerPerson').setValue(0);
          const formValue = this.coverageForm.getRawValue();
          this.mountArray = formValue.mountaineeringCoverage.mountaineerArray;
        }


      }
    }
  }

  proceedNext(): void {
    this.spinnerOverlayService.showLoadOverlay();
    const formValues = this.formService.getForms();
    var mountArray = formValues.coverageForm.mountaineeringCoverage?.mountaineerArray;

    if (mountArray) {
      var mountResult = mountArray.find((s: any) => s.MountaineeringInd === true);
      if (mountResult == undefined) {
        this.coverageForm?.get('mountaineeringCoverage')?.get('mountaineeringCoverageCheck')?.setValue(false);
      }
    }
    const formValue = this.coverageForm.getRawValue();
    firstValueFrom(this._store.dispatch(new SET_STEP_2(formValue))).then((_) => {
      firstValueFrom(this._store.dispatch(new QUOTE_PROGRESS('QUOTATIONDONE', 3))).then((_) => {
        if (_.QuoteProgessState.planRecommendation.quoteDetails.Status == "Success") {
          this.spinnerOverlayService.hideLoadOverlay();
          this.router.navigate(['/customer-details'], {
            queryParamsHandling: 'preserve',
          })
        }
      });
    });
  }

  proceedBack(): void {
    this._store.dispatch(new RESET_STEP_2());
    this._store.dispatch(new RESET_PLAN_RECOMMENDATION());
  }
  // Error validation for MT check box
  updateMountAccordionError(event: any) {
    if (event.value) {
      this.mountArrayControl.at(event.index).get('adultGroup')?.setValidators(Validators.required);
    } else {
      this.mountArrayControl.at(event.index).get('adultGroup')?.setValue("", { emitEvent: false });
      this.mountArrayControl?.at(event.index)?.get('premiumPerPerson').setValue(0.00, { emitEvent: false });
      const formValue = this.coverageForm.getRawValue();
      this.mountArray = formValue.mountaineeringCoverage.mountaineerArray;
      this.mountArrayControl.at(event.index).get('adultGroup')?.clearValidators();
      this.mountArrayControl.at(event.index).get('adultGroup')?.updateValueAndValidity();

    }

  }
  // select ALL check box at sport
  updateSportCheckBox(event: any) {
    this.updateSportsArrayDisplay();
    this.storeToState();

  }
  //select All cehck Box for MT
  selectAllCheckBoxevent() {
    this.updateMountArrayDisplay();
    this.storeToState();
  }

}
