import { Component, Input, OnInit, OnChanges, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'quotation-summary-card',
  templateUrl: './quotation-summary-card.component.html',
  styleUrls: ['./quotation-summary-card.component.scss'],
})
export class QuotationSummaryCardComponent implements OnInit {
  @Input('data') data!: any;
  @Input('paymentEnded') paymentEnded: boolean = false;
  @Input('paymentStatus') paymentStatus?: string;
  @Input('sticky') sticky: boolean = true;
  @Input('purchaseNote') purchaseNote: string = '';
  @Input('purchaseNotePopoverMsg') purchaseNotePopoverMsg: string = '';
  @Input('additionalPurchaseNote') additionalPurchaseNote: string = '';
  @Input('primaryButton') primaryButton: boolean = false;
  @Input('secondaryButton') secondaryButton: boolean = false;
  @Input('buttonText') buttonText?: string;
  @Output('proceedEmitter') proceedEmitter: EventEmitter<any> = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  close(): void {
    this.proceedEmitter.emit();
  }
}
