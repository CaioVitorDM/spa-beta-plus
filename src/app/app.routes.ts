import {RouterModule, Routes} from '@angular/router';
import {GetStartedComponent} from './pages/get-started/get-started.component';
import {NgModule} from '@angular/core';
import {LoginPageComponent} from './pages/login-page/login-page.component';
import {RegisterPageComponent} from './pages/register-page/register-page.component';
import {DoctorPanelComponent} from './modules/doctor-panel/doctor-panel.component';
import {PacientPanelComponent} from './modules/pacient-panel/pacient-panel.component';

export const routes: Routes = [
  {path: 'welcome', component: GetStartedComponent},
  {path: 'login-page', component: LoginPageComponent},
  {path: 'register-page', component: RegisterPageComponent},
  {
    path: '',
    redirectTo: 'login-page',
    pathMatch: 'full',
  },
  {
    path: 'doctor-panel',
    component: DoctorPanelComponent,
    /*canActivate: [authGuard],
    canActivateChild: [authGuard],*/
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./modules/doctor-panel/doctor-panel.module').then((m) => m.DoctorPanelModule),
      },
    ],
    /*data: {
      roles: [Role.ADMIN],
    },*/
  },
  {
    path: 'pacient-panel',
    component: PacientPanelComponent,
    /*canActivate: [authGuard],
    canActivateChild: [authGuard],*/
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./modules/pacient-panel/pacient-panel.module').then((m) => m.PacientPanelModule),
      },
    ],
    /*data: {
      roles: [Role.ADMIN],
    },*/
  },
  {path: '**', redirectTo: 'login-page'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutes {}
