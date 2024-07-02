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
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/models/User';

@Component({
  selector: 'app-doctor-dashboard',
  templateUrl: './doctor-dashboard.component.html',
  styleUrls: ['./doctor-dashboard.component.scss'],
})
export class DoctorDashboardComponent implements OnInit, OnDestroy {
  protocols: ProtocolList[] = [];
  doctorName: string = '';
  nextAppointment: string = '';
  recentPatients: User[] = [];
  isLoading: boolean = true;
  protocolsLoaded: boolean = false;
  appointmentsLoaded: boolean = false;
  patientsLoaded: boolean = false;
  loadProtocolsSubscription: Subscription = new Subscription();
  loadDoctorNameSubscription: Subscription = new Subscription();
  loadAppointmentsSubscription: Subscription = new Subscription();
  loadPatientsSubscription: Subscription = new Subscription();

  constructor(
    private headerService: HeaderService,
    private authService: AuthService,
    private snackbar: SnackbarService,
    private protocolService: ProtocolService,
    private appointmentService: AppointmentService,
    private lineLoadingService: LineLoadingService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.headerService.setTitulo('Dashboard');
    this.lineLoadingService.show();
    this.loadDoctorName();
    this.loadProtocols();
    this.loadNextAppointment();
    this.loadRecentPatients();
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
          if (appointment && appointment.appointmentDate) {
            this.nextAppointment = appointment.appointmentDate;
          } else {
            this.nextAppointment = '';
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

  private loadRecentPatients() {
    const doctorId = this.authService.doctorId;
    if (doctorId) {
      this.loadPatientsSubscription = this.authService.getRecentPatientsByDoctor(doctorId).subscribe({
        next: (patients) => {
          this.recentPatients = patients;
          this.patientsLoaded = true;
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
    if (this.doctorName && this.protocolsLoaded && this.appointmentsLoaded && this.patientsLoaded) {
      this.isLoading = false;
      this.lineLoadingService.hide();
    }
  }

  detailsProtocol(id: number) {
    const currentUrl = this.router.url;
    this.router.navigate([`/doctor-panel/protocols/details/${id}`], {
      queryParams: { returnUrl: currentUrl }
    });
  }
  
  ngOnDestroy() {
    this.loadProtocolsSubscription.unsubscribe();
    this.loadDoctorNameSubscription.unsubscribe();    
    this.loadAppointmentsSubscription.unsubscribe();
    this.loadPatientsSubscription.unsubscribe();
  }
}
