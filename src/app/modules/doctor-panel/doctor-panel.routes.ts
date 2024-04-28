import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {DoctorDashboardComponent} from './pages/doctor-dashboard/doctor-dashboard.component';

export const routes: Routes = [
  {path: '', redirectTo: 'dashboard', pathMatch: 'full'},
  {path: 'dashboard', component: DoctorDashboardComponent},
  {
    path: 'pacient',
    loadChildren: () =>
      import('src/app/modules/doctor-panel/pages/pacient/pacient.module').then(
        (m) => m.PacientModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DoctorPanelRoutes {}
