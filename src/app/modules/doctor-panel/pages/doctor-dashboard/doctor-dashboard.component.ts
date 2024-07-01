import {Component, OnDestroy, OnInit} from '@angular/core';
import {HeaderService} from '../../../../services/header/header-info.service';
import {AuthService} from '../../../../services/auth/auth.service';
import {LineLoadingService} from '../../../../services/line-loading/line-loading.service';
import { ProtocolList } from 'src/app/models/Protocol';
import { ProtocolService } from 'src/app/services/protocol/protocol.service';
import { SnackbarService } from 'src/app/services/snackbar/snackbar.service';
import { apiErrorStatusMessage } from 'src/app/constants/messages';
import { Subscription } from 'rxjs';
import { Direction, Page } from 'src/app/models/ApiResponse';
import { AppointmentService } from 'src/app/services/appointment/appointment.service';
import { Appointment } from 'src/app/models/Appointment';

@Component({
  selector: 'app-doctor-dashboard',
  templateUrl: './doctor-dashboard.component.html',
  styleUrl: './doctor-dashboard.component.scss',
})
export class DoctorDashboardComponent implements OnInit, OnDestroy {
  protocols: ProtocolList[] = [];
  doctorName: string = '';
  nextAppointment: string = 'Nenhuma consulta';
  isLoading: boolean = true;
  protocolsLoaded: boolean = false;
  appointmentsLoaded: boolean = false;
  loadProtocolsSubscription: Subscription = new Subscription();
  loadDoctorNameSubscription: Subscription = new Subscription();
  loadAppointmentsSubscription: Subscription = new Subscription();

  constructor(
    private headerService: HeaderService,
    private authService: AuthService,
    private snackbar: SnackbarService,
    private protocolService: ProtocolService,
    private appointmentService: AppointmentService,
    private lineLoadingService: LineLoadingService
  ) {}

  ngOnInit() {
    this.headerService.setTitulo('Dashboard');
    this.lineLoadingService.show();
    this.loadDoctorName();
    this.loadProtocols();
    this.loadNextAppointment();
  }

  private loadDoctorName() {
    const doctorId = this.authService.doctorId;
    if (doctorId) {
      this.loadDoctorNameSubscription = this.authService.getMedicDetails(doctorId).subscribe({
        next: (response) => {
          this.doctorName = response.data.doctor!.name;
          this.checkIfLoadingComplete();
        },
        error: (error) => {
          this.snackbar.open(apiErrorStatusMessage[error.status]);
          this.isLoading = false;
          this.lineLoadingService.hide();
        }
      });
    }
  }

  private loadProtocols() {
    this.loadProtocolsSubscription = this.protocolService.findByDoctorId(this.authService.doctorId!).subscribe({
      next: (protocols) => {
        this.protocols = protocols;
        this.protocolsLoaded = true;
        this.checkIfLoadingComplete();
      },
      error: (error) => {
        this.snackbar.open(apiErrorStatusMessage[error.status]);
        this.isLoading = false;
        this.lineLoadingService.hide();
      }
    });
  }

  
  private loadNextAppointment() {
    const doctorId = this.authService.doctorId;
    if (doctorId) {
      this.loadAppointmentsSubscription = this.appointmentService.getNextAppointment(doctorId).subscribe({
        next: (appointment) => {
          if (appointment) {
            this.nextAppointment = appointment.appointmentDate;
          } else {
            this.nextAppointment = 'Nenhuma consulta';
          }
          this.appointmentsLoaded = true;
          this.checkIfLoadingComplete();
        },
        error: (error) => {
          this.snackbar.open(apiErrorStatusMessage[error.status]);
          this.isLoading = false;
          this.lineLoadingService.hide();
        }
      });
    }
  }

  private checkIfLoadingComplete() {
    if (this.doctorName && this.protocolsLoaded && this.appointmentsLoaded) {
      this.isLoading = false;
      this.lineLoadingService.hide();
    }
  }

  ngOnDestroy() {
    this.loadProtocolsSubscription.unsubscribe();
    this.loadDoctorNameSubscription.unsubscribe();
    this.loadAppointmentsSubscription.unsubscribe();
  }
}