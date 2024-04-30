import {NgModule} from '@angular/core';
import {DoctorPanelModule} from './modules/doctor-panel/doctor-panel.module';
import {PacientPanelModule} from './modules/pacient-panel/pacient-panel.module';
import {AppRoutes} from './app.routes';
import {RouterOutlet} from '@angular/router';
import { SidebarToggleService } from './services/header/sidebar-toggle.service';
import { HeaderService } from './services/header/header-info.service';
import { UserService } from './services/user/user-info.service';

@NgModule({
  declarations: [],
  imports: [AppRoutes, DoctorPanelModule, PacientPanelModule, RouterOutlet],
  providers: [SidebarToggleService, HeaderService, UserService]
})
export class AppModules {}
