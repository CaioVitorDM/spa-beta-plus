import {Component, EventEmitter, HostListener, Input, Output} from '@angular/core';

@Component({
  selector: 'app-doctor-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {
  @Output() handleSideBarChange = new EventEmitter();
  @Input() isOpenEvent: boolean = false;

  isMobile = window.innerWidth <= 1024;
  isOpen = false; // Estado inicial do sidebar

  constructor() {
    this.checkIfMobile(window.innerWidth); // Verifica a largura da janela ao carregar o componente
  }

  toggleSidebar(): void {
    this.isOpen = !this.isOpen;
    this.handleSideBarChange.emit();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.checkIfMobile((event.target as Window).innerWidth); // Verifica a largura da janela ao redimensionar
  }

  private checkIfMobile(width: number) {
    this.isMobile = width <= 1024; // Define como móvel se a largura for 1024px ou menos
  }
}
