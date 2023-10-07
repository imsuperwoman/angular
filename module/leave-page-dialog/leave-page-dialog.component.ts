import { Component, OnInit, Output } from '@angular/core';
import { IMAGE_FOLDER } from '@constants/header-constants';
import { EventEmitter } from '@angular/core';

@Component({
  selector: 'leave-page-dialog',
  templateUrl: './leave-page-dialog.component.html',
  styleUrls: ['./leave-page-dialog.component.scss'],
})
export class LeavePageDialogComponent implements OnInit {

  imageFolder: string = IMAGE_FOLDER;

  @Output('closeEvent') closeEvent = new EventEmitter<boolean>();
  @Output('leaveEvent') leaveEvent = new EventEmitter<boolean>();

  constructor() { }

  ngOnInit(): void {}

  closeDialog(): void {
    this.closeEvent.emit();
  }

  leavePage(): void {
    this.leaveEvent.emit();
  }
}
