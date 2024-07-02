import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {HeaderService} from '../../../../services/header/header-info.service';
import {
  Chart,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  CategoryScale,
  Tooltip,
  Filler,
} from 'chart.js';
import {EMPTY, Observable, Subscription, catchError, forkJoin, map, of} from 'rxjs';
import {PatientService} from 'src/app/services/patient/patient.service';
import { Appointment, AppointmentList } from 'src/app/models/Appointment';
import { User } from 'src/app/models/User';
import { Direction, Page } from 'src/app/models/ApiResponse';
import { HttpErrorResponse } from '@angular/common/http';
import { apiErrorStatusMessage } from 'src/app/constants/messages';
import { SnackbarService } from 'src/app/services/snackbar/snackbar.service';
import { ActivatedRoute } from '@angular/router';
import { AppointmentService } from 'src/app/services/appointment/appointment.service';

//To-do

@Component({
  selector: 'app-patient-dashboard',
  templateUrl: './patient-dashboard.component.html',
  styleUrl: './patient-dashboard.component.scss',
})
export class PatientDashboardComponent implements OnInit, AfterViewInit {
  @ViewChild('lineChart') private chartRef!: ElementRef<HTMLCanvasElement>;
  chart!: Chart;

  patientId: number = 0;
  userId!: number;
  loadAppointmentsSubscription = new Subscription();

  appointmentData!: AppointmentList[];
  patientUser!: User;
  imageSrc!: string;

  page = 0;
  pageBySize = 0;
  size = 10;
  sort: keyof AppointmentList = 'appointmentDate';
  order = Direction.DESC;
  description: string | null = '';
  local: string | null = '';
  appointmentDate: string | null = '';

  offSet = 0;
  lastItem = 0;
  totalItems = 0;

  isFirstPage = true;
  isLastPage = false;
  isFirstRender = true;



  constructor(
    private headerService: HeaderService,
    private patientService: PatientService,
    private appointmentService: AppointmentService,
    private activatedRoute: ActivatedRoute,
    private snackbar: SnackbarService,
  ) {}

  ngOnInit() {
    this.headerService.setTitulo('Dashboard');
    // this.fetchUser(this.userId);

  }

  ngAfterViewInit() {
    this.initializeGraph();
  }

  // fetchAppointmentData() {
  //   console.log(this.patientId);
  //   this.loadAppointmentsSubscription = this.appointmentService
  //     .list({
  //       page: this.page,
  //       size: this.size,
  //       sort: this.sort,
  //       order: this.order,
  //       patientId: this.patientId,
  //     })
  //     .pipe(
  //       catchError((error: HttpErrorResponse) => {
  //         this.snackbar.open(apiErrorStatusMessage[error.status]);
  //         return EMPTY;
  //       })
  //     )
  //     .subscribe({
  //       next: (appointments) => {
  //         this.onSuccess(appointments);
  //       },
  //       error: (_error) => {},
  //     });
  // }

  // onSuccess(appointments: Page<Appointment[]>) {
  //   if (appointments.content.length === 0) {
  //     this.appointmentData = [];
  //     return;
  //   }

  //   const patientDetails$ = appointments.content.map((appointment) =>
  //     this.patientServiceDetails.getPatientDetails(appointment.patientId).pipe(
  //       catchError(() => of({data: {name: 'Desconhecido'}})),
  //       map((response) => ({
  //         ...appointment,
  //         patientInfo: response.data.name || 'Desconhecido',
  //       }))
  //     )
  //   );

  //   forkJoin(patientDetails$).subscribe((fullAppointments) => {
  //     this.appointmentData = fullAppointments.map(
  //       (appointment): AppointmentList => ({
  //         id: appointment.id,
  //         description: appointment.description || '',
  //         local: appointment.local || '',
  //         patientInfo: appointment.patientInfo,
  //         appointmentDate: appointment.appointmentDate || '',
  //       })
  //     );
  //   });
  //   this.totalItems = appointments.totalElements;
  //   this.pageBySize = Math.ceil(this.totalItems / this.size);
  //   this.isFirstPage = appointments.first;
  //   this.isLastPage = appointments.last;
  //   this.offSet = appointments.pageable.offset + 1;

  //   if (!appointments.last) {
  //     this.lastItem = this.size * (parseInt(String(this.page)) + 1);
  //   } else {
  //     this.lastItem = appointments.totalElements;
  //   }
  // }







  /*

  
  
  
  constructor(
    private appointmentService: AppointmentService,
    private activatedRoute: ActivatedRoute,
    private snackbar: SnackbarService,
    private patientServiceDetails: PatientServiceDetails,
    private patientService: PatientService,
    private fileService: FileService
  ) {
    const {id} = this.activatedRoute.snapshot.params;
    this.userId = id;
  }

  

  

  fetchUser(id: number) {
    this.patientService.getOne(id).subscribe({
      next: (response) => {
        this.patientUser = response;
        this.patientId = response.patient?.id || 0;
        if (response.imgId) {
          this.fetchImage(response.imgId);
        }
        this.details = [
          {
            label: 'Telefone',
            value: this.formatPhoneNumber(response.phoneNumber),
          },
          {
            label: 'E-mail',
            value: response.email,
          },
          {
            label: 'CPF',
            value: response.patient?.cpf!,
          },
          {
            label: 'Data de nascimento',
            value: this.formatBirthDate(response.patient?.birthDate!),
          },
        ];
      },
      error: (err) => {
        this.snackbar.open(err);
      },
    });
  }

  fetchImage(imgId: number) {
    this.fileService.getInlineImage(imgId).subscribe({
      next: (blob) => {
        this.imageSrc = URL.createObjectURL(blob);
      },
      error: (err) => {
        console.error('Erro ao carregar imagem:', err);
      },
    });
  }

  formatPhoneNumber(phoneNumber: string): string {
    // Remove caracteres não numéricos
    const cleaned = ('' + phoneNumber).replace(/\D/g, '');

    // Checa se o número possui um formato válido e aplica a máscara
    if (cleaned.length === 11) {
      const match = cleaned.match(/^(\d{2})(\d{5})(\d{4})$/);
      if (match) {
        return `(${match[1]}) ${match[2]}-${match[3]}`;
      }
    }
    if (cleaned.length === 10) {
      const match = cleaned.match(/^(\d{2})(\d{4})(\d{4})$/);
      if (match) {
        return `(${match[1]}) ${match[2]}-${match[3]}`;
      }
    }

    return phoneNumber;
  }

  formatBirthDate(birthDate: string | undefined): string {
    if (!birthDate) return '';

    const date = new Date(birthDate);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Month is zero-indexed
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  }

  protected readonly MenuItem = MenuItem;
} */

  initializeGraph() {
    Chart.register(
      LineController,
      LineElement,
      PointElement,
      LinearScale,
      CategoryScale,
      Title,
      Tooltip,
      Filler
    );
    this.chart = new Chart(this.chartRef.nativeElement, {
      type: 'line',
      data: {
        labels: [
          'Jan',
          'Feb',
          'Mar',
          'Apr',
          'May',
          'Jun',
          'Jul',
          'Aug',
          'Sep',
          'Oct',
          'Nov',
          'Dec',
        ],
        datasets: [
          {
            label: 'Histórico Beta HCG',
            data: [300, 450, 500, 550, 600, 650, 800, 850, 750, 900, 950, 1000], // Use seus próprios dados
            fill: true,
            backgroundColor: 'rgba(151, 92, 228, 0.13)', // Cor do preenchimento com transparência
            borderColor: 'rgba(151, 92, 228, 1)', // Cor da linha
            borderWidth: 2,
            pointBackgroundColor: 'rgba(151, 92, 228, 1)', // Cor dos pontos
            tension: 0.4, // Suavização da curva da linha
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: false,
          },
        },
      },
    });
  }
}
