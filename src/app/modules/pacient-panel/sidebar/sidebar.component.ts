import {Component, EventEmitter, HostListener, Input, Output} from '@angular/core';
import { SidebarToggleService } from '../../../services/header/sidebar-toggle.service';

@Component({
  selector: 'app-patient-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {
  @Output() handleSideBarChange = new EventEmitter();
  @Input() isOpenEvent: boolean = false;

  isMobile = window.innerWidth <= 1024;
  isOpen = false;

  constructor(private sidebarToggleService: SidebarToggleService) {
    this.checkIfMobile(window.innerWidth);
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
    this.checkIfMobile((event.target as Window).innerWidth);
  }

  private checkIfMobile(width: number) {
    this.isMobile = width <= 1024;
  }

  logout(): void {
    console.log('logout');
  }
}
