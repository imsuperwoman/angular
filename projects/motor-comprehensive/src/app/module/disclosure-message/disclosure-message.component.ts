import {
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { GeneralSelectors } from 'module/store/general.selectors';
import { Observable } from 'rxjs';


@Component({
  selector: 'disclosure-message',
  templateUrl: './disclosure-message.component.html',
  styleUrls: ['./disclosure-message.component.scss'],
})
export class DisclosureMessageComponent implements OnInit {

  @Input('control') quoteForm!: any;

  activePartner$: Observable<any>;
  /*---- From Store ----*/
  @Select(GeneralSelectors.flowType) flowType$: any;
  @Select(GeneralSelectors.sourceSystem) sourceSystem$: any;

  constructor(private _store: Store) {
    this.activePartner$ = this._store.select(state => state.GeneralState.dynamicContent);
  }

  ngOnInit(): void {
  }


}
