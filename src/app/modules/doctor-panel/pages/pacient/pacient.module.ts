import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PacientComponent} from './pacient.component';
import {GetStartedComponent} from './get-started/get-started.component';
import {RouterOutlet} from '@angular/router';
import {PacientRoutes} from './pacient.routes';
import {UploadComponentComponent} from '../../../../components/upload-component/upload-component.component';

@NgModule({
  declarations: [PacientComponent, GetStartedComponent],
  imports: [CommonModule, RouterOutlet, PacientRoutes, UploadComponentComponent],
})
export class PacientModule {}
