import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';

import {MenuItemComponent} from './components/menu-item/menu-item.component';
import {LineLoadingComponent} from './components/line-loading/line-loading.component';
import {MatProgressBar} from '@angular/material/progress-bar';

@NgModule({
  imports: [CommonModule, RouterModule, MatProgressBar],
  declarations: [MenuItemComponent, LineLoadingComponent],
  exports: [MenuItemComponent, LineLoadingComponent],
  providers: [],
})
export class SharedModule {}
