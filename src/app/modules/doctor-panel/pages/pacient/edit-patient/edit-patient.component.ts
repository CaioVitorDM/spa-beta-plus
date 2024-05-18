import {AfterViewInit, ChangeDetectorRef, Component, Input, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {FileService} from '../../../../../services/file-service/file.service';
import {PatientFormService} from '../components/patient-form/service/patient-form.service';
import {PatientService} from '../services/patient.service';
import {FormUtilsService} from '../../../../../services/form-utils/form-utils.service';
import {FormGroup} from '@angular/forms';
import {PatientFormComponent} from '../components/patient-form/patient-form.component';

@Component({
  selector: 'app-edit-patient',
  templateUrl: './edit-patient.component.html',
  styleUrl: './edit-patient.component.scss',
})
export class EditPatientComponent implements OnInit, AfterViewInit {
  @ViewChild(PatientFormComponent) patientFormComponent!: PatientFormComponent;
  patient?: number;
  uploadingFile!: File;
  imageSrc!: string;
  formUtils: FormUtilsService;
  patientForm: FormGroup;

  constructor(
    private activatedRoute: ActivatedRoute,
    private fileService: FileService,
    private patientFormService: PatientFormService,
    private patientService: PatientService,
    private formUtilsService: FormUtilsService
  ) {
    this.patientForm = this.patientFormService.form;
    this.formUtils = this.formUtilsService;
  }
  ngOnInit() {
    const {id} = this.activatedRoute.snapshot.params;

    if (id) {
      this.patient = id;
    }
  }

  ngAfterViewInit() {
    this.patientFormComponent.formLoaded.subscribe(() => {
      const fileId = this.patientFormComponent.patientForm.get('fileId')?.value;
      this.fetchImage(fileId);
    });
  }

  handleSelectedFile(file: File): void {
    this.uploadingFile = file;
  }

  fetchImage(imgId: number) {
    console.log(imgId);
    this.fileService.getInlineImage(imgId).subscribe({
      next: (blob) => {
        this.imageSrc = URL.createObjectURL(blob);
      },
      error: (err) => {
        console.error('Erro ao carregar imagem:', err);
      },
    });
  }
}
