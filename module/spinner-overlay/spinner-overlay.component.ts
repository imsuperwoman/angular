import { Component, OnInit } from '@angular/core';
import { SpinnerOverlayService } from './spinner-overlay.service';
import { trigger, state, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'spinner-overlay',
  templateUrl: './spinner-overlay.component.html',
  styleUrls: ['./spinner-overlay.component.scss'],
  animations: [
    trigger('openClose', [
      state(
        'open',
        style({
          height: '100%',
          width: '100%',
          opacity: 1,
        })
      ),
      state(
        'closed',
        style({
          height: 0,
          width: 0,
          opacity: 0,
        })
      ),
      transition('open <=> closed', [animate('0.15s')]),
    ]),
  ],
})
export class SpinnerOverlayComponent implements OnInit {

  showLoading: boolean = false;
  constructor(private spinnerOverlayService: SpinnerOverlayService) { }

  ngOnInit(): void {
    this.spinnerOverlayService.loading$.subscribe((value: boolean) => {
      this.showLoading = value;
    });
  }
}
