import {RouterModule, Routes} from '@angular/router';
import {GetStartedComponent} from './pages/get-started/get-started.component';
import {NgModule} from '@angular/core';
import {LoginPageComponent} from './pages/login-page/login-page.component';
import {RegisterPageComponent} from './pages/register-page/register-page.component';
import {PacientPanelComponent} from './modules/pacient-panel/pacient-panel.component';
import {DoctorPanelComponent} from './modules/doctor-panel/doctor-panel.component';
import {authGuard} from './guards/auth.guard';
import {Role} from './models/Role';
import {noAuthGuard} from './guards/no-auth.guard';

export const routes: Routes = [
  {path: 'welcome', component: GetStartedComponent, canActivate: [noAuthGuard]},
  {path: 'login-page', component: LoginPageComponent, canActivate: [noAuthGuard]},
  {path: 'register-page', component: RegisterPageComponent, canActivate: [noAuthGuard]},
  {
    path: '',
    redirectTo: 'login-page',
    pathMatch: 'full',
  },
  {
    path: 'doctor-panel',
    component: DoctorPanelComponent,
    canActivate: [authGuard],
    canActivateChild: [authGuard],
    children: [
      {
        path: '',
        loadChildren: () =>
          import('src/app/modules/doctor-panel/doctor-panel.module').then(
            (m) => m.DoctorPanelModule
          ),
      },
    ],
    data: {
      roles: [Role.MEDIC],
    },
  },
  {
    path: 'patient-panel',
    component: PacientPanelComponent,
    canActivate: [authGuard],
    canActivateChild: [authGuard],
    children: [
      {
        path: '',
        loadChildren: () =>
          import('src/app/modules/pacient-panel/pacient-panel.module').then(
            (m) => m.PacientPanelModule
          ),
      },
    ],
    data: {
      roles: [Role.PATIENT],
    },
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {enableTracing: true})],
  exports: [RouterModule],
})
export class AppRoutes {}
