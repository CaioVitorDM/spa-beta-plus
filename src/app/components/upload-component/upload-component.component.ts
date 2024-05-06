import {Component, EventEmitter, Output} from '@angular/core';
import {NgClass, NgIf} from '@angular/common';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-upload-component',
  standalone: true,
  imports: [NgIf, FormsModule, NgClass],
  templateUrl: './upload-component.component.html',
  styleUrl: './upload-component.component.scss',
})
export class UploadComponentComponent {
  @Output() fileSelected = new EventEmitter<File>();
  filePath!: string;

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.filePath = e.target.result;
        this.fileSelected.emit(file); // Emitindo o caminho/processado da imagem
      };
      reader.readAsDataURL(file);
    }
  }
}
