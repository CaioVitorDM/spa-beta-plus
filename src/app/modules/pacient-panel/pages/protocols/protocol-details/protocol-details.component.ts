import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FileService } from 'src/app/services/file-service/file.service';
import { HeaderService } from 'src/app/services/header/header-info.service';
import { ProtocolService } from 'src/app/services/protocol/protocol.service';

@Component({
  selector: 'app-protocol-details',
  templateUrl: './protocol-details.component.html',
  styleUrl: './protocol-details.component.scss'
})
export class ProtocolDetailsComponent {

  protocol?: number;
  fileName!: string;

  constructor(
    private activatedRoute: ActivatedRoute,
    private fileService: FileService,
    private protocolService: ProtocolService,
    private router: Router,
    private headerService: HeaderService
  ) {
    this.headerService.setTitulo('Detalhes de Protocolos');
  }

  ngOnInit() {
    const {id} = this.activatedRoute.snapshot.params;

    if (id) {
      this.protocol = id;
    }
  }

  fetchFile(fileId: number) {
    this.fileService.downloadImage(fileId).subscribe({
      next: (file) => {
       this.fileName = file.name;

      },
      error: (err) => {
        console.error('Erro ao carregar arquivo:', err);
      },
    });
  }


  navigateBack() {
    this.router.navigate(['/patient-panel/protocols'], {relativeTo: this.activatedRoute});
  }

}
