import {Component, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {HeaderService} from 'src/app/services/header/header-info.service';
import {BetaPopUpComponent} from '../components/beta-pop-up/beta-pop-up.component';
import {BetaService} from 'src/app/services/beta/beta.service';
import {BetaGeneralComponent} from '../components/beta-general/beta-general.component';
import { Beta } from 'src/app/models/Beta';

@Component({
  selector: 'app-view-beta',
  templateUrl: './view-beta.component.html',
  styleUrl: './view-beta.component.scss',
})
export class ViewBetaComponent implements OnInit {
  imageSrc!: string;
  medicName!: string;
  details!: {label: string; value: string}[];

  constructor(
    private headerService: HeaderService,
    public dialog: MatDialog,
    private betaService: BetaService
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
    const dialogRef = this.dialog.open(BetaPopUpComponent);

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log('Beta criado:', result);
      }
    });
  }
}