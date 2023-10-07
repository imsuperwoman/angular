import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'home',
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {
  @ViewChild('stepper') stepper: any;
  mobileMode?: boolean;
  imageFolder: string = 'assets/images/ui/';

  /*-- Helpline --*/
  showHelpline: boolean = false;

  constructor() { }

  ngOnInit(): void {
    this.mobileMode = window.matchMedia('(max-width: 800px)').matches;

    window.matchMedia('(max-width: 800px)').addEventListener('change', () => {
      this.mobileMode = window.matchMedia('(max-width: 800px)').matches;
    });
  }
}
