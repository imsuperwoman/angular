import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { HEADER } from '../constants/abs-constants';

@Injectable({
  providedIn: 'root',
})
export class QuotationSummaryService {
  constructor(private _store: Store) { }

  async getSummary(): Promise<any> {
    var quote$ = this._store.selectSnapshot((state: any) => state.QuoteProgessState.quoteResult);
    var selected = quote$.risks.risks[0].plans.find((plan: any) => plan.selectedIndicator === true)

    let summary = {
      planBreakdown: [{ label: 'Reference no.', type: 'string', value: quote$.contract.contractNumber }],
      costBreakdown: [{
        header: null,
        items: [
          {
            type: 'currency',
            label: selected.planDescription,
            value: selected.premium.premiumDueRounded,
          },
        ],
      }],
      costSummaries: [
        {
          header: null,
          items: [
            {
              type: 'currency',
              label: 'Premium due',
              value: quote$.premium.annualPremium,
            },
          ],
        }],
      premiumPayable: quote$.premium.premiumDueRounded,
    }
    summary.planBreakdown.push({ label: 'Product', type: 'string', value: HEADER });
    summary.planBreakdown.push({ label: 'Period of insurance', type: 'string', value: '1 year' });

    summary.costSummaries.push({
      header: null,
      items: [
        {
          type: 'currency',
          label: 'Service tax (6%)',
          value: quote$.premium.serviceTaxAmount,
        }]
    });

    summary.costSummaries.push({
      header: null,
      items: [
        {
          type: 'currency',
          label: 'Stamp Duty',
          value: quote$.premium.stampDuty,
        }]
    });

    this.updateSummary(summary)
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(summary);
      }, 100
      );
    });
  }

  updateSummary(value: any): void {
    if (!value) return;
    sessionStorage.setItem('quotationSummary', JSON.stringify(value));
  }

  fetchSummary(): any {
    let value = sessionStorage.getItem('quotationSummary');
    if (value) {
      return JSON.parse(value);
    }
  }
}
