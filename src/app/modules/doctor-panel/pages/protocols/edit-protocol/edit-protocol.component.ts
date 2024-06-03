import { Component, ViewChild } from '@angular/core';
import { ProtocolsFormComponent } from '../components/protocols-form/protocols-form.component';
import { Protocol } from 'src/app/models/Protocol';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FileService } from 'src/app/services/file-service/file.service';
import { FormUtilsService } from 'src/app/services/form-utils/form-utils.service';
import { LineLoadingService } from 'src/app/services/line-loading/line-loading.service';
import { SnackbarService } from 'src/app/services/snackbar/snackbar.service';
import { ProtocolsFormService } from '../components/protocols-form/service/protocols-form.service';
import { HeaderService } from 'src/app/services/header/header-info.service';
import { ProtocolService } from 'src/app/services/protocol/protocol.service';

@Component({
  selector: 'app-edit-protocol',
  templateUrl: './edit-protocol.component.html',
  styleUrl: './edit-protocol.component.scss'
})
export class EditProtocolComponent {

  @ViewChild(ProtocolsFormComponent) protocolsFormComponent!: ProtocolsFormComponent;
  protocol?: number;
  uploadingFile!: File;
  fileName!: string;
  formUtils: FormUtilsService;
  protocolForm: FormGroup;

  selectedPatients: number[] = [];
  showPatientsSelector = false;

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
    this.headerService.setTitulo('Edição de Protocolos');
  }
  ngOnInit() {
    const {id} = this.activatedRoute.snapshot.params;

    if (id) {
      this.protocol = id;
    }
  }

  ngAfterViewInit() {
    this.protocolsFormComponent.formLoaded.subscribe(() => {
      const fileId = this.protocolsFormComponent.protocolForm.get('fileId')?.value;
      this.selectedPatients =  this.protocolsFormComponent.protocolForm.get('patientsIdList')?.value;
      this.fetchFile(fileId);
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
    this.router.navigate(['/doctor-panel/protocols'], {relativeTo: this.activatedRoute});
  }
}
