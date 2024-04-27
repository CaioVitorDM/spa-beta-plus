import {Component} from '@angular/core';

@Component({
  selector: 'app-doctor-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {
  isOpen = true; // Estado inicial do sidebar

  toggleSidebar(): void {
    this.isOpen = !this.isOpen;
  }
}
