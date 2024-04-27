import {Component} from '@angular/core';
import {LineLoadingService} from '../../../services/line-loading/line-loading.service';

@Component({
  selector: 'app-line-loading',
  template: `
    <mat-progress-bar mode="indeterminate" *ngIf="isLoading$ | async"></mat-progress-bar>
  `,
})
export class LineLoadingComponent {
  isLoading$ = this.lineLoadingService.isLoading$;

  constructor(private lineLoadingService: LineLoadingService) {}
}
