import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-beta-date-filter',
  standalone: true,
  imports: [],
  templateUrl: './beta-date-filter.component.html',
  styleUrl: './beta-date-filter.component.scss'
})
export class BetaDateFilterComponent {
  constructor(public dialogRef: MatDialogRef<BetaDateFilterComponent>) {}

  onClose(): void {
    this.dialogRef.close();
  }
}

