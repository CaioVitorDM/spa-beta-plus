import {Component, HostListener} from '@angular/core';

@Component({
  selector: 'app-pacient-panel',
  templateUrl: './pacient-panel.component.html',
  styleUrl: './pacient-panel.component.scss',
})
export class PacientPanelComponent {
  isSideBarOpen = false;
  isMobile: boolean = false;

  changeSideBarExpanded() {
    this.isSideBarOpen = !this.isSideBarOpen;
  }

  ngOnInit(): void {
    this.checkIfMobile(window.innerWidth); // Verifica no carregamento inicial
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.checkIfMobile(window.innerWidth);
  }

  private checkIfMobile(width: number) {
    this.isMobile = width <= 768; // Define como mobile se a largura for 768px ou menos
  }
}
