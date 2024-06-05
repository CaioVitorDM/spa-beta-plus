import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { AppointmentsFormComponent } from '../components/appointments-form/appointments-form.component';
import { FormUtilsService } from 'src/app/services/form-utils/form-utils.service';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AppointmentsFormService } from '../service/appointments-form.service';
import { AppointmentService } from 'src/app/services/appointment/appointment.service';

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

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private appointmentFormService: AppointmentsFormService,
    private appointmentService: AppointmentService,
    private formUtilsService: FormUtilsService
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



}

