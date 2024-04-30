import {Component, HostListener} from '@angular/core';
import {HeaderComponent} from '../../components/header/header.component';
import {UploadComponentComponent} from '../../components/upload-component/upload-component.component';


@Component({
  selector: 'app-pacient-panel',
  templateUrl: './pacient-panel.component.html',
  styleUrl: './pacient-panel.component.scss',
})
export class PacientPanelComponent {
  isSideBarOpen: boolean = false;
  isMobile: boolean = false;

  changeSideBarExpanded() {
    this.isSideBarOpen = !this.isSideBarOpen;
  }

  ngOnInit(): void {
    this.checkIfMobile(window.innerWidth); // Verifica no carregamento inicial
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
