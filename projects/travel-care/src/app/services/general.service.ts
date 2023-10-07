import { Injectable } from '@angular/core';
import { CONFIG } from '../constants/travel-care-constants';
import { Store } from '@ngxs/store';

@Injectable({
  providedIn: 'root',
})

export class GeneralService {


  constructor(public _store: Store,) {

  }

  private data: any;

  setConfig() {
    this.data = new DATA();
    var productUrl = window.location.pathname.split("/")[1];

    if (CONFIG.travelEasy.URL === productUrl) {
      this.data.HEADER = CONFIG.travelEasy.HEADER;
      this.data.SUBHEADER = CONFIG.travelEasy.SUBHEADER;
      this.data.PRODUCT_CAT = CONFIG.travelEasy.PRODUCT_CAT;
      this.data.LOGO = CONFIG.travelEasy.LOGO;
      this.data.PRODUCT_TYPE = CONFIG.travelEasy.PRODUCT_TYPE;
      this.data.NOTE = CONFIG.travelEasy.NOTE;
      this.data.CALL_BACK_URL = CONFIG.travelEasy.CALL_BACK_URL;
    }
    else if (CONFIG.travelCare.URL === productUrl) {
      this.data.HEADER = CONFIG.travelCare.HEADER;
      this.data.SUBHEADER = CONFIG.travelCare.SUBHEADER;
      this.data.PRODUCT_CAT = CONFIG.travelCare.PRODUCT_CAT;
      this.data.LOGO = CONFIG.travelCare.LOGO;
      this.data.PRODUCT_TYPE = CONFIG.travelCare.PRODUCT_TYPE;
      this.data.NOTE = CONFIG.travelCare.NOTE;
      this.data.CALL_BACK_URL = CONFIG.travelEasy.CALL_BACK_URL;
    }
    else {
      // for testing only ATE
      // this.data.HEADER = CONFIG.travelEasy.HEADER;
      // this.data.SUBHEADER = CONFIG.travelEasy.SUBHEADER;
      // this.data.PRODUCT_CAT = CONFIG.travelEasy.PRODUCT_CAT;
      // this.data.LOGO = CONFIG.travelEasy.LOGO;
      // this.data.PRODUCT_TYPE = CONFIG.travelEasy.PRODUCT_TYPE;
      // this.data.NOTE = CONFIG.travelEasy.NOTE;
      // this.data.CALL_BACK_URL = CONFIG.travelEasy.CALL_BACK_URL;
      // ATC
      this.data.HEADER = CONFIG.travelCare.HEADER;
      this.data.SUBHEADER = CONFIG.travelCare.SUBHEADER;
      this.data.PRODUCT_CAT = CONFIG.travelCare.PRODUCT_CAT;
      this.data.LOGO = CONFIG.travelCare.LOGO;
      this.data.PRODUCT_TYPE = CONFIG.travelCare.PRODUCT_TYPE;
      this.data.NOTE = CONFIG.travelCare.NOTE;
      this.data.CALL_BACK_URL = CONFIG.travelCare.CALL_BACK_URL;
    }
  }

  getConfig() {
    return this.data;
  }

  sortTravelerSequence(obj: any) {
    const arr = Object.keys(obj).map(el => {
      return obj[el];
    });
    arr.sort((a, b) => {
      return a.TravelerSequence - b.TravelerSequence;
    });
    return arr;
  };


  getAgeRangeMin(AgeRange: any, isMin: any) {
    var step1 = this._store.selectSnapshot((state) => state.UserInputState.userInput.step1);
    var minAge, maxAge = 0;
    if (AgeRange == 'C') {
      if (step1.trgrpcode == 'FM') {
        minAge = 30; maxAge = 24;
      } else {
        minAge = 30; maxAge = 17;
      }
    } else if (AgeRange == 'A') {
      minAge = 18; maxAge = 70;
    }
    else if (AgeRange == 'adult1') {
      minAge = 18; maxAge = 40;
    }
    else if (AgeRange == 'adult2') {
      minAge = 41; maxAge = 60;
    } else {
      minAge = 71; maxAge = 80;
    }
    if (isMin)
      return minAge;
    else
      return maxAge;
  }
}

export class DATA {
  HEADER?: string;
  SUBHEADER?: string;
  PRODUCT_CAT?: string;
  LOGO?: string;
  PRODUCT_TYPE?: string;
  NOTE?: string;
}