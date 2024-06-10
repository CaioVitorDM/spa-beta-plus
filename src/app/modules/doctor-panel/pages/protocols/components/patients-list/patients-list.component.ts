import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EMPTY, Subscription, catchError } from 'rxjs';
import { ItemSelect } from 'src/app/components/custom-select/custom-select.component';
import { apiErrorStatusMessage } from 'src/app/constants/messages';
import { User } from 'src/app/models/User';
import { AuthService } from 'src/app/services/auth/auth.service';
import { LineLoadingService } from 'src/app/services/line-loading/line-loading.service';
import { PatientService } from 'src/app/services/patient/patient.service';
import { SnackbarService } from 'src/app/services/snackbar/snackbar.service';
import { PatientList } from '../patients-selector/patients-selector.component';

@Component({
  selector: 'app-patients-list',
  templateUrl: './patients-list.component.html',
  styleUrl: './patients-list.component.scss'
})
export class PatientsListComponent {

  @Input() selectedPatients: number[] = [];

  patients: PatientList[] = [];
  loadPatientsSubscription = new Subscription();
  isLoading: boolean = false;
  isError: boolean = false;

  
  message: string = 'Por favor, escolha pelo menos um paciente.';
  
  name: string | null = '';
  login: string | null = '';
  
  constructor(
              private patientService: PatientService,
              private authService: AuthService,
              private route: ActivatedRoute,
              private lineLoadingService: LineLoadingService,
              private snackbar: SnackbarService,
            ) {}

   ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.name = params['name'] || this.name;
      this.login = params['login'] || this.login;

      this.loadPatients();
    });
  }



  loadPatients() {
    this.loadPatientsSubscription = this.patientService
      .getPatientsByDoctor({
        name: this.name!,
        login: this.login!,
        doctorId: this.authService.doctorId!,
      })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          this.isLoading = false;
          this.isError = true;
          this.snackbar.open(apiErrorStatusMessage[error.status]);
          this.lineLoadingService.hide();
          return EMPTY;
        })
      )
      .subscribe({
        next: (protocols) => {
          this.onSuccess(protocols);
        },
        error: (_error) => {
          this.lineLoadingService.hide();
        },
      });
  }

  onSuccess(patients: User[]) {
    this.isLoading = false;
    this.isError = false;
    this.patients = patients
      .map((user): PatientList => {
        return {
          id: user.patient?.id,
          name: user.patient?.name || '',
          login: user.login || '',
        };
      })
      .filter(patient => this.selectedPatients.includes(patient.id!));

    this.lineLoadingService.hide();
  }
}

