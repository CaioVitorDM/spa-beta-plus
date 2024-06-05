import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subject, Subscription } from 'rxjs';
import { FormUtilsService } from 'src/app/services/form-utils/form-utils.service';
import { HeaderService } from 'src/app/services/header/header-info.service';
import { AppointmentsFormService } from '../service/appointments-form.service';
import { AppointmentService } from 'src/app/services/appointment/appointment.service';
import { LineLoadingService } from 'src/app/services/line-loading/line-loading.service';
import { SnackbarService } from 'src/app/services/snackbar/snackbar.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/models/User';
import { Appointment } from 'src/app/models/Appointment';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-create-appointment',
  templateUrl: './create-appointment.component.html',
  styleUrl: './create-appointment.component.scss'
})
export class CreateAppointmentComponent {

  createAppointmentSubscription!: Subscription;
  private destroy$ = new Subject<void>();
  appointmentForm: FormGroup;
  isLoading = false;
  formUtils: FormUtilsService;

  constructor(
    private headerService: HeaderService,
    private appointmentFormService: AppointmentsFormService,
    private appointmentService: AppointmentService,
    private lineLoadingService: LineLoadingService,
    private snackbar: SnackbarService,
    private formUtilsService: FormUtilsService,
    private authService: AuthService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) {
    this.headerService.setTitulo('Cadastro de Consultas');
    this.appointmentForm = this.appointmentFormService.form;
    this.formUtils = this.formUtilsService;
  }



  onSubmit() {
    if (this.appointmentForm.valid) {
      this.lineLoadingService.show();

      this.appointmentForm.get('doctorId')?.setValue(this.authService.doctorId);
      const formDataAppointment = this.appointmentForm.value;


      this.createAppointmentSubscription = this.appointmentService.create(formDataAppointment).subscribe({
        next: (result: Appointment) => {
          this.handleSuccess();
        },
        error: (error: HttpErrorResponse) => {
          this.onError(error);
        },
      });
      
    } else {
      this.formUtils.validateAllFormFields(this.appointmentForm);
      this.snackbar.open('Atenção! Campos obrigatórios não preenchidos');
    }
  }

  private handleSuccess() {
    this.isLoading = false;
    this.appointmentFormService.resetForm();
    this.appointmentFormService.onSuccess();
  }

  private onError(error: Error) {
    if (error instanceof HttpErrorResponse) {
      this.snackbar.open(error.error.error.message);
    }
    this.lineLoadingService.hide();
  }

  
  navigateBack() {
    this.router.navigate(['/doctor-panel/appointments'], {relativeTo: this.activatedRoute});
  }

}
