import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';

@Injectable({
  providedIn: 'root',
})
export class QuotationSummaryService {
  constructor(private _store: Store) { }

  async getSummary(): Promise<any> {
    var quote$ = this._store.selectSnapshot((state) => state.QuoteProgessState.quote);
    var userInput$ = this._store.selectSnapshot((state) => state.UserInputState.userInput);

    let summary = {
      planBreakdown: [{ label: 'Reference no.', type: 'string', value: quote$.contract.contractNumber }],
      costBreakdown: [{
        header: '', items: [{
          type: 'currency',
          label: 'Basic premium',
          value: quote$.premium.basicAnnualPremium
        }, {
          type: 'currencyNegative',
          label: '[Less NCD - ' + (quote$.premium ? quote$.premium.ncdPct : 0) + '%]',
          value: quote$.premium.ncdAmt
        }]
      }],
      costSummaries: [
        {
          header: null,
          items: [
            {
              type: 'currency',
              label: 'Premium due',
              value: quote$.premium.grossPremium,
            },
          ],
        }], premiumPayable: quote$.premium.premiumDueRounded,
      commissionAmount: quote$.premium.commissionAmount,
      purchaseNote: '',
      purchaseNotePopoverMsg:
        'Excess is the first amount that you are required to pay towards a claim you make on your car.',
      additionalPartnerPurchaseNote: ""
    }
    summary.planBreakdown.push({ label: 'Product', type: 'string', value: 'Motor Comprehensive' });
    summary.planBreakdown.push({ label: 'Period of insurance', type: 'string', value: userInput$.step2.insurancePeriod });

    summary.costBreakdown.push({
      header: 'Additional coverage', items: []
    });

    summary.costSummaries.push({
      header: null,
      items: [
        {
          type: 'currency',
          label: 'Service tax (6%)',
          value: quote$.premium.serviceTaxAmount,
        }]
    });
    if (quote$.premium.rebateAmt) {
      summary.costSummaries.push({
        header: null,
        items: [
          {
            type: 'currencyNegative',
            label: '[Rebate]',
            value: quote$.premium.rebateAmt,
          }]
      });
    }

    summary.costSummaries.push({
      header: null,
      items: [
        {
          type: 'currency',
          label: 'Stamp Duty',
          value: quote$.premium.stampDuty,
        }]
    });

    var generalState = this._store.selectSnapshot((state) => state.GeneralState);
    var excessAmount = quote$.premium.excessAmount ? quote$.premium.excessAmount : 0;

    if (generalState.flowType === 'STAFFR' || generalState.flowType === "REFERRAL") {
      summary.additionalPartnerPurchaseNote = '';
      summary.purchaseNote = `*Excess of RM ${excessAmount} is applicable.`
    } else {
      var agent = generalState.dynamicContent.PartnerName !== undefined ? generalState.dynamicContent.PartnerName : 'agent';
      if (generalState.flowType === 'DIRECT') {
        summary.purchaseNote = ``
        agent = 'agent';
      } else {
        summary.purchaseNote = `*Excess of RM ${excessAmount} is applicable.`
      }
      summary.additionalPartnerPurchaseNote = `*10% of Commission amounting to RM ${quote$.premium.commissionAmount.toFixed(2)} is payable to ${agent}`;
    }

    this.updateSummary(summary)
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(summary);
      }, 100
      );
    });
  }

  updateSummary(value: any): void {
    if (!value) return;
    localStorage.setItem('quotationSummary', JSON.stringify(value));
  }

  fetchSummary(): any {
    let value = localStorage.getItem('quotationSummary');
    if (value) {
      return JSON.parse(value);
    }
  }
}
