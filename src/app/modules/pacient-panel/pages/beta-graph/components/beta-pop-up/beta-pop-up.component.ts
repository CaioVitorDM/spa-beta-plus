import {Component} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {MatDialogRef} from '@angular/material/dialog';
import { BetaService } from 'src/app/services/beta/beta.service';

@Component({
  selector: 'app-beta-pop-up',

  templateUrl: './beta-pop-up.component.html',
  styleUrls: ['./beta-pop-up.component.scss'],
})
export class BetaPopUpComponent {

  betaForm: FormGroup;

  constructor(
    private dialogRef: MatDialogRef<BetaPopUpComponent>,
    private fb: FormBuilder,
    private betaService: BetaService
  ) {
    this.betaForm = this.fb.group({
      date: ['', Validators.required],
      value: ['', Validators.required],
    });
  }
  onClose(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (this.betaForm.valid) {
      this.betaService.create(this.betaForm.value).subscribe(
        (response) => {
          this.dialogRef.close(response);
        },
        (error) => {
          console.error('Error creating beta', error);
        }
      );
    }
  }
}