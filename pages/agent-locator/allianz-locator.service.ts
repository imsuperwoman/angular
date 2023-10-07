import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { Observable, forkJoin, timer } from 'rxjs';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AllianzLocatorService {
  /*---- From Store ----*/
  locatorData$!: any;

  constructor(private _store: Store) {
  }

  getLocationsAndGooglePlaces({ query, placesService }: any): Observable<any> {
    return forkJoin([
      this.getLocations(query),
      this.getGooglePlaces(query, placesService),
    ]);
  }

  getGooglePlaces(query: string, placesService: any): Observable<any> {
    const observer = new Observable<any>((observer) => {
      placesService.textSearch({ query }, (results: any) => {
        observer.next(results);
        observer.complete();
      });
    });
    return observer;
  }

  getLocations(query: string): Observable<any> {
    this.locatorData$ = this._store.selectSnapshot((state) => state.GeneralState.agentLocator.AgentList);
    if (this.locatorData$ === undefined) { return of({}); }

    const observer = new Observable<any>((observer) => {
      // For FE, we are just gonna put a 1 second
      // timeout and return some filtered static
      // mock data.

      let timerSubscription = timer(1000).subscribe(() => {
        var normalisedQuery = query
          .toLowerCase()
          .replace(/[^A-Za-z ]/, '')
          .split(' ')
          .filter((val: any) => !!val);
        var matchingLocatorData = this.locatorData$.slice(0);

        for (var i = 0; i < normalisedQuery.length; i++) {
          matchingLocatorData = matchingLocatorData.filter((location: any) => {
            return location.Name.toLowerCase().indexOf(normalisedQuery[i]) > -1;
          });
        }

        observer.next(matchingLocatorData);
        observer.complete();
        timerSubscription.unsubscribe();
      });
    });

    return observer;
  }

  getNearbyLocations(): Observable<any> {
    this.locatorData$ = this._store.selectSnapshot((state) => state.GeneralState.agentLocator.AgentList);
    const observer = new Observable<any>((observer) => {
      observer.next(this.locatorData$);
      observer.complete();
    });

    return observer;
  }
}
