import {Component} from '@angular/core';

@Component({
  selector: 'app-doctor-panel',
  templateUrl: './doctor-panel.component.html',
  styleUrl: './doctor-panel.component.scss',
})
export class DoctorPanelComponent {
  isExpandedSidebar = window.innerWidth > 1024;
}
