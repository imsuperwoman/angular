import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import * as MDL from '../store/model/coverage-details.model';
import { UntypedFormArray, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import quoteForm from '../constants/get-info.constants';
import coveageForm from '../constants/quotation-form.contants';
import vehicleOwnerDetailsForm from '../constants/vehicle-owner-details';
import { FormService } from '@services/form.service';
import { GeneralServiceSelect } from 'module/store/general.service.select';

@Injectable({
  providedIn: 'root',
})
export class QuotationService {
  /*-- Form --*/
  motorComprehensiveForm: UntypedFormGroup = new UntypedFormGroup({});
  coverageForm!: UntypedFormGroup;
  quotationStatic: any;
  quotation: any;

  constructor(private _store: Store,
    private formService: FormService,
    private generalServiceSelect: GeneralServiceSelect) { }

  getQuotation() {
    this.getForm();
    var quotation = this.getCoverageDetails();
    this.updateAdditionalControls(quotation.additionalCoverages);
    this.updateCoverage(quotation)
    this.quotation = quotation;
    return quotation;
  }

  async getQuotations(): Promise<any> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve({
          quotation: this.fetchCoverage(),
        });
      });
    });
  }

  getCoverageDetails() {
    let coverageDetails = {} as MDL.COVERAGE_ITEM;
    var quote$ = this._store.selectSnapshot((state) => state.QuoteProgessState.quote);
    var response = quote$.additionalCover;

    if (response !== undefined) {
      coverageDetails.additionalCoverages = [];

      coverageDetails.additionalCoverages.push({
        formControlName: "roadRangers",
        label: "Road Rangers",
        personelDetails: null,
        popoverMessage: "Allianz Road Rangers is a nationwide motor accident assistance provided free-of-charge to all our Motor Comprehensive (Private Car) policyholders.\n <br><br> Click\n <nx-link><a style=\"color:red;\" class=\"azol__dynamic-table-row-popover-link\" target=\"_blank\" href='https://www.allianz.com.my/road-rangers'>here</a></nx-link>\n to find out more.",
        premium: 0,
        selected: true,
        sumInsuredControlName: null,
        coverCode: '',
        dropdowns: null,
        coverSumInsured: 0
      });
     
      if(quote$.selectedPackageCode=="RP_0100"){
        coverageDetails.additionalCoverages.push({
        formControlName: "RP_0100",
        label: "Rahmah Insurance Initiative",
         personelDetails: null,
        popoverMessage: " Rahmah Insurance Initiative is a complimentary package with the following benefits: <li class='nx-margin-top-m'>Compassionate Flood Cover</li><li>Hospital Income </li> <li>Accidental Death/Permanent Disablement</li>",
        premium: 0,
        selected: true,
        sumInsuredControlName: null,
        coverCode: '',
        dropdowns: null,
        coverSumInsured: 0,
      });
      }
       
      
      //filter azolHiddenInd
      response = response.filter((item: any) => item.azolHiddenInd === 0);

      //sort items by
      var sortlist = this.sortObject(response);

      sortlist.forEach((data: any) => {
        // first Layer
        let accordinsItem = {} as MDL.COVERAGES_ITEM;
        accordinsItem.formControlName = MDL.FG_LIST.get(data.coverCode);
        accordinsItem.label = data.coverName;
        accordinsItem.coverCode = data.coverCode;
        accordinsItem.selected = data.selectedIndicator;
        accordinsItem.premium = data.displayPremium;
        accordinsItem.coverSumInsured = data.coverSumInsured;
        accordinsItem.popoverMessage = data.coverNarration.replace('<a', '<nx-link><a class="azol__dynamic-table-row-popover-link"').replace('</a>', '</a></nx-link>');
        accordinsItem.personelDetails = null;
        // extend to list if more then one
        if (data.coverCode === '97A') {
          accordinsItem.sumInsuredControlName = 'gasConversionSumInsurred';
        }

        var dropdown = MDL.DROPDOWN_LIST.filter((item: any) => item.coverCode === data.coverCode);

        if (dropdown.length > 0) {
          accordinsItem.dropdowns = []
          dropdown.forEach((data: any) => {
            var list = this.generalServiceSelect.selectLovList(data.LovType);
            accordinsItem.dropdowns.push({
              formControlName: data.formControlName,
              label: data.label,
              options: list,
              default: list[0].Code
            })
          });
        }

        if (data.coverOptions !== undefined) {
          var checkbox = MDL.CHECKBOX_LIST.find((item: any) => item.coverCode === data.coverCode);
          if (checkbox !== undefined) {
            accordinsItem.checkboxs = []
            accordinsItem.checkboxs.push({
              formControlName: checkbox.formControlName,
              label: checkbox.label,
              options: data.coverOptions
            })
          }
        }

        coverageDetails.additionalCoverages.push(accordinsItem);
      });
      coverageDetails.additionalCoverages.push({
        formControlName: "additionalDriver",
        label: "Add Additional Driver",
        personelDetails: null,
        popoverMessage: '',
        premium: 0,
        selected: false,
        sumInsuredControlName: null,
        coverCode: 'DRIVER',
        coverSumInsured: 0,
        dropdowns: [
          {
            formControlName: 'additionalDriverAmount',
            label: 'Additional drivers',
            default: 'Unlimited drivers',
            options: [
              {
                Code: 'Unlimited drivers',
                Description: 'Unlimited drivers'
              },
              {
                Code: '2 additional drivers',
                Description: '2 additional drivers'
              },
              {
                Code: '1 additional drivers',
                Description: '1 additional drivers'
              }
            ]
          }
        ],
      }); //End Loop
    }
    return coverageDetails;
  }

  sortObject(obj: any) {
    const arr = Object.keys(obj).map(el => {
      return obj[el];
    });
    arr.sort((a, b) => {
      return a.azolSequence - b.azolSequence;
    });
    return arr;
  };

  /*---- Functions ----*/
  getForm(): void {
    /*---- Form ----*/
    this.motorComprehensiveForm.addControl('quoteForm', quoteForm);
    this.motorComprehensiveForm.addControl('coverageForm', coveageForm);
    this.motorComprehensiveForm.addControl('vehicleOwnerDetailsForm', vehicleOwnerDetailsForm);
    this.coverageForm = this.motorComprehensiveForm.get('coverageForm') as UntypedFormGroup;
  }

  updateAdditionalControls(data: any) {
    var group = this.getFormControl(data);
    this.coverageForm.removeControl('additionalCoverages');
    this.coverageForm.addControl('additionalCoverages', new UntypedFormGroup(group));
    this.formService.updateForms(this.motorComprehensiveForm);
  }

  getFormControl(data: any): any {
    const group: any = {};
    data.find((data: any) => {
      if (data.formControlName === 'roadRangers' || data.formControlName ==='RP_0100') {
        group[data.formControlName] = new UntypedFormControl(true);
      } else {
        group[data.formControlName] = new UntypedFormControl(false);
        if (data.dropdowns) {
          data.dropdowns.forEach((dropdown: any) => {
            group[dropdown.formControlName] = new UntypedFormControl(dropdown.default, Validators.required);
          })
        } else if (data.checkboxs) {
          data.checkboxs.forEach((checkboxs: any) => {
            group[checkboxs.formControlName] = new UntypedFormControl([], Validators.required);
          })
        }
      }
    });
    group['additionalDriverDetails'] = new UntypedFormArray([
      new UntypedFormGroup({
        idType: new UntypedFormControl('NRIC', Validators.required),
        idNo: new UntypedFormControl('', Validators.required)
      })
    ]);
    group['gasConversionSumInsurred'] = new UntypedFormControl('', [Validators.required, Validators.maxLength(5)]);
    return group;
  }

  updateCoverage(value: any): void {
    if (!value) return;
    localStorage.setItem('Coverage', JSON.stringify(value));
  }

  fetchCoverage(): any {
    let value = localStorage.getItem('Coverage');
    if (value) {
      return JSON.parse(value);
    }
  }
}
