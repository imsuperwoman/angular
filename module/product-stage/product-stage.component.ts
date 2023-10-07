import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'product-stage',
  templateUrl: './product-stage.component.html',
  styleUrls: ['./product-stage.component.scss'],
})
export class ProductStageComponent implements OnInit {
  @Input('productImage') productImage!: string;
  @Input('header') header!: string;
  @Input('description') description!: string;
  @Input('travel') travel!: boolean;

  imageFolders: string = 'assets/images/ui/banner/';


  constructor() { }

  ngOnInit(): void {
  }
}
