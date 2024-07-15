import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterOutlet} from '@angular/router';
import {InputSearchComponent} from 'src/app/components/input-search/input-search.component';
import {CustomSelectComponent} from 'src/app/components/custom-select/custom-select.component';
import {UploadFileComponent} from 'src/app/components/upload-file/upload-file.component';
import {BetaGeneralComponent} from './components/beta-general/beta-general.component';
import {BetaMenuComponent} from './components/beta-menu/beta-menu.component';
import {BetaPopUpComponent} from './components/beta-pop-up/beta-pop-up.component';
import {ViewBetaComponent} from './view-beta/view-beta.component';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BetaGraphRoutes } from './beta-graph.routes';
import { BetaEditComponent } from './components/beta-edit/beta-edit.component';

@NgModule({
  declarations: [ViewBetaComponent, BetaGeneralComponent, BetaMenuComponent, BetaPopUpComponent, BetaEditComponent],
  imports: [
    CommonModule,
    RouterOutlet,
    BetaGraphRoutes,
    InputSearchComponent,
    CustomSelectComponent,
    UploadFileComponent,
    FormsModule,
    MatMenu,
    MatMenuTrigger,
    ReactiveFormsModule
  ],
})
export class BetaGraphModule {}