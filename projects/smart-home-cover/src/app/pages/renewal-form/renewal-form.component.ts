import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NxDialogService } from '@aposin/ng-aquila/modal';
import { Actions, ofActionSuccessful, Store } from '@ngxs/store';
import { SpinnerOverlayService } from 'module/spinner-overlay/spinner-overlay.service';
import { SHC } from '../../constants/shc-constants';
import { RENEWAL_FORM_ACTION } from '../../store/actions/user-input.action';


@Component({
  selector: 'app-renewal-form',
  templateUrl: './renewal-form.component.html',
  styleUrls: ['./renewal-form.component.scss'],
})

export class RenewalFormComponent implements OnInit {

  title = SHC;
  @ViewChild('template') templateRef!: TemplateRef<any>;

  /*-- Helpline --*/
  constructor(
    private _store: Store,
    private route: Router,
    private dialogService: NxDialogService,
    private action$: Actions,
    private spinnerOverlayService: SpinnerOverlayService,
  ) {
  }

  ngOnInit(): void {
  }


  receiveLeaveDetails(form: any) {
    this.spinnerOverlayService.showLoadOverlay();
    var myObservableObject$ = this._store.dispatch(new RENEWAL_FORM_ACTION(form));
    myObservableObject$.subscribe((response) => {
      this.spinnerOverlayService.hideLoadOverlay();
      var res = response.UserInputState.renewalResponse;
      if (res.policyDatas.length == 0) {
        this.dialogService.open(this.templateRef, {
          showCloseIcon: true,
        });
      }
    });

    this.action$.pipe(ofActionSuccessful(RENEWAL_FORM_ACTION)).subscribe(
      () => this.route.navigate(['/get-info'], {
        queryParamsHandling: 'preserve',
      }));
  }

  onClick(): void {
    this.dialogService.closeAll();
  }
}
