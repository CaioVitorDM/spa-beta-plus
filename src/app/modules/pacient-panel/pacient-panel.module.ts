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
import {AppointmentsComponent} from './pages/appointments/appointments.component';
import {CustomSelectComponent} from 'src/app/components/custom-select/custom-select.component';
import {AppointmentsTableComponent} from './pages/appointments/components/appointments-table/appointments-table.component';
import {BetaGraphComponent} from './pages/beta-graph/beta-graph.component';
import {BetaGeneralComponent} from 'src/app/modules/pacient-panel/pages/beta-graph/components/beta-general/beta-general.component';
import {InputSearchComponent} from 'src/app/components/input-search/input-search.component';
import {MatDialogModule} from '@angular/material/dialog';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {BetaPopUpComponent} from './pages/beta-graph/components/beta-pop-up/beta-pop-up.component';
import {FormsModule} from '@angular/forms';
import {ExamsComponent} from './pages/exams/exams.component';
import {UploadFileComponent} from 'src/app/components/upload-file/upload-file.component';
import {UploadExamsComponent} from './pages/exams/upload-exams/upload-exams.component';
import {ExamsTableComponent} from './pages/exams/components/exams-table/exams-table.component';
import {ProtocolsFormComponent} from '../doctor-panel/pages/protocols/components/protocols-form/protocols-form.component';

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
    ExamsComponent,
  ],
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    PacientPanelRoutes,
    SharedModule,
    HeaderComponent,
    FormsModule,
    UploadComponentComponent,
    DetailsCardComponent,
    InputSearchComponent,
    CustomSelectComponent,
    InputSearchComponent,
    MatDialogModule,
    UploadFileComponent,
    CustomSelectComponent,
  ],
  
})
export class PacientPanelModule {}
