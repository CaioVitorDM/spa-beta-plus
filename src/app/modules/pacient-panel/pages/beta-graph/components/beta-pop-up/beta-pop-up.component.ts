import {Component} from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Beta } from 'src/app/models/Beta';
import { SnackbarService } from 'src/app/services/snackbar/snackbar.service';
import { BetaService } from 'src/app/services/beta/beta.service';


@Component({
  selector: 'app-beta-pop-up',

  templateUrl: './beta-pop-up.component.html',
  styleUrls: ['./beta-pop-up.component.scss'],
})
export class BetaPopUpComponent {

  beta: Beta = {
    id: 0,
    patientId: 0,
    doctorId: 0,
    date: '',
    value: 0,
  };

  constructor(
    public dialogRef: MatDialogRef<BetaPopUpComponent>,
    private betaService: BetaService
  ) {}

  onClose(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    this.betaService.create(this.beta).subscribe({
      next: (result) => {
        console.log('Beta created:', result);
        this.dialogRef.close(result);  
      },
      error: (error) => {
        console.error('Error creating beta:', error);
      }
    });
  }
}