import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { HEADER, LOGO, PRODUCT_CAT, SUBHEADER } from '../../../constants/abs-constants';
import { Select, Store } from '@ngxs/store';

import { SET_STEP_2, RESET_STEP, } from '../../../store/actions/user-input.action';
import { GET_QUOTE } from '../../../store/actions/quote-progress.action';
import { QuotationSummaryService } from '../../../services/quotation-summary.service';

import { Router } from '@angular/router';
import { SpinnerOverlayService } from 'module/spinner-overlay/spinner-overlay.service';
import { QuoteProgessState } from '../../../store/states/quote-progress.state';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'quotation',
  templateUrl: './quotation.component.html',
  styleUrls: ['./quotation.component.scss']
})
export class QuotationComponent implements OnInit, AfterViewInit {
  @ViewChild('stepper') stepper: any;

  @Select(QuoteProgessState.quoteInfo) quoteInfo$: any;

  summaries: any = [];

  LOGO: string = LOGO;
  HEADER = HEADER;
  SUBHEADER = SUBHEADER;
  plans: any;
  isSummariesLoading: boolean = false;

  constructor(
    private changeDetectionRef: ChangeDetectorRef,
    private quotationSummaryService: QuotationSummaryService,
    private _store: Store,
    private router: Router,
    private spinnerOverlayService: SpinnerOverlayService,
    private title: Title) {
    this.title.setTitle(HEADER);
  }

  ngOnInit() {
    this.quoteInfo$.subscribe((res: any) => {
      this.plans = res[0].plans
    })
    this.getQuotationSummaryService();
  }

  ngAfterViewInit(): void {
    this.stepper.steps.get(1).select();
    this.changeDetectionRef.detectChanges();
  }

  getQuotationSummaryService(): void {
    this.quotationSummaryService.getSummary().then((data: any) => {
      this.summaries = data;
      this.isSummariesLoading = false;
      this.changeDetectionRef.detectChanges();
    });
  }

  updatePlansPayable(selectedValue: any) {
    this.spinnerOverlayService.showLoadOverlay();
    var PlanList = this._store.selectSnapshot((state) => state.QuoteProgessState.quoteResult.risks.risks[0].plans);
    PlanList.find((plans: any) => {
      if (plans.planCode == selectedValue) {
        var step2 = {
          contractNumber: this._store.selectSnapshot((state) => state.QuoteProgessState.quoteResult.contract.contractNumber),
          partnerId: this._store.selectSnapshot((state) => state.GeneralState.sourceSystem),
          cover: [{
            planCode: selectedValue,
          }]
        }

        this._store.dispatch(new GET_QUOTE(step2, PRODUCT_CAT)).subscribe(async () => {
          this.getQuotationSummaryService();
          this.spinnerOverlayService.hideLoadOverlay();
        });
      }
    })
  }

  proceedNext() {
    var selectedList = this._store.selectSnapshot((state) => state.QuoteProgessState.quoteResult.risks.risks[0].plans);
    var selectedValue = selectedList.find((value: any) => value.selectedIndicator)

    var step2 = {
      contractNumber: this._store.selectSnapshot((state) => state.QuoteProgessState.quoteResult.contract.contractNumber),
      partnerId: this._store.selectSnapshot((state) => state.GeneralState.sourceSystem),
      cover: selectedValue,
    }
    this._store.dispatch(new SET_STEP_2(step2));
    this.router.navigate([localStorage.getItem('path') + '/customer-details'],
      { queryParamsHandling: 'preserve' }
    );
  }

  proceedBack() {
    this._store.dispatch(new RESET_STEP());
    this.router.navigate([localStorage.getItem('path') + '/get-info'],
      { queryParamsHandling: 'preserve' }
    );
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

  formatNewLine(text: string) {
    return text.replace(/[\r\n]/g, '<br />');
  }
}
