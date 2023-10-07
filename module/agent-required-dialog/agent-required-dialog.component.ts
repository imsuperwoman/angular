import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NxDialogService, NxModalRef } from '@aposin/ng-aquila/modal';

@Component({
  selector: 'agent-required-dialog',
  templateUrl: './agent-required-dialog.component.html',
  styleUrls: ['./agent-required-dialog.component.scss'],
})
export class AgentRequiredDialogComponent implements OnInit {
  imageFolder: string = 'assets/images/ui/';
  activeDialogRef!: NxModalRef<any>;
  @ViewChild('agentRequiredDialog') agentDialog: any;

  constructor(private router: Router, private nxDialogService: NxDialogService) { }

  ngOnInit(): void { }

  open(): void {
    this.activeDialogRef = this.nxDialogService.open(this.agentDialog);
  }

  goToAgentPage(): void {
    this.close();
    this.router.navigate(['/agent-locator']);
  }

  close(): void {
    this.activeDialogRef.close();
  }
}
