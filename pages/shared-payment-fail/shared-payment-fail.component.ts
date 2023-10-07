import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'shared-payment-fail',
  templateUrl: './shared-payment-fail.component.html',
  styleUrls: ['./shared-payment-fail.component.scss']
})
export class SharedPaymentFailComponent implements OnInit, AfterViewInit {

  @Input('paymentResult') paymentResult: any;
  @Input('payResParamDesc') payResParamDesc: any;
  @Input('params') params: any;
  @Input('productData') productData: any;
  @Input('periodOfInsurance') periodOfInsurance: any;
  @Input('otherConfigs') otherConfigs: any;

  @Output() goingBack = new EventEmitter<any>()
  @Output() gettingStatus = new EventEmitter<any>()

  @ViewChild('stepper') stepper: any;

  constructor(
    private changeDetectionRef: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.stepper.steps.get(1).completed = true;
    this.stepper.steps.get(2).completed = true;
    this.stepper.steps.get(3).completed = true;
    this.stepper.steps.get(3).select();
    this.changeDetectionRef.detectChanges();
  }

  formatMobileNumber(mobile: string) {
    return mobile.toString().substring(0, 4) + '-' + mobile.toString().substr(4);
  }

  backto() {
    this.goingBack.emit(true);
  }

  getStatus() {
    this.gettingStatus.emit(true);
  }

}
