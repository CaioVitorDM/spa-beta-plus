import {Component} from '@angular/core';
import {HeaderService} from '../../../../../services/header/header-info.service';
import {FileService} from '../../../../../services/file-service/file.service';
import {Subject, takeUntil} from 'rxjs';

@Component({
  selector: 'app-create-patient',
  templateUrl: './create-patient.component.html',
  styleUrl: './create-patient.component.scss',
})
export class CreatePatientComponent {
  private destroy$ = new Subject<void>();
  uploadingFile!: File;
  imageBlob!: Blob;

  constructor(
    private headerService: HeaderService,
    private fileService: FileService // Injetando o serviço de arquivo
  ) {
    this.headerService.setTitulo('Cadastro de Pacientes');
  }

  handleSelectedFile(imagePath: File): void {
    this.uploadingFile = imagePath;
  }

  private base64ToBlob(base64: string): Blob {
    const byteString = window.atob(base64.split(',')[1]);
    const mimeString = base64.split(',')[0].split(':')[1].split(';')[0];
    const byteNumbers = new Array(byteString.length);
    for (let i = 0; i < byteString.length; i++) {
      byteNumbers[i] = byteString.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], {type: mimeString});
  }

  submitImage(): void {
    const file = this.uploadingFile;
    console.log(file.name);
    console.log(file.type);
    this.fileService.uploadImage(file).subscribe({
      next: (response) => {
        console.log('Imagem enviada com sucesso!', response);
        // Lógica adicional após o upload com sucesso
      },
      error: (error) => {
        console.error('Erro ao enviar imagem', error);
      },
    });
  }
}
