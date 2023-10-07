import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NoScrollService {
  pageScroll$ = new BehaviorSubject(true);

  constructor() {
    this.pageScroll$.subscribe((latestPageScroll: boolean) => {
  
      if (document) {
        document.documentElement.classList.toggle('no-scroll', !latestPageScroll);
      }
    });
  }
}
