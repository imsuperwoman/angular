import { Injectable } from '@angular/core';
import { NoScrollService } from '@services/noScroll.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SpinnerOverlayService {
  loading$ = new BehaviorSubject(false);

  constructor(private noScrollService: NoScrollService) {}

  showLoadOverlay(): void {
    this.loading$.next(true);
    this.noScrollService.pageScroll$.next(false)
  }

  hideLoadOverlay(): void {
    this.loading$.next(false);
    this.noScrollService.pageScroll$.next(true);
  }
}
