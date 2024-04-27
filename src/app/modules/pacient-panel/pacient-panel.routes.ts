import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {PacientPanelComponent} from './pacient-panel.component';

export const routes: Routes = [{path: 'pacient-panel', component: PacientPanelComponent}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PacientPanelRoutes {}
