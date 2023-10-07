import { Component, OnInit, ViewChild } from '@angular/core';
import { IMAGE_FOLDER } from '@constants/header-constants';
import * as content from '@constants/content.static-data';

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  @ViewChild('stepper') stepper: any;
  imageFolder: string = IMAGE_FOLDER;
  contentData: any = content.data;

  constructor() { }

  ngOnInit(): void {

  }
}
