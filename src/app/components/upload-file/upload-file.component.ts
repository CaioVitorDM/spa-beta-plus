import {NgClass, NgIf} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {Component, EventEmitter, Input, Output} from '@angular/core';
import { FileService } from 'src/app/services/file-service/file.service';
import { SnackbarService } from 'src/app/services/snackbar/snackbar.service';
import { HttpErrorResponse } from '@angular/common/http';
import { apiErrorStatusMessage } from 'src/app/constants/messages';

@Component({
  selector: 'app-upload-file',
  standalone: true,
  imports: [NgIf, NgClass],
  templateUrl: './upload-file.component.html',
  styleUrls: ['./upload-file.component.scss'],
})
export class UploadFileComponent {
  @Output() fileSelected = new EventEmitter<File>();

  @Input() isReadOnly: boolean = false;
  @Input() fileName: string = '';
  @Input() errorMessage: string = '';

  @Input() fileId: number | null = null;  
  uploadingFile: File | null = null;

  constructor(
    private fileService: FileService,
    private snackbar: SnackbarService
  ) {}

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.fileName = file.name;
      this.uploadingFile = file;
      this.fileId = null;
      this.fileSelected.emit(file); // Emitindo o caminho/processado da imagem
    }
    this.errorMessage = '';
  }

  handleUploadAttempt(): void {
    if (!this.uploadingFile && !this.fileId) { 
      this.errorMessage = 'Por favor, escolha um arquivo.';
    }
  }

  downloadFile() {
    if (this.fileId) {
      this.fileService.getInlineImage(this.fileId).subscribe({
        next: (blob) => {
          const url = window.URL.createObjectURL(blob);
          window.open(url, '_blank');
        },
        error: (error) => {
          this.snackbar.open(apiErrorStatusMessage[error.status])
        },
      });
    } else if (this.uploadingFile) {
      const url = window.URL.createObjectURL(this.uploadingFile);
      window.open(url, '_blank');
    } else {
      this.snackbar.open('Nenhum arquivo disponível para download.');
    }
  }
  
}
