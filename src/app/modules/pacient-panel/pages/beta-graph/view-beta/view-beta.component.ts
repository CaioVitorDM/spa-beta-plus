import { Component , OnInit} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { HeaderService } from 'src/app/services/header/header-info.service';
import { BetaPopUpComponent } from '../components/beta-pop-up/beta-pop-up.component';

@Component({
  selector: 'app-view-beta',
  templateUrl: './view-beta.component.html',
  styleUrl: './view-beta.component.scss'
})
export class ViewBetaComponent implements OnInit {
  imageSrc!: string;
  medicName!: string;
  details!: {label: string; value: string}[];

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
}

