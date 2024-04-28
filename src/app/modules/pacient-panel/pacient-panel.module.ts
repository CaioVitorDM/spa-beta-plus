import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PacientPanelComponent} from './pacient-panel.component';
import {PacientPanelRoutes} from './pacient-panel.routes';
import {RouterOutlet} from '@angular/router';
import {SharedModule} from '../../shared/shared.module';
import {SidebarComponent} from './sidebar/sidebar.component';

@NgModule({
  declarations: [PacientPanelComponent, SidebarComponent],
  imports: [CommonModule, RouterOutlet, PacientPanelRoutes, SharedModule],
})
export class PacientPanelModule {}
