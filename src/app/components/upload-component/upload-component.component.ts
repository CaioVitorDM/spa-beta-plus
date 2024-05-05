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
  @Output() fileSelected = new EventEmitter<string | ArrayBuffer>();
  filePath!: string;

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const result = e.target.result;
        this.filePath = result;
        this.fileSelected.emit(result as string); // Emitindo o caminho/processado da imagem
      };
      reader.readAsDataURL(file);
    }
  }
}
