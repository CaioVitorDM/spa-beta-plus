import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DoctorPanelComponent} from './doctor-panel.component';
import {SidebarComponent} from './sidebar/sidebar.component';
import {SharedModule} from '../../shared/shared.module';
import {RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
import {DoctorPanelRoutes} from './doctor-panel.routes';

@NgModule({
  declarations: [DoctorPanelComponent, SidebarComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    DoctorPanelRoutes,
  ],
})
export class DoctorPanelModule {}
