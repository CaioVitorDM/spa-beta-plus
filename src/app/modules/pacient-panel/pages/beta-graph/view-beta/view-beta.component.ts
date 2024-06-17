import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { HeaderService } from 'src/app/services/header/header-info.service';
import { BetaPopUpComponent } from '../components/beta-pop-up/beta-pop-up.component';
import { BetaGeneralComponent } from '../components/beta-general/beta-general.component';

@Component({
  selector: 'app-view-beta',
  templateUrl: './view-beta.component.html',
  styleUrls: ['./view-beta.component.scss']
})
export class ViewBetaComponent implements OnInit {
  imageSrc!: string;
  medicName!: string;
  details!: {label: string; value: string}[];
  public showMenuComponent: boolean = true;
  public selectedButton: string = 'Menu';

  constructor(
    private headerService: HeaderService,
    public dialog: MatDialog,
    private betaGeneral: BetaGeneralComponent
  ) {}

  ngOnInit(): void {
    this.headerService.setTitulo('Beta hCG');
  }

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
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.betaGeneral.loadBetas();  // Atualize a visão geral após adicionar um novo beta
      }
    });
  }
}
