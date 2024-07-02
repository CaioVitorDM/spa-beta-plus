import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProtocolList } from 'src/app/models/Protocol';
import { FileService } from 'src/app/services/file-service/file.service';
import { SnackbarService } from 'src/app/services/snackbar/snackbar.service';

@Component({
  selector: 'app-protocols-card',
  templateUrl: './protocols-card.component.html',
  styleUrl: './protocols-card.component.scss'
})
export class ProtocolsCardComponent {

  @Input() dataSource: ProtocolList[] = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private fileService: FileService,
    private snackbar: SnackbarService
  ) {}


  detailsProtocol(id: number) {
    this.router.navigate([`/patient-panel/protocols/details/${id}`], {relativeTo: this.activatedRoute});
  }

  downloadFile(fileId: number, event: MouseEvent): void {
    event.stopPropagation(); 
    if (fileId) {
      this.fileService.getInlineImage(fileId).subscribe({
        next: (blob) => {
          const url = window.URL.createObjectURL(blob);
          window.open(url, '_blank');
          window.URL.revokeObjectURL(url); 
        },
        error: (error) => {
          if (error instanceof HttpErrorResponse) {
            this.snackbar.open(error.error.message);
          } 
        },
      });
    } else {
      this.snackbar.open('Nenhum arquivo disponível para download.');
    }
  }


}
