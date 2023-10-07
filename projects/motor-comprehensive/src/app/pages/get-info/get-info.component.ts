import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, ValidationErrors, Validators } from '@angular/forms';
import { FormService } from '@services/form.service';
import { nricValidator } from '@functions/validator-nric.function';
import { DatePipe } from '@angular/common';
import { NavigationEnd, Router } from '@angular/router';
import { SpinnerOverlayService } from 'module/spinner-overlay/spinner-overlay.service';
import { invalidAlphaNumeric, postCodeValidatorWithoutFloodProne } from '@functions/validator.function';
import { POST_VEHICLE_DETAILS, MO_QUOTE_PROGRESS, MAKE_LIST, PIAM, MODEL_LIST, GET_VALIDATE_ID, GET_AGENT_INFO, GET_VALIDATE_VOUCHER } from '../../store/actions/quote-progress.action';
import { HEADER, LOGO, PRODUCT_CAT, SUBHEADER } from '../../constants/motor-online-constants';
import { QuoteProgessState } from '../../store/states';
import { distinctUntilChanged, filter, firstValueFrom, Observable, Subject, takeUntil } from 'rxjs';
import { MO_SET_STEP_1, MO_SET_STEP_1_SELECTED } from '../../store/actions/user-input.action';
import quoteForm, { MODAL_MESSAGE } from '../../constants/get-info.constants';
import * as moment from 'moment';
import { Select, Store, ActionCompletion, Actions, ofActionCompleted } from '@ngxs/store';
import { GET_DYNAMIC_CONTENT, GET_POSTAL_CODES, GET_PRODUCT_CONFIG, GET_SOURCE_SYSTEM } from 'module/store/general.action';
import { GeneralSelectors } from 'module/store/general.selectors';
import { showChatBot } from '@functions/chatBot.function';
import { NxDialogService, NxModalRef } from '@aposin/ng-aquila/modal';
import { ServerTimeoutDialogComponent } from 'module/server-timeout-dialog/server-timeout-dialog.component';

@Component({
  selector: 'app-get-info',
  templateUrl: './get-info.component.html',
  styleUrls: ['./get-info.component.scss'],
  providers: [DatePipe],
})
export class GetInfoComponent implements OnInit, OnDestroy {
  LOGO: string = LOGO;
  HEADER = HEADER;
  SUBHEADER = SUBHEADER;
  templateDialogRef?: NxModalRef<any>;
  /*--  Modal Dialog --*/
  @ViewChild('leaveMyDetailsDialog') leaveMyDetailsDialog: any;
  @ViewChild('commonErrorDialog') commonErrorDialog: any;
  @ViewChild('template') templateRef!: TemplateRef<any>;
  activeDialogRef!: NxModalRef<any>;

  commonErrorDialogHeader = "";
  commonErrorDescription = MODAL_MESSAGE.motorcycleDialogDescription;

  /*-- Form --*/
  motorComprehensiveForm: UntypedFormGroup = new UntypedFormGroup({});
  quoteForm!: UntypedFormGroup;
  acknowledgement = true;
  /*---- Params ----*/
  activePartner: any = false;

  /*---- From Store ----*/
  @Select(GeneralSelectors.selectLov('CUSTIDTYPE')) custIDType$: any;
  @Select(QuoteProgessState.documentData) documentData$: any;
  @Select(GeneralSelectors.flowType) flowType$: any;
  @Select(GeneralSelectors.sourceSystem) sourceSystem$: any;
  activePartner$: Observable<any>;
  screenRefresh = false;
  flowSelected: any;
  bannerData$: any;
  isAgentSelected: boolean = false;
  isDirectSelected: boolean = false;

  private ngUnsubscribe = new Subject<void>();

  constructor(
    private formService: FormService,
    public datepipe: DatePipe,
    private router: Router,
    private spinnerOverlayService: SpinnerOverlayService,
    private changeDetectionRef: ChangeDetectorRef,
    private _store: Store,
    private action$: Actions,
    public dialogService: NxDialogService,
  ) {
    this.router.events
      .pipe(filter((rs): rs is NavigationEnd => rs instanceof NavigationEnd))
      .subscribe(event => {
        if (
          event.id === 1 &&
          event.url === event.urlAfterRedirects
        ) {
          this.screenRefresh = true;
          window.localStorage.clear();
        }
      })
    this.activePartner$ = this._store.select(state => state.GeneralState.dynamicContent);
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  ngOnInit(): void {
    // To patch form value from local storage on load
    this.motorComprehensiveForm.addControl('quoteForm', quoteForm);
    const formValues = this.formService.getForms();
    if (formValues) this.motorComprehensiveForm.patchValue(formValues);

    this.quoteForm = this.motorComprehensiveForm?.get('quoteForm') as UntypedFormGroup;

    //  Update form service when there is changes in value
    this.motorComprehensiveForm.valueChanges.subscribe((values: any) => {
      this.formService.updateForms(this.motorComprehensiveForm);
    });

    var generalState = this._store.selectSnapshot(
      (state) => state.GeneralState
    )

    this.quoteForm.valueChanges
      .pipe(distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)))
      .subscribe(() => {
        if (this.quoteForm.valid) {
          if (generalState.customViewObj.utm_source === 'POSMAL') {
            this.acknowledgement = true;
            this.quoteForm?.addControl('acknowledgement', new UntypedFormControl(false));
            this.changeDetectionRef.detectChanges();
          }
        }
      });

    this.quoteForm?.get('idNo')?.setValidators(nricValidator.bind(this.quoteForm, 16, 120));
    this.quoteForm?.get('vehicleType')?.setValidators(this.vehicleTypeValidator.bind(this));
    var postCodeList$ = this._store.selectSnapshot((state) => state.GeneralState.postcodeList);
    this.quoteForm?.get('plateNumber')?.setValidators([Validators.required, invalidAlphaNumeric.bind(this)]);
    this.quoteForm?.get('postcode')?.setValidators([Validators.required, postCodeValidatorWithoutFloodProne.bind(this, postCodeList$)]);
    //To integrate with Store or else will have error

    firstValueFrom(this._store.dispatch(new GET_POSTAL_CODES())).then((_) => {
      var postCodeList$ = this._store.selectSnapshot((state) => state.GeneralState.postcodeList);
      this.quoteForm?.get('postcode')?.setValidators([Validators.required, postCodeValidatorWithoutFloodProne.bind(this, postCodeList$)]);
      var productConfig = this._store.selectSnapshot((state) => state.GeneralState.productConfig);
      showChatBot(productConfig?.chatbotInd);
    })

    this.action$
      .pipe(ofActionCompleted(GET_DYNAMIC_CONTENT, GET_POSTAL_CODES, GET_AGENT_INFO), takeUntil(this.ngUnsubscribe))
      .subscribe((data: ActionCompletion) => {
        if (data.result.error) {
          //handle mulitple popup
          this.spinnerOverlayService.hideLoadOverlay();
          if (this.activeDialogRef == undefined) {
            this.activeDialogRef = this.dialogService.open(ServerTimeoutDialogComponent, {
              showCloseIcon: true,
              data: { refreshPage: true },
            });
          }
          // in case timeout again
          else if (this.activeDialogRef.getState() == 2) {
            this.spinnerOverlayService.hideLoadOverlay();
            this.activeDialogRef = this.dialogService.open(ServerTimeoutDialogComponent, {
              showCloseIcon: true,
              data: { refreshPage: true },
            });
          }
        } else if (data.result.successful) {
          this.getActivePartner();
          this.spinnerOverlayService.hideLoadOverlay();
        }
      });

    this.action$
      .pipe(ofActionCompleted(MO_QUOTE_PROGRESS, POST_VEHICLE_DETAILS, GET_VALIDATE_ID, MAKE_LIST, PIAM, MODEL_LIST),
        takeUntil(this.ngUnsubscribe))
      .subscribe((data: ActionCompletion) => {
        if (data.result.error) {
          //handle mulitple popup
          this.spinnerOverlayService.hideLoadOverlay();
          if (this.activeDialogRef == undefined) {
            this.activeDialogRef = this.dialogService.open(ServerTimeoutDialogComponent, {
              showCloseIcon: true,
              data: { refreshPage: false },
            });
          }
          // in case timeout again
          else if (this.activeDialogRef.getState() == 2) {
            this.spinnerOverlayService.hideLoadOverlay();
            this.activeDialogRef = this.dialogService.open(ServerTimeoutDialogComponent, {
              showCloseIcon: true,
              data: { refreshPage: false },
            });
          }
        }
      });
    this.getActivePartner();
  }

  getActivePartner() {
    var generalState = this._store.selectSnapshot((state) => state.GeneralState);
    this.bannerData$ = generalState.dynamicContent?.Header?.contents?.custCollFields?.promo?.MT;
    if (generalState.customViewObj.utm_source != undefined) {
      this.activePartner = true;
      if (generalState.customViewObj.utm_source === 'POSMAL' ||
        generalState.flowType === 'STAFFR' || generalState.flowType === "REFERRAL") {
        if (!this.quoteForm?.get('acknowledgement')?.value) {
          this.acknowledgement = false;
          (this.motorComprehensiveForm?.get('quoteForm') as UntypedFormGroup).removeControl(
            'acknowledgement'
          );
        } else {
          this.acknowledgement = true;
          this.quoteForm?.addControl('acknowledgement', new UntypedFormControl(false));
        }
      }
    } else {
      if (generalState.flowType === 'DIRECT') {
        if (!this.quoteForm?.get('acknowledgement')?.value) {
          this.acknowledgement = false;
          (this.motorComprehensiveForm?.get('quoteForm') as UntypedFormGroup).removeControl(
            'acknowledgement'
          );
        }
      }
    }
  }
  get acknowledgementControlValue(): boolean {
    if (this.quoteForm.get('acknowledgement')?.value === undefined) {
      return true;
    }
    return this.quoteForm.get('acknowledgement')?.value
  }
  //Avoid special characters and spaces key in
  onKeyPress(event?: any) {
    let e = event.keyCode;
    let specialChars = [62, 33, 36, 64, 35, 37, 94, 38, 42, 40, 41, 32];

    if (specialChars.includes(e)) {
      event.preventDefault();
    } else {
      return;
    }
  }

  vehicleTypeValidator(): ValidationErrors | null {
    let value = this.quoteForm.get('vehicleType')?.value;
    let control = this.quoteForm.get('vehicleType');

    if (value === '') {
      control?.setErrors({ required: true });
    } else if (value === 'motorcycle') {
      control?.setErrors({ invalidValue: true });
    } else {
      control?.setErrors(null);
    }

    if (control?.getError('required')) {
      return { type: 'required', message: 'This field is required.' };
    } else if (control?.getError('invalidValue')) {
      this.commonErrorDialog.open();
    }
    return null;
  }

  idTypeChange() {
    this.quoteForm.get('idNo')?.setValue('');
    this.quoteForm.get('idNo')?.markAsUntouched();
    this.quoteForm.get('dob')?.setValue('');
    this.quoteForm.get('dob')?.markAsUntouched();
    this.quoteForm.get('gender')?.setValue('');
    this.quoteForm.get('gender')?.markAsUntouched();
  }

  customerValidation() {
    let formValue = this.quoteForm.getRawValue();

    var generalState = this._store.selectSnapshot((state) => state.GeneralState);
    if (formValue.vehicleType === 'car') {
      this._store.dispatch(new MO_SET_STEP_1(formValue));
      if (generalState.sourceSystem === 'STAFFR') {
        firstValueFrom(this._store.dispatch(new GET_VALIDATE_ID(formValue))).then((res: any) => {
          var response = res.QuoteProgessState.staffResult;
          if (response) {
            this.getVechilesDetail();
          } else {
            firstValueFrom(this._store.dispatch(new GET_AGENT_INFO())).then((_) => {
              this.processNext();
            });
          }
        })
      } else {
        this.getVechilesDetail();
      }
    } else {
      this.commonErrorDialog.open();
      this.spinnerOverlayService.hideLoadOverlay();
    }
  }

  getVechilesDetail() {
    this.spinnerOverlayService.showLoadOverlay();
    var generalState = this._store.selectSnapshot((state) => state.GeneralState);
    if (generalState.sourceSystem === 'STAFFR') {
      firstValueFrom(this._store.dispatch(new GET_VALIDATE_VOUCHER())).then((res: any) => {
        this.spinnerOverlayService.hideLoadOverlay();
        var response = res.QuoteProgessState.staffResult;
        if (response) {
          this.processNext();
        } else {
          this.commonErrorDescription = MODAL_MESSAGE.staffErrorDescription;
          this.commonErrorDialog.open();
        }
      })
    } else {
      this.processNext();
    }
  }
  processNext() {
    let formValue = this.quoteForm.getRawValue();
    var closeButton = false;
    this.spinnerOverlayService.showLoadOverlay();

    this._store.dispatch(new POST_VEHICLE_DETAILS(formValue)).subscribe((res) => {
      var response = res.QuoteProgessState.vehicleDetails;
      const { UBBStatus, errors, nvicList } = response;
      const nvicResult = nvicList !== undefined ? [nvicList] : [];

      this.spinnerOverlayService.hideLoadOverlay();

      //console.log(UBBStatus + " " + errors + " " + nvicResult);
      if (UBBStatus === undefined && errors === undefined && nvicResult[0].length > 0) {
        this._store.dispatch(new MO_QUOTE_PROGRESS('GETINFO', 1, '')).subscribe(
          () => {
            this._store.dispatch(new MAKE_LIST()).subscribe((_) => {
              this._store.dispatch(new PIAM()).subscribe((_) => {
                this._store.dispatch(new MODEL_LIST()).subscribe((_) => {
                  this.router.navigate(['/vehicle-owner-details'], {
                    queryParamsHandling: 'preserve',
                  });
                });
              });
            });
          });
      }
      else
        if (UBBStatus) {
          const { ReferRiskList } = response.UBBStatus;
          const { ReferCode } = ReferRiskList[0];

          switch (ReferCode) {
            case 'UBBE001':  // policy expired 
            case 'UBBE001R': //  policy expired partner
              if (this.activePartner) {
                this.commonErrorDescription = MODAL_MESSAGE.UBBE001DialogDescription.replace(
                  '##expiredDate##',
                  moment(response.prevPolExpiryDate).format('DD/MM/YYYY')
                );
              } else {
                this.commonErrorDescription = MODAL_MESSAGE.UBBE001DirectDialogDescription.replace(
                  '##expiredDate##',
                  moment(response.prevPolExpiryDate).format('DD/MM/YYYY')
                );
              }
              break;
            case 'UBBE002':  // Policy Date Checking
            case 'UBBE002R': //  Policy Date Checking partner
              this.commonErrorDescription = MODAL_MESSAGE.UBBE002DialogDescription.replace(
                '##expiredDate##',
                moment(response.prevPolExpiryDate).format('DD/MM/YYYY')
              ).replace(
                '##renewDay##',
                moment(response.prevPolExpiryDate).add(-90, 'day').format('DD/MM/YYYY')
              );
              closeButton = true;
              break;
            default: //RP007
              this.commonErrorMessage();
          }
          this.openDialog(closeButton);
        }
        else {
          if (errors) {
            if (response?.errors[0].startsWith('Error in IDNo1 or IDNo2, or ID does not match.')) {
              this.commonErrorDescription = MODAL_MESSAGE.incorrectIdDialogDescription.replace(
                '##idNo##',
                formValue.idNo
              );
              closeButton = true;
            }
            else if (response?.errors[0].startsWith('NCD confirmation is unavailable as confirmation has already been taken earlier.')) {
              this.commonErrorDescription = MODAL_MESSAGE.renewedDialogDescription;
              closeButton = true;
            }
            else if (response?.errors[0].startsWith('No NCD granted')) {
              if (!this.activePartner) {
                this.commonErrorDescription = MODAL_MESSAGE.claimingAgentErrorDescription;
              } else {
                this.commonErrorDescription = MODAL_MESSAGE.claimingDialogDescription;
              }
            }
            else {
              this.commonErrorMessage();
            }
          }
          else {
            this.commonErrorMessage();
          }
          this.openDialog(closeButton);
        }
    });
  }

  openDialog(closeButton: boolean): void {
    if (!this.activePartner) {
      this.commonErrorDialog.open();
    } else {
      if (!closeButton) {
        this.leaveMyDetailsDialog.open();
      } else {
        this.commonErrorDialog.open();
      }
    }
  }

  commonErrorMessage() {
    if (this.activePartner) {
      this.commonErrorDescription = MODAL_MESSAGE.commonErrorDescription;
    } else {
      this.commonErrorDescription = MODAL_MESSAGE.commonDirectErrorDescription;
    }
  }

  ngAfterViewInit() {
    var userInput = this._store.selectSnapshot((state) => state.UserInputState.userInput);

    this.flowType$.subscribe((value: any) => {
      if (value == 'DIRECT' && userInput.selected == '' || value == 'STAFFR') {
        this.acknowledgement = false;
        if (value == 'DIRECT' && userInput.selected == '') {
          this.templateDialogRef = this.dialogService.open(this.templateRef, {
            showCloseIcon: false,
            width: '940px',
            disableClose: true
          });
        }
      }
    })
  }

  closeTemplateDialog() {
    this.templateDialogRef?.close();
  }

  handleChange(flow: string) {
    if (flow === 'agent') {
      this.isDirectSelected = false;
      this.isAgentSelected = !this.isAgentSelected;
      this._store.dispatch(new MO_SET_STEP_1_SELECTED('agent'));
    } else {
      this.isDirectSelected = !this.isDirectSelected;
      this.isAgentSelected = false;
      this._store.dispatch(new MO_SET_STEP_1_SELECTED('direct'));
    }

  }
}

