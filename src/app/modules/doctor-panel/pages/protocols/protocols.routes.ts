import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GetStartedComponent } from './get-started/get-started.component';
import { CreateProtocolComponent } from './create-protocol/create-protocol.component';
import { EditProtocolComponent } from './edit-protocol/edit-protocol.component';
import { ProtocolDetailsComponent } from './protocol-details/protocol-details.component';

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
  {
    path: 'create',
    component: CreateProtocolComponent,
  }, 
  {
    path: 'edit/:id',
    component: EditProtocolComponent,
  },
  {
    path: 'details/:id',
    component: ProtocolDetailsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProtocolsRoutes { }
