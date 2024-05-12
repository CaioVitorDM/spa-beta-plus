import {NgModule} from '@angular/core';
import {DoctorPanelModule} from './modules/doctor-panel/doctor-panel.module';
import {PacientPanelModule} from './modules/pacient-panel/pacient-panel.module';
import {AppRoutes} from './app.routes';
import {RouterOutlet} from '@angular/router';
import {SidebarToggleService} from './services/header/sidebar-toggle.service';
import {HeaderService} from './services/header/header-info.service';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {AuthService} from './services/auth/auth.service';
import {FormsModule} from '@angular/forms';

@NgModule({
  declarations: [],
  imports: [
    AppRoutes,
    DoctorPanelModule,
    PacientPanelModule,
    RouterOutlet,
    FormsModule,
    HttpClientModule,
  ],
  providers: [SidebarToggleService, HeaderService, AuthService],
})
export class AppModules {}
