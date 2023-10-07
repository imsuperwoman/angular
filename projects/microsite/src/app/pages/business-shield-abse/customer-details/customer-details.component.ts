import { Router } from '@angular/router';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { FORMGROUP, HEADER, LOGO, PRODUCT_CAT, SUBHEADER } from '../../../constants/abs-constants';
import { postCodeValidator } from '@functions/validator.function';
import { GeneralSelectors } from 'module/store/general.selectors';

import { Store, Select } from '@ngxs/store';
import * as moment from 'moment';
import { firstValueFrom, Observable } from 'rxjs';
import { SET_STEP_3 } from '../../../store/actions/user-input.action';
import { QUOTE_PROGRESS, FLOOD_PRONE_AREA } from '../../../store/actions/quote-progress.action';
import { FormService } from '@services/form.service';
import { Title } from '@angular/platform-browser';
import { AddressValidator } from '../../../functions/address.function';
import { nricValidator } from '@functions/validator-nric.function';
@Component({
  selector: 'app-customer-details',
  templateUrl: './customer-details.component.html',
  styleUrls: ['./customer-details.component.scss']
})
export class CustomerDetailsComponent implements OnInit {
  @ViewChild('stepper') stepper: any;

  @Select(GeneralSelectors.selectLov('MOBILEPREFIX')) mobilePrefix$: any;
  @Select(GeneralSelectors.selectLov('BUSINESSIDTYPE')) businessIdType$: any;
  @Select(GeneralSelectors.selectLov('BUSINESSOPERATION')) businessOperationList$: any;
  activePartner$: Observable<any>;

  LOGO: string = LOGO;
  HEADER = HEADER;
  SUBHEADER = SUBHEADER;
  coverageDetails!: FormGroup;
  policyholderDetails!: FormGroup;

  minDate = moment().add(1, 'day');
  maxDate = moment().add(3, 'month').subtract(1, 'day');
  formGroup = FORMGROUP;

  constructor(
    public changeDetectionRef: ChangeDetectorRef,
    private route: Router,
    private _store: Store,
    private formService: FormService,
    private router: Router,
    private title: Title) {
    this.title.setTitle(HEADER);
    this.activePartner$ = this._store.select(state => state.GeneralState.dynamicContent);
  }

  ngOnInit(): void {
    this.policyholderDetails = this.formGroup.get('policyholderDetails') as FormGroup;
    this.coverageDetails = this.formGroup.get('coverageDetails') as FormGroup;
    const formValues = this.formService.getForms();
    if (formValues) {
      this.formGroup.patchValue(formValues);
      if (this.policyholderDetails.valid) {
        this.policyholderDetails.markAsTouched();
      }
    }

    this.policyholderDetails = this.formGroup.get('policyholderDetails') as FormGroup;
    this.coverageDetails = this.formGroup.get('coverageDetails') as FormGroup;
    var postCodeList$ = this._store.selectSnapshot((state) => state.GeneralState.postcodeList);
    this.valueChangesEffectiveDate();
    this.coverageDetails.get('expirydate')?.disable();
    this.policyholderDetails?.get('postcode')?.setValidators([Validators.required, Validators.minLength(5), Validators.maxLength(5), postCodeValidator.bind(this, postCodeList$)]);
    this.policyholderDetails.setValidators(AddressValidator);
    this.policyholderDetails?.get('idNo')?.setValidators(nricValidator.bind(this.policyholderDetails, 17, 80));

  }

  get effectivedate() {
    return this.coverageDetails.get('effectivedate') as FormControl;
  }

  get getIdNo() {
    return this.policyholderDetails.get('idNo') as FormControl;
  }

  get expirydate() {
    return this.coverageDetails.get('expirydate') as FormControl;
  }

  checkoutpage(): void {
    let coverageDetailsValues = this.coverageDetails.getRawValue();
    let policyholderDetailsValues = this.policyholderDetails.getRawValue();

    firstValueFrom(
      this._store.dispatch(
        new SET_STEP_3(
          coverageDetailsValues,
          policyholderDetailsValues
        )
      )
    ).then((_) => {
      this._store.dispatch(new QUOTE_PROGRESS("USERDETAILS", PRODUCT_CAT));
      this.route.navigate([localStorage.getItem('path') + '/checkout'], { queryParamsHandling: 'preserve' });
    });
  }

  ngAfterViewInit(): void {
    this.stepper.steps.get(1).completed = true;
    this.stepper.steps.get(2).select();
    this.changeDetectionRef.detectChanges();
  }

  focusOutPostcode(event: any) {
    var postcode = event.target.value;
    var generalState = this._store.selectSnapshot((state) => state.GeneralState);
    var postcodeList = generalState?.postcodeList;
    var seletedPostcodeObject = postcodeList.find((item: any) => item.Postcode == postcode);
    if (postcode != '') {
      firstValueFrom(this._store.dispatch(new FLOOD_PRONE_AREA(postcode))).then((_) => {
        var state = this._store.selectSnapshot((state) => state?.QuoteProgessState);
        var states = state?.floodProneArea;
        if (states === false) {
          this.policyholderDetails.get('city')?.setValue(seletedPostcodeObject?.CityDescp);
          this.policyholderDetails.get('state')?.setValue(seletedPostcodeObject?.StateDescp);
          this.policyholderDetails.get('city')?.disable();
          this.policyholderDetails.get('state')?.disable();
        }
      });
    }

  }

  valueChangesEffectiveDate() {
    this.effectivedate.valueChanges.subscribe(async (value) => {
      let startDate = moment(value);
      this.coverageDetails.get('expirydate')?.setValue(startDate.add(1, 'year').subtract(1, 'day'));
    });
  }

  proceedBack() {
    this.router.navigate([localStorage.getItem('path') + '/quotation'],
      { queryParamsHandling: 'preserve' }
    );
  }

}




