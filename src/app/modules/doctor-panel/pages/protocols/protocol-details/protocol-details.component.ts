import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FileService } from 'src/app/services/file-service/file.service';
import { HeaderService } from 'src/app/services/header/header-info.service';
import { ProtocolsFormComponent } from '../components/protocols-form/protocols-form.component';
import { FormGroup } from '@angular/forms';
import { ProtocolsFormService } from '../components/protocols-form/service/protocols-form.service';
import { FormUtilsService } from 'src/app/services/form-utils/form-utils.service';
import { ProtocolService } from 'src/app/services/protocol/protocol.service';

@Component({
  selector: 'app-protocol-details',
  templateUrl: './protocol-details.component.html',
  styleUrl: './protocol-details.component.scss'
})
export class ProtocolDetailsComponent implements OnInit , AfterViewInit{

  @ViewChild(ProtocolsFormComponent) protocolsFormComponent!: ProtocolsFormComponent;
  protocol?: number;
  uploadingFile!: File;
  fileName!: string;
  fileId!: number;
  formUtils: FormUtilsService;
  protocolForm: FormGroup;

  selectedPatients: number[] = [];
  showPatientsSelector = false;

  returnUrl: string = '/doctor-panel/protocols';

  constructor(
    private activatedRoute: ActivatedRoute,
    private fileService: FileService,
    private protocolFormService: ProtocolsFormService,
    private protocolService: ProtocolService,
    private formUtilsService: FormUtilsService,
    private router: Router,
    private headerService: HeaderService
  ) {
    this.protocolForm = this.protocolFormService.form;
    this.formUtils = this.formUtilsService;
    this.headerService.setTitulo('Detalhes de Protocolos');
  }
  ngOnInit() {
    const {id} = this.activatedRoute.snapshot.params;

    if (id) {
      this.protocol = id;
    }

    this.activatedRoute.queryParams.subscribe(params => {
      this.returnUrl = params['returnUrl'] || '/doctor-panel/protocols';
    });
  }

  ngAfterViewInit() {
    this.protocolsFormComponent.formLoaded.subscribe(() => {
      this.fileId = this.protocolsFormComponent.protocolForm.get('fileId')?.value;
      this.selectedPatients =  this.protocolsFormComponent.protocolForm.get('patientsIdList')?.value;
      this.fetchFile(this.fileId);
    });
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

  handleSelectedFile(file: File): void {
    this.uploadingFile = file;
  }


  togglePatientsSelector(isSpecific: boolean) {
    this.showPatientsSelector = isSpecific;
  }

  navigateBack() {
    this.router.navigateByUrl(this.returnUrl);
  }
}
