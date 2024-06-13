import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ViewBetaComponent } from './view-beta/view-beta.component';


const routes: Routes = [
  {
    path: 'view-beta',
    component: ViewBetaComponent
  },
  {
    path: '',
    redirectTo: 'view-beta',
    pathMatch: 'full',
  },
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BetaGraphRoutes { }