import {Component, EventEmitter, Input, Output} from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';
import { NgClass, NgIf } from '@angular/common';

@Component({
  selector: 'app-upload-exams',
  standalone: true,
  imports: [NgIf, NgClass],
  templateUrl: './upload-exams.component.html',
  styleUrl: './upload-exams.component.scss',
})
export class UploadExamsComponent {
  @Output() fileSelected = new EventEmitter<File>();

  @Input() fileName: string = '';
  @Input() errorMessage: string = 'Por favor, escolha um arquivo.';

  constructor(public dialogRef: MatDialogRef<UploadExamsComponent>) {}

  onClose(): void {
    this.dialogRef.close();
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.fileName = file.name;
      this.errorMessage = '';
      this.fileSelected.emit(file); // Emitindo o caminho/processado da imagem
      console.log('emitindo');
    }
  }
}
