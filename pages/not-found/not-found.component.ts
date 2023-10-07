import { Component, OnInit } from '@angular/core';
import { IMAGE_FOLDER } from '@constants/header-constants';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.scss']
})
export class NotFoundComponent implements OnInit {
  imageFolder: string = IMAGE_FOLDER;

  constructor() { }

  ngOnInit(): void {
  }

}
