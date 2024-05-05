import {Component} from '@angular/core';
import {HeaderService} from '../../../../../services/header/header-info.service';

@Component({
  selector: 'app-create-patient',
  templateUrl: './create-patient.component.html',
  styleUrl: './create-patient.component.scss',
})
export class CreatePatientComponent {
  filePath!: string | ArrayBuffer;
  imageBlob!: Blob;
  constructor(private headerService: HeaderService) {
    this.headerService.setTitulo('Cadastro de Pacientes');
  }

  handleSelectedFile(imagePath: string | ArrayBuffer): void {
    this.filePath = imagePath;
    this.imageBlob = this.base64ToBlob(this.filePath.toString());
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
}
