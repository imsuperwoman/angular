import { NgModule } from "@angular/core";
import { NumberOnlyDirective } from "directives/numberOnly.directive";
import { InputCapitalizationDirective } from "directives/inputCapitalization.directive";
import { DecimalConverterDirective } from "directives/decimalConverter.directive";
import { ReCaptchaDirective } from "directives/recaptcha.directive";
import { BlockSpecialDirective } from "directives/blockSpecialInput.directive";

@NgModule({
  exports: [NumberOnlyDirective, InputCapitalizationDirective, DecimalConverterDirective, ReCaptchaDirective, BlockSpecialDirective],
  declarations: [NumberOnlyDirective, InputCapitalizationDirective, DecimalConverterDirective, ReCaptchaDirective, BlockSpecialDirective]
})
export class SharedModule { }
