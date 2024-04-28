import {Component, HostListener, OnInit} from '@angular/core';

@Component({
  selector: 'app-doctor-panel',
  templateUrl: './doctor-panel.component.html',
  styleUrl: './doctor-panel.component.scss',
})
export class DoctorPanelComponent implements OnInit {
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
