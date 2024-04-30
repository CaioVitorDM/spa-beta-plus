import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DoctorPanelComponent} from './doctor-panel.component';
import {SidebarComponent} from './sidebar/sidebar.component';
import {SharedModule} from '../../shared/shared.module';
import {RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
import {DoctorPanelRoutes} from './doctor-panel.routes';
import {DoctorDashboardComponent} from './pages/doctor-dashboard/doctor-dashboard.component';
import {HeaderComponent} from '../../components/header/header.component';

@NgModule({
  declarations: [DoctorPanelComponent, SidebarComponent, DoctorDashboardComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    DoctorPanelRoutes,
    HeaderComponent,
  ],
})
export class DoctorPanelModule {}
