import { Component, OnInit, ViewChild, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { NxDialogService, NxModalRef } from '@aposin/ng-aquila/modal';

@Component({
  selector: 'shared-dialog',
  templateUrl: './shared-dialog.component.html',
  styleUrls: ['./shared-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class SharedDialogComponent implements OnInit {
  imageFolder: string = 'assets/images/ui/';
  activeDialogRef!: NxModalRef<any>;
  @ViewChild('sharedDialog') agentDialog: any;
  @Input('header') header!: string;
  @Input('description') description!: string;
  @Input('link') link!: string;
  @Input('routingPath') routingPath!: string;
  @Input('pageUrl') pageUrl!: string;
  @Input('buttonText') buttonText!: string;
  @Input('isFail') isFail: boolean = false;
  @Output('closeEmitter') closeEmitter: EventEmitter<any> = new EventEmitter();

  constructor(private router: Router, private nxDialogService: NxDialogService) { }

  ngOnInit(): void {
  }

  open(): void {
    this.activeDialogRef = this.nxDialogService.open(this.agentDialog);
  }

  close(): void {
    this.closeEmitter.emit();
    this.activeDialogRef.close();
  }

  goToPage() {
    this.router.navigate([this.routingPath], { queryParamsHandling: 'preserve' });
    this.close();
  }
}
