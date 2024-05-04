import {NgModule} from '@angular/core';
import {DoctorPanelModule} from './modules/doctor-panel/doctor-panel.module';
import {PacientPanelModule} from './modules/pacient-panel/pacient-panel.module';
import {AppRoutes} from './app.routes';
import {RouterOutlet} from '@angular/router';
import {SidebarToggleService} from './services/header/sidebar-toggle.service';
import {HeaderService} from './services/header/header-info.service';
import {HttpClientModule} from '@angular/common/http';
import {AuthService} from './services/auth/auth.service';
import {LocalStorageService} from './services/local-storage/local-storage.service';
import {SnackbarService} from './services/snackbar/snackbar.service';
import {RouterService} from './services/router-service/router.service';
import {LineLoadingService} from './services/line-loading/line-loading.service';
import {FormUtilsService} from './services/form-utils/form-utils.service';
import {LoginPageComponent} from './pages/login-page/login-page.component';
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
