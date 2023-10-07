import { Injectable } from '@angular/core';
import { UntypedFormControl, ValidationErrors, Validators } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class CustomFieldsService {

  customFieldsService(contents: any, control: any, fields: any): void {
    var custCollFields = contents?.custCollFields;
    var additional1: string = '';
    if (custCollFields) {
      custCollFields.additionalInfo?.msg.forEach((item: any) => {
        if (item.item === '') {
          additional1 = item.text + "<br><br>"
        } else {
          additional1 += item?.item + " .  " + item?.text + "<br><br>"
        }
      });


      if (custCollFields.cardNo) {
        fields.push({
          id: "cardNo1",
          name: custCollFields.cardNo?.name,
          placeHolder: custCollFields.cardNo?.placeHolder,
          iButtonMssge: custCollFields.cardNo?.iButtonMssge,
          isRequired: custCollFields.cardNo?.isRequired,
          maxlength: custCollFields.cardNo?.maxlength,
          type: custCollFields.cardNo?.type,
          additionalInfo: additional1
        })
      }

      if (contents.custCollFieldsSecond) {
        var custCollFieldsSecond = contents.custCollFieldsSecond;
        var additional2: string = '';
        custCollFieldsSecond.additionalInfo?.msg.forEach((item: any) => {
          if (item.item === '') {
            additional2 = item.text + "<br><br>"
          } else {
            additional2 += item?.item + " .  " + item?.text + "<br><br>"
          }
        });
        fields.push({
          id: "cardNo2",
          name: custCollFieldsSecond.cardNo.name,
          placeHolder: custCollFieldsSecond.cardNo.placeHolder,
          iButtonMssge: custCollFieldsSecond.cardNo.iButtonMssge,
          isRequired: custCollFieldsSecond.cardNo.isRequired,
          maxlength: custCollFieldsSecond.cardNo.maxlength,
          type: custCollFieldsSecond.cardNo.type,
          additionalInfo: additional2
        })
      }

      if (contents.custCollFieldsThird) {
        var custCollFieldsThird = contents.custCollFieldsThird;
        var additional3: string = '';
        custCollFieldsThird.additionalInfo?.msg.forEach((item: any) => {
          if (item.item === '') {
            additional3 = item.text + "<br><br>"
          } else {
            additional3 += item?.item + " .  " + item?.text + "<br><br>"
          }
        });
        fields.push({
          id: "cardNo3",
          name: custCollFieldsThird.cardNo.name,
          placeHolder: custCollFieldsThird.cardNo.placeHolder,
          iButtonMssge: custCollFieldsThird.cardNo.iButtonMssge,
          isRequired: custCollFieldsThird.cardNo.isRequired,
          maxlength: custCollFieldsThird.cardNo.maxlength,
          type: custCollFieldsThird.cardNo.type,
          additionalInfo: additional3
        })
      }
    }

    if (contents.referralStaffFields != undefined) {
      var referralStaffFields = contents.referralStaffFields;
      fields.push({
        id: "staffId",
        name: referralStaffFields.staffId.name,
        placeHolder: referralStaffFields.staffId.placeHolder,
        iButtonMssge: "",
        isRequired: referralStaffFields.staffId.isRequired,
        maxlength: referralStaffFields.staffId.maxlength,
        type: referralStaffFields.staffId.type,
        additionalInfo: ""
      })
    }

    fields.forEach((x: any) => {
      if (!x.isRequired) {
        control.addControl(x.id, new UntypedFormControl(""));
        control.get(x.id)?.setValidators([
          Validators.maxLength(x.maxlength)]);
      } else {
        control.addControl(x.id, new UntypedFormControl(""))
        control.get(x.id)?.setValidators([Validators.required,
        Validators.maxLength(x.maxlength)]);
      }
    })

  }
}
