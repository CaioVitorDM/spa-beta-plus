import {RouterModule, Routes} from '@angular/router';
import {GetStartedComponent} from './pages/get-started/get-started.component';
import {NgModule} from '@angular/core';
import {LoginPageComponent} from './pages/login-page/login-page.component';
import {RegisterPageComponent} from './pages/register-page/register-page.component';

export const routes: Routes = [
  {path: 'welcome', component: GetStartedComponent},
  {path: 'login-page', component: LoginPageComponent},
  {path: 'register-page', component: RegisterPageComponent},
  {path: '**', redirectTo: 'login-page'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutes {}
