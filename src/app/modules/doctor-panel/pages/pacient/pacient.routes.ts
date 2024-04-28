import {NgModule} from '@angular/core';
import {GetStartedComponent} from './get-started/get-started.component';
import {RouterModule, Routes} from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'get-started',
    pathMatch: 'full',
  },
  {
    path: 'get-started',
    component: GetStartedComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PacientRoutes {}
