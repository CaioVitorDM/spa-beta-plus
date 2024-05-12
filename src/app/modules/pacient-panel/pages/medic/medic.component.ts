import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../../../services/auth/auth.service';
import {FileService} from '../../../../services/file-service/file.service';
import {HeaderService} from '../../../../services/header/header-info.service';

@Component({
  selector: 'app-medic',
  templateUrl: './medic.component.html',
  styleUrl: './medic.component.scss',
})
export class MedicComponent implements OnInit {
  imageSrc!: string;
  medicName!: string;
  details!: {label: string; value: string}[];
  constructor(
    private authService: AuthService,
    private fileService: FileService,
    private headerService: HeaderService
  ) {}

  ngOnInit(): void {
    this.headerService.setTitulo('Médico');
    this.fetchUser(this.authService.getUserLogged?.id!);
  }

  fetchUser(id: number) {
    this.authService.getUserDetails(id).subscribe({
      next: (response) => {
        if (response.data.patient?.doctorId) {
          this.fetchMedic(response.data.patient.doctorId);
        }
      },
      error: (err) => {
        console.error('Erro ao buscar detalhes do médico:', err);
      },
    });
  }

  fetchImage(imgId: number) {
    this.fileService.getInlineImage(imgId).subscribe({
      next: (blob) => {
        this.imageSrc = URL.createObjectURL(blob);
      },
      error: (err) => {
        console.error('Erro ao carregar imagem:', err);
      },
    });
  }

  fetchMedic(id: number) {
    this.authService.getMedicDetails(id).subscribe({
      next: (response) => {
        if (response.data.imgId) {
          this.fetchImage(response.data.imgId);
        }
        this.details = [
          {
            label: 'Telefone',
            value: this.formatPhoneNumber(response.data.phoneNumber),
          },
          {
            label: 'E-mail',
            value: response.data.email,
          },
          {
            label: 'CRM',
            value: response.data.doctor?.crm!,
          },
        ]; // Certifique-se que a API retorna a propriedade `data`
        this.medicName = response.data.doctor?.name!; // Exemplo, ajuste conforme a resposta
      },
      error: (err) => {
        console.error('Erro ao buscar detalhes do médico:', err);
      },
    });
  }

  formatPhoneNumber(phoneNumber: string): string {
    // Remove caracteres não numéricos
    const cleaned = ('' + phoneNumber).replace(/\D/g, '');

    // Checa se o número possui um formato válido e aplica a máscara
    if (cleaned.length === 11) {
      const match = cleaned.match(/^(\d{2})(\d{5})(\d{4})$/);
      if (match) {
        return `(${match[1]}) ${match[2]}-${match[3]}`;
      }
    }
    if (cleaned.length === 10) {
      const match = cleaned.match(/^(\d{2})(\d{4})(\d{4})$/);
      if (match) {
        return `(${match[1]}) ${match[2]}-${match[3]}`;
      }
    }

    return phoneNumber;
  }
}
