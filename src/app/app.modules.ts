import {NgModule} from '@angular/core';
import {DoctorPanelModule} from './modules/doctor-panel/doctor-panel.module';
import {PacientPanelModule} from './modules/pacient-panel/pacient-panel.module';
import {AppRoutes} from './app.routes';
import {RouterOutlet} from '@angular/router';

@NgModule({
  declarations: [],
  imports: [AppRoutes, DoctorPanelModule, PacientPanelModule, RouterOutlet],
})
export class AppModules {}
