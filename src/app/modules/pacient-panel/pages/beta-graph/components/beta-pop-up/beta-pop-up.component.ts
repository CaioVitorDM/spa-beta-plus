import {Component} from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-beta-pop-up',

  templateUrl: './beta-pop-up.component.html',
  styleUrls: ['./beta-pop-up.component.scss'],
})
export class BetaPopUpComponent {
  constructor(public dialogRef: MatDialogRef<BetaPopUpComponent>) {}
  onClose(): void {
    this.dialogRef.close();
  }
}