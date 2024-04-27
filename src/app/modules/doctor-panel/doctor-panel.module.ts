import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DoctorPanelComponent} from './doctor-panel.component';
import {SidebarComponent} from './sidebar/sidebar.component';
import {SharedModule} from '../../shared/shared.module';
import {RouterLink, RouterOutlet} from '@angular/router';

@NgModule({
  declarations: [DoctorPanelComponent, SidebarComponent],
  imports: [CommonModule, SharedModule, RouterOutlet, RouterLink],
})
export class DoctorPanelModule {}
