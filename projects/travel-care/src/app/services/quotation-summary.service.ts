import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { GeneralService } from './general.service';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root',
})
export class QuotationSummaryService {

  sportFMLabel: any = [];

  constructor(private _store: Store,
    public generalService: GeneralService) { }

  async getSummary(isPomo: boolean): Promise<any> {

    var HEADER = this.generalService.getConfig().HEADER;
    var premiumList = this._store.selectSnapshot((state: any) => state.QuoteProgessState.planRecommendation.planRecommendation.premiumList);
    var quoteDetails = this._store.selectSnapshot((state: any) => state.QuoteProgessState.planRecommendation.quoteDetails.Result);
    var period = moment(quoteDetails.EffectiveDate).format('DD/MM/YYYY') + " to\n " + moment(quoteDetails.ExpiryDate).format('DD/MM/YYYY');
    var step1 = this._store.selectSnapshot((state) => state.UserInputState.userInput.step1);
    var step2 = this._store.selectSnapshot((state) => state.UserInputState.userInput.step2);
    var summary = this.formatSummary(isPomo);

    var sportArr: any = [];
    var mountArr: any = [];
    var sportsPremium = premiumList.filter((s: any) => s.premium.sportsPremium);

    if (step2.sportsCoverage?.sportsCoverageCheck && sportsPremium.length > 0) {
      sportArr = this.sportsCoverage(step1, premiumList);
    }

    var mountaineeringPremium = premiumList.filter((s: any) => s.premium.mountaineeringPremium);
    if (step2.mountaineeringCoverage?.mountaineeringCoverageCheck && mountaineeringPremium.length > 0) {
      mountArr = this.mountCoverage(premiumList);
    }

    const addArr = [...sportArr, ...mountArr];
    if (addArr.length > 0) {
      var additionalCoverage = { header: 'Additional Coverage', items: addArr };
      summary.costBreakdown.push(additionalCoverage)
    }
    summary.planBreakdown.push({ label: 'Product', type: 'string', value: HEADER });
    summary.planBreakdown.push({ label: 'Period of insurance', type: 'string', value: period });
    summary = this.formatCostSummaries(isPomo, summary)

    this.updateSummary(summary)
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(summary);
      }, 100
      );
    });
  }

  formatSummary(isPomo: boolean) {
    var contract = this._store.selectSnapshot((state: any) => state.QuoteProgessState.planRecommendation.planRecommendation.contract);
    var step1 = this._store.selectSnapshot((state) => state.UserInputState.userInput.step1);
    var premium, premiumList, costBreakdown, summary, prePremium;

    if (!isPomo) {
      premium = this._store.selectSnapshot((state: any) => state.QuoteProgessState.planRecommendation.planRecommendation.premium);
      premiumList = this._store.selectSnapshot((state: any) => state.QuoteProgessState.planRecommendation.planRecommendation.premiumList);
      costBreakdown = this.costBreakdown(step1, premiumList);
    } else {
      prePremium = this._store.selectSnapshot((state: any) => state.QuoteProgessState.planRecommendation.planRecommendation.premium);
      premium = this._store.selectSnapshot((state: any) => state.QuoteProgessState.pomoPlanRecommendation.planRecommendation.premium);
      premiumList = this._store.selectSnapshot((state: any) => state.QuoteProgessState.pomoPlanRecommendation.planRecommendation.premiumList);
      costBreakdown = this.costBreakdown(step1, premiumList);
    }

    if (!isPomo) {
      summary = {
        planBreakdown: [{ label: 'Reference no.', type: 'string', value: contract.contractNumber }],
        costBreakdown: [costBreakdown],
        costSummaries: [
          {
            header: null,
            items: [
              {
                type: 'currency',
                label: 'Premium due',
                value: premium.grossPremium,
              },
            ],
          }
        ],
        premiumPayable: premium.premiumDueRounded,
      }
    } else {
      let items = [];
      if (premium.promoCode) {
        items.push({ type: 'currencyNegative', label: '[' + premium.promoCode + "]", value: premium.promoAmount })
      }

      let promoList = premiumList.filter((data: any) => data.premium?.promoCode)

      promoList.forEach((element: any) => {
        items.push({
          type: 'currencyNegative', label: '[' + element.premium.promoCode + "]",
          value: element.premium.promoAmount
        })
      });

      summary = {
        planBreakdown: [{ label: 'Reference no.', type: 'string', value: contract.contractNumber }],
        costBreakdown: [costBreakdown],
        costSummaries: [
          {
            header: null,
            items: [
              {
                type: 'currency',
                label: 'Premium due',
                value: prePremium.grossPremium,
              },
            ],
          },
          {
            header: "Promo code applied",
            items: items
          },
          {
            header: null,
            items: [
              {
                type: 'currency',
                label: 'Premium Due after Promo Code',
                value: premium.grossPremium,
              },
            ],
          },
        ],
        premiumPayable: premium.premiumDueRounded,
      }
    }
    return summary;
  }


  formatCostSummaries(isPomo: boolean, summary: any) {
    var premium;
    if (!isPomo) {
      premium = this._store.selectSnapshot((state: any) => state.QuoteProgessState.planRecommendation.planRecommendation.premium);
    } else {
      premium = this._store.selectSnapshot((state: any) => state.QuoteProgessState.pomoPlanRecommendation.planRecommendation.premium);
    }

    if (Number(premium.serviceTaxAmount) > 0) {
      summary.costSummaries.push({
        header: null,
        items: [
          {
            type: 'currency',
            label: 'Service tax (6%)',
            value: premium.serviceTaxAmount,
          }]
      });
    }
    if (premium.rebateAmt) {
      summary.costSummaries.push({
        header: null,
        items: [
          {
            type: 'currencyNegative',
            label: '[Rebate]',
            value: premium.rebateAmt,
          }]
      });
    }
    summary.costSummaries.push({
      header: null,
      items: [
        {
          type: 'currency',
          label: 'Stamp duty',
          value: premium.stampDuty,
        }]
    });

    return summary;
  }

  packageLabel(step1: any) {
    if (step1) {
      const coverageType: { [key: string]: null } = {
        AN: <any>"Annual",
        OW: <any>"One Way",
        TW: <any>"Two Way"
      };
      const destination: { [key: string]: null } = {
        ASI: <any>"Asia",
        DOM: <any>"Domestic",
        WRW1: <any>"Worldwide"
      }
      const travelWith: { [key: string]: null } = {
        FM: <any>"Family",
        MS: <any>"Individual",
        MT: <any>"Multiple Travellers"
      }
      return `${travelWith[step1.trgrpcode]} (${coverageType[step1.coveragetype]} - ${destination[step1.trdestination]})`;
    }
    return 'N/A';
  }

  costBreakdown(step1: any, premiumList: any) {
    var label = this.packageLabel(step1);
    if (step1.trgrpcode == "MS") {
      var sportsPremium = premiumList[0].premium?.sportsPremium ? premiumList[0].premium?.sportsPremium : 0;
      return {
        header: '', items: [{
          type: 'currency',
          label: label,
          value: this.adultsPremium()
        }]
      }
    } else {
      var occurences = premiumList.reduce(function (r: any, row: any) {
        r[row.ageRange] = ++r[row.ageRange] || 1;
        return r;
      }, {});

      var result = Object.keys(occurences).map(function (key) {
        return { key: key, value: occurences[key] };
      });

      this.sportFMLabel = []

      const sortedArray = [...result]
        .sort((n1, n2) => {
          if (n1.key > n2.key) { return 1; }
          if (n1.key < n2.key) { return -1; }
          return 0;
        });

      let item: any = [];
      if (step1.trgrpcode == "MT") {
        sortedArray.forEach((x) => {
          var grossPremium = premiumList.find((pl: any) => pl.ageRange === x.key);
          var sportsPremium = grossPremium.premium?.sportsPremium ? grossPremium.premium?.sportsPremium : 0;
          var premium = grossPremium.premium.grossPremium - sportsPremium;

          this.sportFMLabel.push(x.value + ' ' + this.getKeyLabel(x.value, x?.key));
          if (x.key !== null) {
            item.push({
              type: 'currency',
              label: x.value + ' ' + this.getKeyLabel(x.value, x?.key),
              value: (premium) * parseInt(x.value)
            })
          }
        })
        return { header: label, items: item };
      } else {
        var grossPremium = premiumList.find((pl: any) => pl.insuredType === 'P');
        var sportsPremium = grossPremium.premium?.sportsPremium ? grossPremium.premium?.sportsPremium : 0;
        var premiumFM = grossPremium.premium.grossPremium - sportsPremium;
        item.push({
          type: 'currency',
          label: label,
          value: premiumFM
        })

        sortedArray.forEach((x) => {
          this.sportFMLabel.push(x.value + ' ' + this.getKeyLabel(x.value, x?.key));
          if (x.key !== null) {
            item.push({
              type: 'currency',
              label: x.value + ' ' + this.getKeyLabel(x.value, x?.key),
              value: ''
            })
          }
        })
        return { header: '', items: item };
      }
    }
  }

  adultsPremium() {
    var premiumList = this._store.selectSnapshot((state: any) => state.QuoteProgessState.planRecommendation.planRecommendation.premiumList);
    var step1 = this._store.selectSnapshot((state) => state.UserInputState.userInput.step1);

    if (premiumList && premiumList.length > 0) {
      if (step1.trgrpcode == "MS") {
        const grossPremium = premiumList.filter((item: any) => item.ageRange == 'A'
          || item.ageRange == 'C'
          || item.ageRange == 'S'
        ).map((item: any) => {
          let _value = item.premium.grossPremium;

          if (item.premium.sportsPremium) {
            _value -= item.premium.sportsPremium;
          }

          if (item.premium.mountaineeringPremium) {
            _value -= item.premium.mountaineeringPremium;
          }
          return _value;
        });
        if (grossPremium.length > 0) {
          return grossPremium.reduce((a: any, b: any) => a + b, 0);
        } else {
          return 0;
        }
      } else {
        const grossPremium = premiumList.filter((item: any) => item.ageRange == 'A'
        ).map((item: any) => {
          let _value = item.premium.grossPremium;

          if (item.premium.sportsPremium) {
            _value -= item.premium.sportsPremium;
          }

          if (item.premium.mountaineeringPremium) {
            _value -= item.premium.mountaineeringPremium;
          }
          return _value;
        });
        if (grossPremium.length > 0) {
          return grossPremium.reduce((a: any, b: any) => a + b, 0);
        } else {
          return 0;
        }
      }
    }
    return 0;
  }

  sportsCoverage(step1: any, premiumList: any) {
    var sportsPremium = premiumList.filter((s: any) => s.premium.sportsPremium);
    var occurences = sportsPremium.reduce(function (r: any, row: any) {
      r[row.ageRange] = ++r[row.ageRange] || 1;
      return r;
    }, {});

    var result = Object.keys(occurences).map(function (key) {
      return { key: key, value: occurences[key] };
    });

    const sortedArray = [...result]
      .sort((n1, n2) => {
        if (n1.key > n2.key) { return 1; }
        if (n1.key < n2.key) { return -1; }
        return 0;
      });

    let item: any = [];
    if (step1.trgrpcode == "MS") {
      sortedArray.forEach((x) => {
        var grossPremium = premiumList.find((pl: any) => pl.ageRange === x.key);
        if (x.key !== null) {
          item.push({
            type: 'currency',
            label: "Sports Insurance",
            value: grossPremium.premium.sportsPremium * parseInt(x.value)
          })
        }
      })
    } else if (step1.trgrpcode == "FM") {
      var label = '';
      if (this.sportFMLabel[1]) {
        label = "(" + this.sportFMLabel[0] + " , " + this.sportFMLabel[1] + ")";
      } else {
        label = "(" + this.sportFMLabel[0] + ")";
      }
      item.push({
        type: 'currency',
        label: "Sports Insurance",
        value: ''
      })
      sortedArray.forEach((x) => {
        var grossPremium = premiumList.find((pl: any) => pl.ageRange === x.key);
        if (x.key !== null) {
          item.push({
            type: 'currency',
            label: label,
            value: grossPremium.premium.sportsPremium * parseInt(x.value)
          })
        }
      })
    } else if (step1.trgrpcode == "MT") {
      var labelMT: any = [];
      var sportsPremiumMT: any = [];
      for (var key in occurences) {
        labelMT.push(occurences[key] + '  ' + this.getKeyLabel(occurences[key], key));
      }
      var label = '';
      if (labelMT.length == 1) {
        label = "(" + labelMT[0] + ")";
      } else {
        label = "(" + labelMT[0] + " , " + labelMT[1] + ")";
      }

      item.push({
        type: 'currency',
        label: "Sports Insurance",
        value: ''
      })
      sortedArray.forEach((x) => {
        var grossPremium = premiumList.find((pl: any) => pl.ageRange === x.key && pl.premium.sportsPremium);
        if (x.key !== null) {
          sportsPremiumMT.push(
            grossPremium.premium.sportsPremium * parseInt(x.value)
          )
        }
      })
      var sportsPremiumMTTotal: number = 0;
      for (var key in sportsPremiumMT) {
        sportsPremiumMTTotal += parseInt(sportsPremiumMT[key]);
      }

      item.push({
        type: 'currency',
        label: label,
        value: sportsPremiumMTTotal
      })

    }
    return item;
  }

  mountCoverage(premiumList: any) {
    var mountaineeringPremium = premiumList.filter((s: any) => s.premium.mountaineeringPremium);
    var occurences = mountaineeringPremium.reduce(function (r: any, row: any) {
      r[row.ageRange] = ++r[row.ageRange] || 1;
      return r;
    }, {});

    var labelMT: any = [];
    var mountPremiumMT: any = [];
    for (var key in occurences) {
      labelMT.push(occurences[key] + '  ' + this.getKeyLabel(occurences[key], key));
    }
    var label = '';
    if (labelMT.length == 1) {
      label = "(" + labelMT[0] + ")";
    } else {
      label = "(" + labelMT[0] + " , " + labelMT[1] + ")";
    }
    let item: any = [];
    item.push({
      type: 'currency',
      label: "High Altitude Mountaineering",
      value: ''
    })
    var index = 0;
    mountaineeringPremium.forEach((x: any) => {
      var grossPremium = mountaineeringPremium[index].premium.mountaineeringPremium;
      mountPremiumMT.push(
        grossPremium
      )
      index++;
    })
    var mountPremiumMTTotal: number = 0;
    for (var key in mountPremiumMT) {
      mountPremiumMTTotal += parseInt(mountPremiumMT[key]);
    }

    item.push({
      type: 'currency',
      label: label,
      value: mountPremiumMTTotal
    })

    return item;
  }

  getKeyLabel(value: string, key: string): string {
    var newKey: any = '';
    if (parseInt(value) > 1) {
      newKey = key + "S";
    } else {
      newKey = key;
    }
    return type[newKey];
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

const type: { [key: string]: string } = {
  C: <any>"Child",
  CS: <any>"Children",
  A: <any>"Adult",
  AS: <any>"Adults",
  S: <any>"Senior Citizen",
  SS: <any>"Senior Citizens"
}

