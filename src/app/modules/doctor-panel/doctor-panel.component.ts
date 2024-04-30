import {Component, HostListener, OnInit} from '@angular/core';
import {HeaderService} from '../../services/header/header-info.service';

@Component({
  selector: 'app-doctor-panel',
  templateUrl: './doctor-panel.component.html',
  styleUrl: './doctor-panel.component.scss',
})
export class DoctorPanelComponent implements OnInit {
  isSideBarOpen = false;
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

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.checkIfMobile(window.innerWidth);
  }

  private checkIfMobile(width: number) {
    this.isMobile = width <= 768; // Define como mobile se a largura for 768px ou menos
  }
}
