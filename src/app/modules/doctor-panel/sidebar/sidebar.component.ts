import {Component, EventEmitter, HostListener, Input, OnInit, Output} from '@angular/core';
import {SidebarToggleService} from '../../../services/header/sidebar-toggle.service';

@Component({
  selector: 'app-doctor-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {
  @Output() handleSideBarChange = new EventEmitter();
  @Input() isOpenEvent: boolean = false;

  isMobile = window.innerWidth <= 1024;
  isOpen = false; // Estado inicial do sidebar

  constructor(private sidebarToggleService: SidebarToggleService) {
    this.checkIfMobile(window.innerWidth); // Verifica a largura da janela ao carregar o componente
  }

  ngOnInit() {
    this.sidebarToggleService.triggerFunction$.subscribe(() => {
      this.toggleSidebar();
    });
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

  logout(): void {
    console.log('logout');
  }
}
