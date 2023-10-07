import {
  AfterViewInit,
  Component,
  Input,
  OnInit
} from '@angular/core';
import { ChangeDetectionStrategy } from '@angular/core';


@Component({
  selector: 'dynamic-table',
  templateUrl: './dynamic-table.component.html',
  styleUrls: ['./dynamic-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class DynamicTableComponent implements OnInit {
  @Input('benefits') benefits!: any;
  uniqueAgeRanges!: any;
  group!: any;
  benefitObjAll: any = [];

  constructor() { }

  ngOnInit(): void {
    this.uniqueAgeRanges = Array.from(new Set(this.benefits.map((benefits: { ageRange: any; }) => benefits.ageRange)));

    var groubedByTeam = groupBy(this.benefits, 'description')
    var keys = Object.keys(groubedByTeam);

    keys.forEach((cover: any) => {
      let coverObj = {} as BENEFIT;      
      coverObj.Description = this.captilizeFirstletter(cover);

      this.benefits.forEach((benefit: any) => {
        if (benefit.description === cover) {
          coverObj.Narration = benefit.narration;
          if (benefit.ageRange === "C") {
            coverObj.ChildCover = benefit.coverage;
          }
          else if (benefit.ageRange === "S") {
            coverObj.SeniorCover = benefit.coverage;
          } else if (benefit.ageRange === "A") {
            coverObj.AdultCover = benefit.coverage;
          }
        }
      });
      this.benefitObjAll.push(coverObj);
    })
  }
  //to capitalize only 1st leeter of sentence
  captilizeFirstletter(val: any){
  const word = val
  const remainingLetters = word.slice(1)
  const capitalizedWord = word.charAt(0) + remainingLetters.toLowerCase();
  return capitalizedWord;
}

}

export type BENEFIT = {
  Description?: string;
  Narration?: string;
  ChildCover?: string;
  SeniorCover?: string;
  AdultCover?: string;
}

var groupBy = function (xs: any, key: any) {
  return xs.reduce(function (rv: any, x: any) {
    (rv[x[key]] = rv[x[key]] || []).push(x);
    return rv;
  }, {});
};
