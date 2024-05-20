import {NgClass, NgIf} from '@angular/common';
import {FormsModule} from '@angular/forms';
import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-upload-file',
  standalone: true,
  imports: [NgIf, NgClass],
  templateUrl: './upload-file.component.html',
  styleUrls: ['./upload-file.component.scss']
})
export class UploadFileComponent {
  
  @Output() fileSelected = new EventEmitter<File>();
  filePath!: string;

  fileName: string = '';
  errorMessage: string = '';
  dialogOpened: boolean = false;

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.fileName = file.name;
      this.errorMessage = '';
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.filePath = e.target.result;
        this.fileSelected.emit(file); // Emitindo o caminho/processado da imagem
      };
    }

    clearTimeout(this.timer);
  }

  timer: any = null;

  onClickInput(event: any): void {
    this.dialogOpened = true;
    this.errorMessage = ''; 
    event.target.value = null; 

    this.timer = setTimeout(() => {
      if (!this.fileName && this.dialogOpened) {
        this.errorMessage = 'Arquivo não selecionado. Por favor, escolha um arquivo.';
        this.dialogOpened = false;
      }
    }, 500); 
  }
}
