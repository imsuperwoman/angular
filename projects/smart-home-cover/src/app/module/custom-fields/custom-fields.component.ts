import { Component, EventEmitter, OnInit, Output, Input } from '@angular/core';
import { Store } from '@ngxs/store';
import { HEADER } from 'module/store/general.model';


@Component({
  selector: 'custom-fields',
  templateUrl: './custom-fields.component.html',
  styleUrls: ['./custom-fields.component.scss']
})
export class CustomFieldsComponent implements OnInit {

  @Input('dynamicContent') dynamicContent: any;
  @Input('customFieldsData') customFieldsData: any;
  @Output('customFieldsApplied') customFieldsApplied: any = new EventEmitter();

  public cardNoConfig: any;
  public additionalInfo: any;
  public cardNoConfigSecond: any;
  public additionalInfoSecond: any;
  public cardNoConfigThird: any;
  public additionalInfoThird: any;
  public referralStaffIdConfig: any;

  public cardNo1: any;
  public cardNo2: any;
  public cardNo3: any;
  public staffId: any;


  constructor(private _store: Store) { }

  ngOnInit(): void { }

  ngAfterViewInit(): void {
    let dynamicContentData = this.dynamicContent;
    if (dynamicContentData) {
      if (dynamicContentData.hasOwnProperty('Header')) {
        const headerConfig: HEADER = dynamicContentData.Header;
        const customerDetails = this._store.selectSnapshot(item => item.UserInputState.userInput.step3.customerDetails);

        if (headerConfig.contents?.custCollFields != undefined) {
          this.cardNoConfig = headerConfig.contents.custCollFields && headerConfig.contents.custCollFields?.cardNo;
          headerConfig.contents.custCollFields.additionalInfo?.msg.forEach((item: any) => {
            if (item.item === '') {
              this.additionalInfo = item.text + "<br><br>"
            } else {
              this.additionalInfo += item?.item + " .  " + item?.text + "<br><br>"
            }
          })
          if (this.cardNoConfig !== undefined) {
            this.cardNo1 = customerDetails?.cardNo;
          }
        }
        if (headerConfig.contents?.custCollFieldsSecond != undefined) {
          this.cardNoConfigSecond = headerConfig.contents.custCollFieldsSecond && headerConfig.contents.custCollFieldsSecond.cardNo;
          headerConfig.contents.custCollFieldsSecond.additionalInfo?.msg.forEach((item: any) => {
            if (item?.item === '') {
              this.additionalInfoSecond = item?.text + "<br><br>"
            } else {
              this.additionalInfoSecond += item?.item + " .  " + item?.text + "<br><br>"
            }
          })

          if (this.cardNoConfigSecond !== undefined) {
            this.cardNo2 = customerDetails?.cardNoSecond;
          }
        }

        if (headerConfig.contents?.custCollFieldsThird != undefined) {
          this.cardNoConfigThird = headerConfig.contents.custCollFieldsThird && headerConfig.contents.custCollFieldsThird.cardNo;
          headerConfig.contents.custCollFieldsThird.additionalInfo?.msg.forEach((item: any) => {
            if (item?.item === '') {
              this.additionalInfoThird = item?.text + "<br><br>"
            } else {
              this.additionalInfoThird += item?.item + " .  " + item?.text + "<br><br>"
            }
          })

          if (this.cardNoConfigThird !== undefined) {
            this.cardNo3 = customerDetails?.cardNoThird;
          }
        }
        if (headerConfig.contents?.referralStaffFields != undefined) {
          this.referralStaffIdConfig = headerConfig.contents.referralStaffFields && headerConfig.contents.referralStaffFields.staffId;
          if (this.referralStaffIdConfig !== undefined) {
            this.staffId = customerDetails?.staffId;
          }
        }
      }
    }
  }

  cardNoValue(event: any, cardNo: string) {
    let cardNoValue = event.target.value;
    this.cardNo1 = (cardNo == 'cardNo') ? cardNoValue : this.cardNo1;
    this.cardNo2 = (cardNo == 'cardNoSecond') ? cardNoValue : this.cardNo2;
    this.cardNo3 = (cardNo == 'cardNoThird') ? cardNoValue : this.cardNo3;
    this.staffId = (cardNo == 'staffId') ? cardNoValue : this.staffId;

    this.customFieldsApplied.emit({
      cardNo: this.cardNo1,
      cardNoSecond: this.cardNo2,
      cardNoThird: this.cardNo3,
      staffId: this.staffId
    });
  }

}