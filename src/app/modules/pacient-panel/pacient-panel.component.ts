import {Component, HostListener, OnInit} from '@angular/core';
import {HeaderService} from '../../services/header/header-info.service';

@Component({
  selector: 'app-pacient-panel',
  templateUrl: './pacient-panel.component.html',
  styleUrl: './pacient-panel.component.scss',
})
export class PacientPanelComponent implements OnInit {
  isSideBarOpen: boolean = false;
  isMobile: boolean = false;

  constructor(private headerService: HeaderService) {}

  changeSideBarExpanded() {
    this.isSideBarOpen = !this.isSideBarOpen;
  }

  ngOnInit(): void {
    this.checkIfMobile(window.innerWidth); // Verifica no carregamento inicial
    this.headerService.setNomeUsuario('Fulano');
    this.headerService.setFotoUsuario(
      'https://fastly.picsum.photos/id/237/200/300.jpg?hmac=TmmQSbShHz9CdQm0NkEjx1Dyh_Y984R9LpNrpvH2D_U'
    );
  }

  handleToggle(status: boolean) {
    this.isSideBarOpen = status;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.checkIfMobile(window.innerWidth);
  }

  private checkIfMobile(width: number) {
    this.isMobile = width <= 768; // Define como mobile se a largura for 768px ou menos
  }
}
