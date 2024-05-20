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

  fileName: string = '';
  errorMessage: string = 'Por favor, escolha um arquivo.';
  dialogOpened: boolean = false;

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.fileName = file.name;
      this.errorMessage = '';
      this.fileSelected.emit(file); // Emitindo o caminho/processado da imagem
      console.log("emitindo");
      
    }
  }


}
