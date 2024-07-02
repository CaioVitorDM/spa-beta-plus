import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { AppointmentsFormComponent } from '../components/appointments-form/appointments-form.component';
import { FormUtilsService } from 'src/app/services/form-utils/form-utils.service';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AppointmentsFormService } from '../service/appointments-form.service';
import { AppointmentService } from 'src/app/services/appointment/appointment.service';
import { LineLoadingService } from 'src/app/services/line-loading/line-loading.service';
import { SnackbarService } from 'src/app/services/snackbar/snackbar.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { Subscription } from 'rxjs';
import { Appointment } from 'src/app/models/Appointment';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-edit-appointment',
  templateUrl: './edit-appointment.component.html',
  styleUrl: './edit-appointment.component.scss'
})
export class EditAppointmentComponent implements OnInit {
  @ViewChild(AppointmentsFormComponent) appointmentFormComponent!: AppointmentsFormComponent;
  appointment?: number;

  formUtils: FormUtilsService;
  appointmentForm: FormGroup;
  
  isLoading = false;

  editAppointmentSubscription!: Subscription;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private appointmentFormService: AppointmentsFormService,
    private appointmentService: AppointmentService,
    private lineLoadingService: LineLoadingService,
    private snackbar: SnackbarService,
    private formUtilsService: FormUtilsService,
    private authService: AuthService

  ) {
    this.appointmentForm = this.appointmentFormService.form;
    this.formUtils = this.formUtilsService;
  }
  ngOnInit() {
    const {id} = this.activatedRoute.snapshot.params;

    if (id) {
      this.appointment = id;
    }
  }

  navigateBack() {
    this.router.navigate(['/doctor-panel/appointments'], {relativeTo: this.activatedRoute});
  }

  
  onSubmit() {
    if (this.appointmentForm.valid) {
      this.lineLoadingService.show();

      this.appointmentForm.get('doctorId')?.setValue(this.authService.doctorId);
      const formDataAppointment = this.appointmentForm.value;

    
      this.editAppointmentSubscription = this.appointmentService.edit(formDataAppointment).subscribe({
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
    this.appointmentFormService.onSuccess(true);
  }

  private onError(error: Error) {
    if (error instanceof HttpErrorResponse) {
      this.snackbar.open(error.error.error.message);
    }
    this.lineLoadingService.hide();
  }



}

