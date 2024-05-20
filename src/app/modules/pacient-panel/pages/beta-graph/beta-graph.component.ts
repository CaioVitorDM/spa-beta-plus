import {Component, OnInit} from '@angular/core';
import {HeaderService} from '../../../../services/header/header-info.service';

@Component({
  selector: 'app-beta-graph',
  templateUrl: './beta-graph.component.html',
  styleUrl: './beta-graph.component.scss'
})
export class BetaGraphComponent implements OnInit{
  imageSrc!: string;
  medicName!: string;
  details!: {label: string; value: string}[];
  constructor(
    private headerService: HeaderService
  ) {}

  ngOnInit(): void {
    this.headerService.setTitulo('Beta hCG');    
  }

  public showMenuComponent: boolean = true;
  public selectedButton: string = 'Menu';

  showComponentMenu() {
    this.showMenuComponent = true;
    this.selectedButton = 'Menu';
  }

  showComponentGeneral() {
    this.showMenuComponent = false;
    this.selectedButton = 'General'
  }
}

