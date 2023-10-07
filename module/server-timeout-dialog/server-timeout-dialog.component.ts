import { Component, Inject } from '@angular/core';
import { NxModalRef, NX_MODAL_DATA } from '@aposin/ng-aquila/modal';
import { IMAGE_FOLDER } from '@constants/header-constants';

@Component({
  selector: 'server-timeout-dialog',
  templateUrl: './server-timeout-dialog.component.html',
  styleUrls: ['./server-timeout-dialog.component.scss'],
})
export class ServerTimeoutDialogComponent {
  imageFolder: string = IMAGE_FOLDER;
  refreshPage: boolean = false;

  constructor(public dialogRef: NxModalRef<ServerTimeoutDialogComponent>,
    @Inject(NX_MODAL_DATA) public data: any) {
    this.refreshPage = data.refreshPage
  }

  goRefreshPage(): void {
    this.close();
    window.location.reload()
  }

  close(): void {
    this.dialogRef.close();
  }
}
