import { Injectable } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { Select } from '@ngxs/store';
import { UserInputState } from '../store/states/user-input.state';


@Injectable({
  providedIn: 'root',
})
export class RenewalPolicyService {
  policyData$: Subject<any> = new Subject();
  updatedPolicyData$: Subject<any> = new Subject();
  updatedPolicyHolderData$: Subject<any> = new Subject();
  updatedFinancialInterestData$: Subject<any> = new Subject();
  updatedCombinedNamesData$: Subject<any> = new Subject();
  updatedPolicyData: any;
  policySubscription!: Subscription;

  @Select(UserInputState.renewalResponse) renewal$: any;
  constructor() { }

  getPolicy(): void {

    this.policySubscription = this.renewal$.subscribe((data: any) => {
      this.policyData$.next(data);
      this.updatedPolicyData$.next(data);
      this.updatedPolicyData = data;
    });
  }

  updateCustomerDetails(data: any, index: number): void {
    this.updatedPolicyHolderData$.next(data);
    this.updatedPolicyData.policyDatas[index].policyHolderDetails = data;
  }

  updateFinancialDetails(data: any, index: number): void {
    this.updatedFinancialInterestData$.next(data);
    this.updatedPolicyData.policyDatas[index].financialInterestDetails = data;
  }

  updateCombinedNamesDetails(data: any, index: number): void {
    this.updatedCombinedNamesData$.next(data);
    this.updatedPolicyData.policyDatas[index].combinedNamesDetails = data;
  }

  getUpdatedPolicyData(): void {
    this.updatedPolicyData$.next(this.updatedPolicyData);
  }
}
