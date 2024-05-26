import { Component, OnInit } from '@angular/core';
import { HeaderService } from '../../../../services/header/header-info.service';
import { MatDialog } from '@angular/material/dialog';
import { BetaPopUpComponent } from './beta-pop-up/beta-pop-up.component';
import { BetaDateFilterComponent } from './beta-date-filter/beta-date-filter.component';

@Component({
  selector: 'app-beta-graph',
  templateUrl: './beta-graph.component.html',
  styleUrls: ['./beta-graph.component.scss']
})
export class BetaGraphComponent implements OnInit {
  imageSrc!: string;
  medicName!: string;
  details!: { label: string; value: string }[];

  constructor(
    private headerService: HeaderService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.headerService.setTitulo('Beta hCG');    
  }

  public showMenuComponent: boolean = true;
  public selectedButton: string = 'Menu';

  showComponentMenu(): void {
    this.showMenuComponent = true;
    this.selectedButton = 'Menu';
  }

  showComponentGeneral(): void {
    this.showMenuComponent = false;
    this.selectedButton = 'General';
  }

  openDialog(): void {
    this.dialog.open(BetaPopUpComponent);
  }
  openDialogFilter(): void {
    this.dialog.open(BetaDateFilterComponent);
  }
}
