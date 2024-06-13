import { Component } from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';


@Component({
  selector: 'app-beta-edit',
  templateUrl: './beta-edit.component.html',
  styleUrl: './beta-edit.component.scss'
})
export class BetaEditComponent {
  constructor(public dialogRef: MatDialogRef<BetaEditComponent>) {}

  onClose(): void {
    this.dialogRef.close();
  }
}
