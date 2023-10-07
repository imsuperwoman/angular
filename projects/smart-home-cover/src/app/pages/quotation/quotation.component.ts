import { AfterViewInit, Component, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ChangeDetectorRef } from '@angular/core';
import { Actions, ofActionSuccessful, Select, Store } from '@ngxs/store';
import { QuoteProgessState } from '../../store/states/quote-progress.state';
import {
  EPOLICY_INQUIRY,
  QUOTE_DETAILS,
  REFRESH_QUOTE,
  ALIM_POLICY_ENQUIRY
} from '../../store/actions/quote-progess.action';
import { firstValueFrom, Observable } from 'rxjs';
import { IMAGE_FOLDER } from '@constants/header-constants';
import { SHC } from '../../constants/shc-constants';
import { PRODUCT_CONFIG } from 'module/store/general.class';
import { GeneralSelectors } from 'module/store/general.selectors';
import { SET_STEP_2, RESET_STEP_2_POLICY_NO, RESET_STEP_2_ALIM_POLICY_NO } from '../../store/actions/user-input.action';
import * as moment from 'moment';
import { SpinnerOverlayService } from 'module/spinner-overlay/spinner-overlay.service';
import { Router } from '@angular/router';
import { NxDialogService, NxModalRef } from '@aposin/ng-aquila/modal';
import { NxExpansionPanelComponent } from '@aposin/ng-aquila/accordion';
import { UserInputState } from '../../store/states';
import { nricValidator } from '@functions/validator-nric.function';
import { showChatBot } from '@functions/chatBot.function';
import { FormService } from '@services/form.service';

@Component({
  selector: 'quotation',
  templateUrl: './quotation.component.html',
  styleUrls: ['./quotation.component.scss'],
})
export class QuotationComponent implements OnInit, AfterViewInit {
  /*---- Modal Dialog ----*/
  @ViewChild('stepper') stepper: any;
  @ViewChildren(NxExpansionPanelComponent)
  expansionPanels!: QueryList<NxExpansionPanelComponent>;
  @ViewChild('commonErrorDialog') commonErrorDialog: any;

  commonErrorDialogHeader = '';
  commonErrorDescription = '';

  /*---- From Store ----*/
  @Select(QuoteProgessState.planRecommendation) planRecommendation$: any;
  @Select(QuoteProgessState.quoteNumber) quoteNumber$: any;
  @Select(GeneralSelectors.selectLovWithBlank('CUSTIDTYPE')) custIDTypeWithBlank$: any;
  @Select(GeneralSelectors.selectLovWithBlank('NATIONALITY')) nationality$: any;
  @Select(GeneralSelectors.flowType) flowType$: any;
  @Select(GeneralSelectors.sourceSystem) sourceSystem$: any;
  @Select(GeneralSelectors.productConfig) productConfig$: Observable<PRODUCT_CONFIG> | undefined;
  @Select(UserInputState.coverageType) coverageType$: any;
  @Select(UserInputState.eligibleLock) eligibleLock$: any;
  @Select(UserInputState.eligibleDiscount) eligibleDiscount$: any;

  useCalculatedValue: boolean = false;
  agreedValuePopover =
    "<strong>Agreed value</strong> is amount to insure your home for, agreed between you and Allianz. This value is obtained by using Allianz's sum insured calculator.";

  /*---- Data ----*/
  planRecommendationReturn: any;
  isLoading: boolean = false;
  imageFolder: string = IMAGE_FOLDER;
  productName = SHC;
  crossSellingPopup: any;
  postCodeList$: any;
  floodItem: any;
  renewal$: any;
  prodConfigData$: any;
  coverageDetails$: any;
  premium$: Observable<any>;
  minDate = moment().add(1, 'day');
  maxDate = moment().add(3, 'month').subtract(1, 'day');

  /*---- Accordion ----*/
  accordionErrorHidden: boolean[] = [];
  accordionRefreshRequried = false;

  /*---- House Owner ----*/
  houseOwnerJointPolicyControls: any[] = [];
  houseOwnerJointPolicyClear: boolean = true;
  houseOwnerJointPolicyCheck: boolean = true;
  addEligibilityJointPolicy: boolean = false;

  /*---- Form Controls ---*/
  smartHomeCoverForm: FormGroup = new FormGroup({});
  quoteForm!: FormGroup;
  coverageForm!: FormGroup;
  activeDialogRef!: NxModalRef<any>;
  discountForm!: FormGroup;
  policyHolder!: FormGroup;
  customerDetailsForm!: FormGroup;
  propertyDetailsForm!: FormGroup;
  jointPolicyHoldersArray!: FormArray;
  combinesNamesArray!: FormArray;

  identifyer = (index: number, item: any) => item.description;

  constructor(
    private _store: Store,
    public formService: FormService,
    private changeDetectorRef: ChangeDetectorRef,
    private action$: Actions,
    private spinnerOverlayService: SpinnerOverlayService,
    private router: Router,
    public dialogService: NxDialogService
  ) {
    this.prodConfigData$ = this._store.selectSnapshot((state) => state.GeneralState.productConfig);
    this.renewal$ = this._store.selectSnapshot((state) => state.UserInputState.userInput.renewal);
    this.coverageDetails$ = this._store.selectSnapshot(
      (state) => state.UserInputState.coverageDetails
    ).accordions;
    this.premium$ = this._store.select(
      (state) => state.QuoteProgessState.planRecommendation.planRecommendation.premium
    );
    this.postCodeList$ = this._store.selectSnapshot((state) => state.GeneralState.postcodeList);
  }

  ngOnInit() {
    showChatBot(this.prodConfigData$?.chatbotInd);
    this.getCrossSellingListingBuilder();

    const formValues = this.formService.getForms();
    if (!formValues) return;

    Object.keys(formValues).forEach((formValue: any) => {
      let formGroup = this.formService.generateControls(formValues[formValue]);
      this.smartHomeCoverForm.addControl(formValue, formGroup);
    });

    this.smartHomeCoverForm.valueChanges.subscribe(() => {
      this.formService.updateForms(this.smartHomeCoverForm);
    });

    this.coverageForm = this.smartHomeCoverForm.get('coverageForm') as FormGroup;
    this.houseOwnerJointForm();
    this.calculatedForm();
    this.propertyDetailsForm = this.smartHomeCoverForm.get('policyDetailsForm')?.get('propertyDetails') as FormGroup;
    this.customerDetailsForm = this.smartHomeCoverForm.get('policyDetailsForm')?.get('customerDetails') as FormGroup;
    this.combinesNamesArray = this.smartHomeCoverForm.get('policyDetailsForm')?.get('combinesNamesArray') as FormArray;
    this.quoteForm = this.smartHomeCoverForm.get('quoteForm') as FormGroup;

    this.planRecommendation$.subscribe((coverCode: any) => {
      let mergedSubjects = coverCode.map((subject: any) => {
        let otherSubject = this.coverageDetails$.find((element: any) => element.coverCode === subject.coverCode)
        return { ...subject, ...otherSubject }
      })
      this.planRecommendationReturn = mergedSubjects;
      if (coverCode) {
        coverCode.find((plan: any) => {
          if (plan.coverCode == '14' && plan.additionalCover) {
            plan.additionalCover.find((add: any) => {
              if (add.selectedIndicator) {
                this.coverageForm.get('houseOwner')?.get('additionalCoverage')?.get(add.coverCode)?.setValue(true);
              }
            })
          }
        })
      }
    })
    this.changeDetectorRef.detectChanges();
  }

  ngAfterViewInit(): void {
    this.stepper.steps.get(1).select();
    this.expansionPanels.map((panel: NxExpansionPanelComponent) => panel.expanded);
    this.expansionPanels.get(0)?.open();
    this.changeDetectorRef.detectChanges();
  }

  houseOwnerJointForm() {
    if (this.coverageForm.get('houseOwner') != null) {
      this.discountForm = this.coverageForm.get('houseOwner')?.get('discountForm') as FormGroup;
      this.jointPolicyHoldersArray = this.discountForm?.get('jointPolicyHolders') as FormArray;
      this.houseOwnerJointPolicyControls = this.jointPolicyHoldersArray?.value;

      this.discountForm.get('policyHolder')?.get('idType')?.setValidators(Validators.required);
      this.discountForm.get('policyHolder')?.get('idNo')?.setValidators(nricValidator.bind(this.discountForm.get('policyHolder'), 17, 80));
      this.discountForm.get('policyHolder')?.get('nationality')?.setValidators(Validators.required);

      this.coverageForm.get('houseOwner')?.get('discountForm')?.valueChanges.subscribe((props: any) => {
        let checkPolicyDate = Boolean(props?.policyDate);
        let checkIdNo = Boolean(props?.policyHolder?.idNo);
        let checkIdType = Boolean(props?.policyHolder?.idType);
        let checkIdNoValue = Boolean(!this.discountForm.get('policyHolder')?.get('idNo')?.errors);
        let checkNationality = Boolean(props?.policyHolder?.idType == 'NRIC' ? 'MAL' : props?.policyHolder?.nationality);

        this.houseOwnerJointPolicyCheck = !(checkPolicyDate && checkIdNo && checkIdType && checkIdNoValue && checkNationality);
        this.eligibleDiscount$.subscribe((value: Boolean) => {
          if (value) {
            this.houseOwnerJointPolicyCheck = true;
          }
        });
      })
    }

    this.eligibleLock$.subscribe((value: boolean) => {
      if (value) {
        this.coverageForm.get('houseOwner')?.get('discountForm')?.disable();
        this.houseOwnerJointPolicyClear = false;
        this.addEligibilityJointPolicy = true;
        this.houseOwnerJointPolicyCheck = true;
      }
      else {
        this.coverageForm.get('houseOwner')?.get('discountForm')?.enable();
        this.houseOwnerJointPolicyClear = true;
        this.addEligibilityJointPolicy = false;
      }
    });
    var idTypeValue = this.discountForm?.get('policyHolder')?.get('idType')?.value;

    if (idTypeValue === null) {
      this.discountForm.get('policyHolder')?.get('idType')?.setValue('NRIC');
      idTypeValue = 'NRIC';
    }

    if (idTypeValue === 'NRIC') {
      this.discountForm.get('policyHolder')?.get('nationality')?.setValue('MAL');
      this.discountForm.get('policyHolder')?.get('nationality')?.disable();
    }
  }

  calculatedForm() {
    var sumInsured = this._store.selectSnapshot((state) => state.UserInputState.userInput.step1.SumInsured)
    var calculator = this._store.selectSnapshot((state) => state.QuoteProgessState.calculator.estimatedSumInsured)

    if (sumInsured) {
      this.useCalculatedValue = Boolean(Number(sumInsured.replaceAll(',', '')).toFixed(0) == Number(calculator).toFixed(0));
    }
  }

  floodProneIndForm() {
    this.planRecommendation$.subscribe((planRecommendation: any) => {
      console.log(planRecommendation);
      let plan = planRecommendation;
      console.log(plan);
      if ((plan[0].coverCode == '03' || plan[0].coverCode == '14')
        && plan[0].selectedIndicator && this.floodItem) {
        this.coverageForm.get('houseOwner')?.get('coverBuildingDamage')?.disable();
      }
    });

  }
  /*--- Get ---*/
  get policyDateControl(): FormControl {
    return this.coverageForm.get('houseOwner')?.get('discountForm')?.get('policyDate') as FormControl;
  }

  getCoverageFormGroupName(title: string) {
    const dataName = this.coverageDetails$.find((data: any) => data.title == title);
    return dataName.formGroupName;
  }

  getCoverageFormGroupNameCoverCode(coverCode: string) {
    const dataName = this.coverageDetails$.find((data: any) => data.coverCode == coverCode);
    return dataName.formGroupName;
  }

  getCoverageCheckboxValue(title: string) {
    const dataName = this.coverageDetails$.find((data: any) => data.title == title);
    return this.coverageForm.get(dataName.formLevel)?.get(dataName.formGroupName)?.value;
  }

  getCoverageFormControls(controlName: string): AbstractControl | null {
    return this.coverageForm.get(controlName);
  }

  getJointPolicyHolders(index: number): any {
    return (this.jointPolicyHoldersArray).at(index).get('idType')?.value === 'NRIC'
      ? '000000-00-0000'
      : 'AAAAAAAAAAAAAAAAAAAA';
  }

  expanded = 0;
  panelExpandedValues: boolean[] = [];

  expandedChange(i: number): void {
    this.expanded++;
    if (this.accordionRefreshRequried) {
      if (this.expanded == 1) { this.openRefreshRequriedDialog(); }
      if (this.accordionErrorHidden[i]) {
        this.expansionPanels.get(i)?.open();
      } else {
        this.expansionPanels.forEach((panel, index: number) => {
          if (index == i) {
            if (this.panelExpandedValues[i]) {
              panel.open();
            } else {
              panel.close();
            }
          }
        });
      }
    }

    const expandedValues = this.expansionPanels
      .map((panel: NxExpansionPanelComponent) => panel.expanded);
    this.panelExpandedValues = expandedValues;
    this.expanded = 0;
  }

  getRecommendedPlan(plans: any) {
    let planIndex: any;

    for (var x = 0; x < plans.length; x++) {
      if (plans[x].recommendedIndicator) {
        planIndex = x;
      }
    }
    return planIndex + 1;
  }

  getSelectedPlan(plans: any) {
    let planIndex: any;

    for (var x = 0; x < plans.length; x++) {
      if (plans[x].selectedIndicator) {
        planIndex = x;
      }
    }
    return planIndex + 1;
  }

  getCrossSellingListingBuilder() {
    const lovList = this._store.selectSnapshot((state) => state.GeneralState.lov);
    const shcCrossSelling = lovList.find((item: any) => item.LovType == 'SHCDISCPRD');
    const shcCrossSellingList = shcCrossSelling.LovList;

    let textPop = 'Eligible products for additional discounts entitlement:<br />';

    shcCrossSellingList.forEach((data: any = {}) => {
      textPop = `${textPop}<br/>${data.Description}`;
    });
    textPop = textPop + '<br/>';

    this.crossSellingPopup = textPop;
  }

  /* Validation handler */
  addEligibilityPolicyHolder(): void {
    (
      this.jointPolicyHoldersArray
    ).push(
      new FormGroup({
        idType: new FormControl(''),
        idNo: new FormControl('')
      })
    );
    this.houseOwnerJointPolicyControls = this.jointPolicyHoldersArray?.value;
  }

  validateJointPolicy(event: any, i: number) {
    if (event != '') {
      this.jointPolicyHoldersArray.at(i).get('idNo')?.setValidators(nricValidator.bind(this.jointPolicyHoldersArray.at(i), 17, 80));
    } else {
      this.jointPolicyHoldersArray.at(i).get('idNo')?.setValidators(null);
      this.jointPolicyHoldersArray.at(i).get('idNo')?.markAsUntouched();
    }
  }

  idTypeChange(selectedValue: any) {
    const formValue = this.coverageForm.get('houseOwner')?.get('discountForm')?.get('policyHolder')?.get('idType')?.value;

    if (selectedValue != formValue) {
      this.coverageForm.get('houseOwner')?.get('discountForm')?.get('policyHolder')?.get('idNo')?.setValue(null);
      this.coverageForm.get('houseOwner')?.get('discountForm')?.get('policyHolder')?.get('idNo')?.markAsUntouched();
    }
    if (selectedValue === 'NRIC') {
      this.coverageForm.get('houseOwner')?.get('discountForm')?.get('policyHolder')?.get('nationality')?.setValue('MAL');
      this.coverageForm.get('houseOwner')?.get('discountForm')?.get('policyHolder')?.get('nationality')?.disable();

    } else {
      this.coverageForm.get('houseOwner')?.get('discountForm')?.get('policyHolder')?.get('nationality')?.setValue(null);
      this.coverageForm.get('houseOwner')?.get('discountForm')?.get('policyHolder')?.get('nationality')?.enable();
    }
  }

  deleteEligibilityPolicyHolder(i: number): void {
    (this.coverageForm.get('houseOwner')?.get('discountForm')?.get('jointPolicyHolders') as FormArray).removeAt(i);
    this.houseOwnerJointPolicyControls = this.jointPolicyHoldersArray?.value;
  }

  clearCheckEligibility(index?: number): void {
    this.coverageForm.get('houseOwner')?.get('discountForm')?.reset();
    this.coverageForm.get('houseOwner')?.get('discountForm')?.enable();
    while (this.jointPolicyHoldersArray.length > 1) {
      this.jointPolicyHoldersArray.removeAt(0);
    }
    this.houseOwnerJointPolicyControls = this.jointPolicyHoldersArray?.value;

    if (index == 0) {
      this._store.dispatch(new RESET_STEP_2_ALIM_POLICY_NO());
      this._store.dispatch(new RESET_STEP_2_POLICY_NO())
        .subscribe(() => {
          let currentPlans = [
            ...this._store.selectSnapshot((item: any) => item.UserInputState.userInput.step2.mainData),
          ];
          this.updateState(currentPlans, index);
          this.customerDetailsForm.get('idNo')?.setValue('');
          this.customerDetailsForm.get('idType')?.setValue('NRIC');
          this.customerDetailsForm.get('dob')?.setValue('');
          this.customerDetailsForm.get('nationality')?.setValue('MAL');
          this.customerDetailsForm.get('gender')?.setValue('M');
          this.propertyDetailsForm.get('endDate')?.setValue('');
          this.propertyDetailsForm.get('startDate')?.setValue('');
          while (this.combinesNamesArray.length > 1) {
            this.combinesNamesArray.removeAt(1);
          }
          this.combinesNamesArray.at(0).get('eligible')?.setValue(false);
          this.combinesNamesArray.at(0).get('idType')?.setValue('');
          this.combinesNamesArray.at(0).get('idNo')?.setValue('');
          this.combinesNamesArray.at(0).get('fullName')?.setValue('');
        })
    }
  }

  CheckEligibility() {
    if (!this.houseOwnerJointPolicyCheck) {
      this.commonErrorDialogHeader = '';
      this.commonErrorDescription = 'Please click "Check Eligibility" to update the premium and then try again.';
      this.commonErrorDialog.open();
      return false;
    }
    return true;
  }

  callEligibility(i: number): void {
    const valueAddDiscount = this.coverageForm.get('houseOwner')?.get('discountForm')?.value;
    const polStartDt = moment(valueAddDiscount.policyDate).format('YYYY-MM-DD');
    const polEndDt = moment(valueAddDiscount.policyDate).add(1, 'years').subtract(1, 'days').format('YYYY-MM-DD');
    const productCode = this._store.selectSnapshot(
      (state) => state.GeneralState.productConfig.ProductCode
    );

    let jointPolicyHolders = [];
    if (valueAddDiscount.jointPolicyHolders[0].idType != null) {
      for (var x = 0; x < valueAddDiscount.jointPolicyHolders.length; x++) {
        jointPolicyHolders.push({
          idType: valueAddDiscount.jointPolicyHolders[x].idType,
          idValue: valueAddDiscount.jointPolicyHolders[x].idNo.replace(/-/g, ''),
        });
      }
    }

    var payload = {
      idType: valueAddDiscount.policyHolder.idType,
      idValue: valueAddDiscount.policyHolder.idNo.replace(/-/g, ''),
      polStartDt: polStartDt,
      polEndDt: polEndDt,
      productCode: productCode,
      combinedNames: jointPolicyHolders,
    };

    const alimPolicyPayload = {
      idType: valueAddDiscount.policyHolder.idType,
      idValue: valueAddDiscount.policyHolder.idNo.replace(/-/g, ''),
      effDate: polStartDt,
      nationality: valueAddDiscount.policyHolder.nationality ? valueAddDiscount.policyHolder.nationality : "MAL",
    }

    this._store.dispatch(new EPOLICY_INQUIRY(payload)).subscribe((_) => {
      var relatedPolicyNo = _.UserInputState.userInput.step2.epolicyInquiry.policyNo;
      this.coverageForm.get('houseOwner')?.get('discountForm')?.disable();
      this.houseOwnerJointPolicyClear = false;
      this.houseOwnerJointPolicyCheck = true
      this.addEligibilityJointPolicy = false;
      const mainData = this._store.selectSnapshot(
        (state) => state.UserInputState.userInput.step2?.mainData
      );

      this._store.dispatch(new ALIM_POLICY_ENQUIRY(alimPolicyPayload)).subscribe((_) => {
        var alimPolicyNo = _.UserInputState.userInput.step2.alimPolicyInquiry.alimPolicyNo;
        if (relatedPolicyNo == '' && alimPolicyNo == '') {
          this.commonErrorDialogHeader = '';
          this.commonErrorDescription = 'There is no active eligible policy under the ID No. keyed in. Thus, no discount is applied.';
          this.commonErrorDialog.open();
        }
        this.updateState(mainData, i);
      });

      this.customerDetailsForm.get('idNo')?.setValue(valueAddDiscount.policyHolder.idNo);
      this.customerDetailsForm.get('idType')?.setValue(valueAddDiscount.policyHolder.idType);
      this.customerDetailsForm.get('nationality')?.setValue(valueAddDiscount.policyHolder.nationality ? valueAddDiscount.policyHolder.nationality : "MAL");
      this.propertyDetailsForm.get('startDate')?.setValue(polStartDt)
      this.propertyDetailsForm.get('endDate')?.setValue(polEndDt);

      if (valueAddDiscount.jointPolicyHolders[0].idType != null) {
        for (var x = 0; x < valueAddDiscount.jointPolicyHolders.length; x++) {
          if (x > 0) {
            this.combinesNamesArray.push(
              new FormGroup({
                fullName: new FormControl(''),
                idType: new FormControl(''),
                idNo: new FormControl(''),
                role: new FormControl(''),
                eligible: new FormControl(false),
              })
            );
          }
          this.combinesNamesArray.at(x).get('idType')?.setValue(valueAddDiscount.jointPolicyHolders[x].idType);
          this.combinesNamesArray.at(x).get('idNo')?.setValue(valueAddDiscount.jointPolicyHolders[x].idNo);
          this.combinesNamesArray.at(x).get('eligible')?.setValue(true);
        }
      }
    });
  }

  /*---- Functions ----*/
  updatePanelByCheckbox(
    groupControl: string,
    checkboxControl: string,
    coverCode: string,
    i: number
  ): void {
    this.spinnerOverlayService.showLoadOverlay()
    let controlForm: any = this.coverageForm.get(groupControl)?.get(checkboxControl);
    let currentPlans = [
      ...this._store.selectSnapshot((item: any) => item.UserInputState.userInput.step2.mainData),
    ];

    var checkboxValue = controlForm.value;

    if (!checkboxValue) {
      this.accordionErrorHidden = [];
      this.coverageForm?.get(groupControl)?.get('additionalCoverage')?.reset({ value: false });
      this.updateAccordionError(false, i);
      currentPlans = currentPlans.filter((item) => {
        return item.CoverCode != coverCode;
      });
    } else {
      let addedData: { plans: any[] | undefined; coverCode: any } | undefined = {
        coverCode: '',
        plans: undefined,
      };
      if (addedData != undefined) {
        if (addedData.plans != undefined) {
          const recommended = addedData.plans.find(
            (dataPlanX: any) => dataPlanX.recommendedIndicator
          );
          currentPlans.push({
            CoverCode: addedData.coverCode,
            PlanCode: recommended.planCode,
          });
        } else {
          currentPlans.push({
            CoverCode: addedData.coverCode,
          });
        }
      }
    }

    this._store.dispatch(new SET_STEP_2(currentPlans));

    firstValueFrom(this._store.dispatch([new REFRESH_QUOTE(currentPlans)])).then((_) => {
      this.spinnerOverlayService.showLoadOverlay();
      if (_[0].QuoteProgessState.planRecommendation.planRecommendation.components.length != 0) {
        var newPlanRecommendation =
          _[0].QuoteProgessState.planRecommendation.planRecommendation.components;
        if (checkboxValue) {
          var defaultPlan = currentPlans.filter((item) => {
            return item.CoverCode != coverCode;
          });
          var newPlan = newPlanRecommendation.filter((item: { coverCode: string }) => {
            return item.coverCode == coverCode;
          });

          if (newPlan[0].plans != undefined) {
            const recommended = newPlan[0].plans.filter((item: any) => {
              return item.recommendedIndicator;
            });
            defaultPlan.push({
              CoverCode: newPlan[0].coverCode,
              PlanCode: recommended[0].planCode,
            });
          } else {
            defaultPlan.push({
              CoverCode: newPlan[0].coverCode,
            });
          }
          this._store.dispatch(new SET_STEP_2(defaultPlan));
        }
      }
      this.spinnerOverlayService.hideLoadOverlay();
    });
  }

  updateTotalPremiumPayable(event: any, i: number) {
    const selectedData = this._store.selectSnapshot(
      (state: any) => state.UserInputState.userInput.step2.mainData
    );

    let selectedCoverCode = selectedData.filter((item: any) => item.CoverCode == event.coverCode);
    let currentPlans = selectedData.filter((item: any) => item.CoverCode != event.coverCode);
    const recommended = event.additionalCover.filter(
      (additionalCover: any) => additionalCover.selectedIndicator
    );

    let subCoverGrp: any[] = [];
    recommended.find((item: any) => {
      subCoverGrp.push({ SubCoverCode: item.coverCode });
    });

    var pack_data = {
      CoverCode: selectedCoverCode[0].CoverCode,
      PlanCode: selectedCoverCode[0].PlanCode,
      SubCoverGrp: subCoverGrp,
    };
    var output = JSON.parse(JSON.stringify(pack_data));
    currentPlans.push(output);

    this.updateState(currentPlans, i);
  }

  updatePlansPayable(groupControl: string, coverCode: any, newPlan: any, i: number) {
    const coverFromState = this._store.selectSnapshot((item: any) => item.UserInputState.userInput.step2.mainData);
    const planIndex = coverFromState.findIndex((data: any) => data.CoverCode == coverCode);

    let controlForm: any = this.coverageForm.get(groupControl)?.get('additionalCoverage')?.value;
    let subCoverGrp: { SubCoverCode: string; CoverRate: string; }[] = []

    if (controlForm != undefined) {
      Object.entries(controlForm).forEach(([key, value]) => {
        if (value === true) {
          subCoverGrp.push({ SubCoverCode: key, CoverRate: key });
        }
      });
    }

    let userSelect = {};
    if (subCoverGrp.length == 0) {
      userSelect = {
        CoverCode: coverCode,
        PlanCode: newPlan.toString(),
      };
    } else {
      userSelect = {
        CoverCode: coverCode,
        PlanCode: newPlan.toString(),
        SubCoverGrp: subCoverGrp,
      };
    }
    this.updateAccordionError(false, i);

    let userSelectionComponents = [];
    for (var x = 0; x < coverFromState.length; x++) {
      if (x == planIndex) {
        userSelectionComponents.push(userSelect);
      } else {
        userSelectionComponents.push(coverFromState[x]);
      }
    }
    this.updateState(userSelectionComponents, i);
  }

  updateState(currentPlans: any, i?: number) {
    this.spinnerOverlayService.showLoadOverlay();
    this._store.dispatch(new SET_STEP_2(currentPlans));
    this._store.dispatch(new REFRESH_QUOTE(currentPlans));
    this.spinnerOverlayService.hideLoadOverlay();
  }

  updateAccordionError(value: boolean, i: number): void {
    this.accordionErrorHidden[i] = value;

    if (value) {
      this.accordionRefreshRequried = true;
    } else {
      this.accordionRefreshRequried = false;
    }
    this.changeDetectorRef.detectChanges();
  }

  nextCustomerDetails() {
    if (!this.accordionRefreshRequried && this.CheckEligibility()) {
      const coverFromState = this._store.selectSnapshot(
        (item: any) => item.UserInputState.userInput.step2.mainData
      );
      this.spinnerOverlayService.showLoadOverlay();
      this._store.dispatch(new SET_STEP_2(coverFromState));
      this._store.dispatch(new QUOTE_DETAILS());
      this.action$.pipe(ofActionSuccessful(QUOTE_DETAILS)).subscribe(() => {
        this.spinnerOverlayService.hideLoadOverlay();
        this.router.navigate(['/customer-details'], {
          queryParamsHandling: 'preserve',
        });
      });
    } else {
      this.openRefreshRequriedDialog();
    }
  }

  openRefreshRequriedDialog() {
    if (this.accordionRefreshRequried) {
      this.commonErrorDialogHeader = '';
      this.commonErrorDescription = `Please click 'APPLY COVERAGE' to update the quotation and then try again.`;
      this.commonErrorDialog.open();
    }
  }

  formatNewLine(text: string) {
    return text.replace(/[\r\n]/g, '<br />');
  }

}
