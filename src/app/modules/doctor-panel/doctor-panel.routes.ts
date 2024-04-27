import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {DoctorPanelComponent} from './doctor-panel.component';

export const routes: Routes = [{path: 'doctor-panel', component: DoctorPanelComponent}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DoctorPanelRoutes {}
