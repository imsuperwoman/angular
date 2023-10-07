import { Component, Inject } from '@angular/core';
import { NxModalRef, NX_MODAL_DATA } from '@aposin/ng-aquila/modal';
import { IMAGE_FOLDER } from '@constants/header-constants';

@Component({
  selector: 'invalid-dialog',
  templateUrl: './invalid-dialog.component.html',
  styleUrls: ['./invalid-dialog.component.scss'],
})
export class InvalidDialogComponent {
  imageFolder: string = IMAGE_FOLDER;

  constructor(public dialogRef: NxModalRef<InvalidDialogComponent>,
    @Inject(NX_MODAL_DATA) public data: any) { }

  close(): void {
    this.dialogRef.close();
  }
}
