import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AppointmentService } from 'src/app/services/appointment/appointment.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { FormUtilsService } from 'src/app/services/form-utils/form-utils.service';
import { LineLoadingService } from 'src/app/services/line-loading/line-loading.service';
import { SnackbarService } from 'src/app/services/snackbar/snackbar.service';
import { AppointmentsFormService } from '../../service/appointments-form.service';
import { HttpErrorResponse } from '@angular/common/http';
import { apiErrorStatusMessage } from 'src/app/constants/messages';
import { User } from 'src/app/models/User';
import { EMPTY, Subscription, catchError, mergeMap } from 'rxjs';
import { PatientService } from 'src/app/services/patient/patient.service';
import { Role } from 'src/app/models/Role';
import swal from 'sweetalert2';

@Component({
  selector: 'app-appointments-form',
  templateUrl: './appointments-form.component.html',
  styleUrl: './appointments-form.component.scss'
})
export class AppointmentsFormComponent implements OnDestroy, OnInit {
  @Output() formLoaded = new EventEmitter<void>();
  formUtils: FormUtilsService;
  appointmentForm: FormGroup;
  @Input() appointment?: number;

  patients: PatientList[] = [];
  loadPatientsSubscription = new Subscription();
  name: string | null = '';
  login: string | null = '';
  isLoading: boolean = false;
  isError: boolean = false;

  constructor(
    private lineLoadingService: LineLoadingService,
    private snackbar: SnackbarService,
    private formUtilsService: FormUtilsService,
    private appointmentFormService: AppointmentsFormService,
    private appointmentService: AppointmentService,
    private authService: AuthService,
    private patientService: PatientService,
    private router: Router
  ) {
    this.appointmentForm = this.appointmentFormService.form;
    this.formUtils = this.formUtilsService;
  }

  ngOnInit() {
    if (this.appointment) {
      this.loadAppointment(this.appointment);
    }
    this.loadPatients();
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
        next: (patients) => {
          this.onSuccess(patients);
        },
        error: (_error) => {
          this.lineLoadingService.hide();
        },
      });
  }

  onSuccess(patients: User[]) {
    this.isLoading = false;
    this.isError = false;
    this.patients = patients.map((user): PatientList => {
      return {
        id: user.patient?.id,
        name: user.patient?.name || '',
        login: user.login || ''
      };
    });
    this.lineLoadingService.hide();
  }


  ngOnDestroy(): void {
    this.appointmentFormService.resetForm();
  }

  isInputInvalid(field: string): boolean {
    return this.appointmentFormService.isInvalidField(field);
  }

  loadAppointment(id: number) {
    this.appointmentService
      .getOne(id)
      .pipe(
        mergeMap((appointment) => {
          if (
            this.authService.role !== Role.MEDIC 
            // &&
            // user.id !== this.authService.getUserLogged?.id
          ) {
            swal
              .fire({
                icon: 'error',
                title: 'Unathorized!',
                text: 'Você não tem permissão para acessar essa página',
                timer: 3000,
                showConfirmButton: false,
              })
              .then(() => this.router.navigate(['/login-page']));
            return EMPTY;
          }

          this.appointmentForm.patchValue({
            id: appointment.id,
            doctorId: appointment.doctorId,
            description: appointment.description,
            local: appointment.local,
            appointmentDate: appointment.appointmentDate,
            patientId: appointment.patientId
          });

          this.formLoaded.emit();

          return EMPTY;
        }),
        catchError((error: HttpErrorResponse) => {
          this.onError(error);
          return EMPTY;
        })
      )
      .subscribe(() => {});
  }

  private onError(error: Error) {
    if (error instanceof HttpErrorResponse) {
      this.snackbar.open(error.error.error.message);
    } else {
      this.snackbar.open(apiErrorStatusMessage[0]);
    }
    this.lineLoadingService.hide();
  }
}

export interface PatientList {
  id?: number;
  name: string;
  login: string;
}



