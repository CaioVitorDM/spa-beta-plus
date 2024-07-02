import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FileService } from 'src/app/services/file-service/file.service';
import { HeaderService } from 'src/app/services/header/header-info.service';
import { ProtocolService } from 'src/app/services/protocol/protocol.service';
import { ProtocolInfoComponent } from '../components/protocol-info/protocol-info.component';

@Component({
  selector: 'app-protocol-details',
  templateUrl: './protocol-details.component.html',
  styleUrl: './protocol-details.component.scss'
})
export class ProtocolDetailsComponent  implements AfterViewInit {
  @ViewChild(ProtocolInfoComponent) protocolInfo!: ProtocolInfoComponent;

  protocol?: number;
  fileName!: string;
  fileId!: number;


  constructor(
    private activatedRoute: ActivatedRoute,
    private fileService: FileService,
    private protocolService: ProtocolService,
    private router: Router,
    private headerService: HeaderService
  ) {
    this.headerService.setTitulo('Detalhes de Protocolos');
  }

  ngAfterViewInit(): void {
    this.protocolInfo.protocolData$.subscribe(protocolData => {
      if (protocolData && protocolData.fileId) {
        this.fileId = protocolData.fileId;
        this.fetchFile(this.fileId);
      }
    });
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
