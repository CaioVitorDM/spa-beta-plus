import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';

export const routes: Routes = [
  {path: '', redirectTo: 'pacient', pathMatch: 'full'},
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
