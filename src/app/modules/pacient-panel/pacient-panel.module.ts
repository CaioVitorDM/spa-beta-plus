import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PacientPanelComponent} from './pacient-panel.component';
import {PacientPanelRoutes} from './pacient-panel.routes';
import {RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
import {SharedModule} from '../../shared/shared.module';
import {SidebarComponent} from './sidebar/sidebar.component';
import {HeaderComponent} from '../../components/header/header.component';
import {UploadComponentComponent} from '../../components/upload-component/upload-component.component';
import {PatientDashboardComponent} from './pages/patient-dashboard/patient-dashboard.component';
import {DetailsCardComponent} from '../../components/details-card/details-card.component';
import {MedicComponent} from './pages/medic/medic.component';
import {ProfileComponent} from './pages/profile/profile.component';
import { AppointmentsComponent } from './pages/appointments/appointments.component';
import { CustomSelectComponent } from 'src/app/components/custom-select/custom-select.component';
import { AppointmentsTableComponent } from './pages/appointments/components/appointments-table/appointments-table.component';
import { BetaGraphComponent } from './pages/beta-graph/beta-graph.component';
import { BetaMenuComponent } from 'src/app/modules/pacient-panel/pages/beta-graph/beta-menu/beta-menu.component';
import { BetaGeneralComponent } from 'src/app/modules/pacient-panel/pages/beta-graph/beta-general/beta-general.component';
import { InputSearchComponent } from 'src/app/components/input-search/input-search.component';
import { MatDialogModule } from '@angular/material/dialog';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BetaPopUpComponent } from './pages/beta-graph/beta-pop-up/beta-pop-up.component';
import { BetaDateFilterComponent } from './pages/beta-graph/beta-date-filter/beta-date-filter.component';

@NgModule({
  declarations: [
    PacientPanelComponent,
    SidebarComponent,
    PatientDashboardComponent,
    MedicComponent,
    ProfileComponent,
    AppointmentsComponent,
    AppointmentsTableComponent,
    BetaGraphComponent,
  ],
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    PacientPanelRoutes,
    SharedModule,
    HeaderComponent,
    UploadComponentComponent,
    DetailsCardComponent,
    InputSearchComponent,
    CustomSelectComponent,
    BetaMenuComponent,
    BetaGeneralComponent,
    InputSearchComponent,
    MatDialogModule,
    BetaDateFilterComponent,
    BetaPopUpComponent,
  ],
})
export class PacientPanelModule {}
