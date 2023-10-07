import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
@Injectable({
  providedIn: 'root'
})
export class GeneralServiceSelect {
  lov$: any;

  constructor(
    private _store: Store,
  ) {
    this.lov$ = this._store.selectSnapshot(
      (state) => state.GeneralState.lov
    )
  }

  public selectLovList(type: string): any {
    const lovList = this.lov$.find((item: any) => item.LovType == type);
    var list: { Code?: string; Description?: string; }[] = []
    lovList?.LovList.find((item: any) => {
      list.push({ Code: item.Code, Description: item.Description });
    })
    return list;
  }

  public selectLovDescription(lovType: any, code: any): string {
    const lov = this._store.selectSnapshot(item => item.GeneralState.lov);
    const lovList = lov.find((item: any) => item.LovType == lovType);
    const lovListValue = lovList.LovList.find((item: any) => item.Code == code);

    return lovListValue.Description
  }

}
