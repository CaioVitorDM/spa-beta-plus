import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PacientPanelComponent} from './pacient-panel.component';
import {PacientPanelRoutes} from './pacient-panel.routes';
import {RouterOutlet} from '@angular/router';
import {SharedModule} from '../../shared/shared.module';
import {SidebarComponent} from './sidebar/sidebar.component';
import {HeaderComponent} from '../../components/header/header.component';
import {UploadComponentComponent} from '../../components/upload-component/upload-component.component';
import {PatientDashboardComponent} from './pages/patient-dashboard/patient-dashboard.component';
import {DetailsCardComponent} from '../../components/details-card/details-card.component';
import {MedicComponent} from './pages/medic/medic.component';
import {ProfileComponent} from './pages/profile/profile.component';
import { BetaGraphComponent } from './pages/beta-graph/beta-graph.component';
import { BetaMenuComponent } from 'src/app/components/beta-menu/beta-menu.component';
import { BetaGeneralComponent } from 'src/app/components/beta-general/beta-general.component';
import { InputSearchComponent } from 'src/app/components/input-search/input-search.component';

@NgModule({
  declarations: [
    PacientPanelComponent,
    SidebarComponent,
    PatientDashboardComponent,
    MedicComponent,
    ProfileComponent,
    BetaGraphComponent,
  ],
  imports: [
    CommonModule,
    RouterOutlet,
    PacientPanelRoutes,
    SharedModule,
    HeaderComponent,
    UploadComponentComponent,
    DetailsCardComponent,
    BetaMenuComponent,
    BetaGeneralComponent,
    InputSearchComponent,
  ],
})
export class PacientPanelModule {}
