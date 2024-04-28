import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';

import {LineLoadingComponent} from './components/line-loading/line-loading.component';
import {MatProgressBar} from '@angular/material/progress-bar';

@NgModule({
  imports: [CommonModule, RouterModule, MatProgressBar],
  declarations: [LineLoadingComponent],
  exports: [LineLoadingComponent],
  providers: [],
})
export class SharedModule {}
