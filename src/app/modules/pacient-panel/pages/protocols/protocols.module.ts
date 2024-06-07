import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GetStartedComponent } from './get-started/get-started.component';
import { RouterOutlet } from '@angular/router';
import { ProtocolsRoutes } from './protocols.routes';
import { ProtocolsCardComponent } from './components/protocols-card/protocols-card.component';
import { InputSearchComponent } from 'src/app/components/input-search/input-search.component';
import { CustomSelectComponent } from 'src/app/components/custom-select/custom-select.component';
import { ProtocolDetailsComponent } from './protocol-details/protocol-details.component';
import { ProtocolInfoComponent } from './components/protocol-info/protocol-info.component';
import { UploadFileComponent } from 'src/app/components/upload-file/upload-file.component';



@NgModule({
  declarations: [GetStartedComponent, 
                 ProtocolsCardComponent, 
                 ProtocolDetailsComponent,
                 ProtocolInfoComponent],
  imports: [
    CommonModule,
    RouterOutlet,
    ProtocolsRoutes,
    InputSearchComponent,
    CustomSelectComponent,
    UploadFileComponent
  ]
})
export class ProtocolsModule { }
