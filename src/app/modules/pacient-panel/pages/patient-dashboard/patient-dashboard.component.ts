import {Component, OnInit, AfterViewInit, ViewChild, ElementRef, OnDestroy} from '@angular/core';
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
import {EMPTY, Observable, Subscription, catchError, map, of} from 'rxjs';
import {Beta, BetaList} from 'src/app/models/Beta';
import {Exams, ExamsList} from 'src/app/models/Exams';
import {AuthService} from 'src/app/services/auth/auth.service';
import {BetaService} from 'src/app/services/beta/beta.service';
import {ExamsService} from 'src/app/services/exams/exams.service';
import {SnackbarService} from 'src/app/services/snackbar/snackbar.service';
import {LineLoadingService} from 'src/app/services/line-loading/line-loading.service';
import {apiErrorStatusMessage} from 'src/app/constants/messages';
import {Direction, Page} from 'src/app/models/ApiResponse';
import {PatientService} from 'src/app/services/patient/patient.service';
import {Doctor, Patient, User} from 'src/app/models/User';
import {AppointmentService} from 'src/app/services/appointment/appointment.service';
import {Appointment} from 'src/app/models/Appointment';

@Component({
  selector: 'app-patient-dashboard',
  templateUrl: './patient-dashboard.component.html',
  styleUrls: ['./patient-dashboard.component.scss'],
})
export class PatientDashboardComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('lineChart') private chartRef!: ElementRef<HTMLCanvasElement>;
  chart!: Chart;
  betaData: Beta[] = [];
  examsData: ExamsList[] = [];
  betaDate!: string;
  betaValue!: number;
  patientId: number = 0;
  userId!: number;
  id: number | null = 0;
  idExam: number | null = 0;
  isLoading: boolean = false;
  isError: boolean = false;
  nextAppointment: string = '';
  appointmentsLoaded: boolean = false;
  loadAppointmentsSubscription = new Subscription();
  loadBetaSubscription = new Subscription();
  loadDoctorNameSubscription: Subscription = new Subscription();
  loadExamsSubscription = new Subscription();

  page = 0;
  size = 10;
  sort: keyof BetaList = 'betaDate';
  sortExam: keyof ExamsList = 'examDate';
  order = Direction.DESC;
  description: string | null = '';
  local: string | null = '';
  appointmentDate: string | null = '';
  examDate: string | null = '';
  examType: string | null = '';
  fileId: number | null = 0;
  name: string | null = '';
  docId: string | null = '';

  offSet = 0;
  lastItem = 0;
  totalItems = 0;
  isFirstPage = true;
  isLastPage = false;
  isFirstRender = true;

  patientName: string = ''; // Adicionada propriedade para nome do paciente
  doctorName: string = ''; // Adicionada propriedade para nome do médico

  constructor(
    private authService: AuthService,
    private betaService: BetaService,
    private examsService: ExamsService,
    private snackbar: SnackbarService,
    private lineLoadingService: LineLoadingService,
    private patient: PatientService,
    private appointmentService: AppointmentService
  ) {}

  ngOnInit(): void {
    this.fetchBeta();
    this.fetchExams();
    this.loadPatientName();
    this.loadNextAppointment();
    this.loadDoctorName();
  }

  ngAfterViewInit(): void {
    this.initializeGraph();
  }

  ngOnDestroy(): void {
    this.destroyChart();
    this.loadAppointmentsSubscription.unsubscribe();
    this.loadBetaSubscription.unsubscribe();
    this.loadExamsSubscription.unsubscribe();
  }

  private destroyChart(): void {
    if (this.chart) {
      this.chart.destroy();
    }
  }

  fetchBeta(): void {
    this.loadBetaSubscription = this.betaService
      .list({
        patientId: this.authService.patientId!,
        betaDate: this.betaDate!,
        betaValue: this.betaValue!,
        id: this.id!,
        doctorId: this.authService.doctorId!,
      })
      .subscribe({
        next: (beta) => {
          this.betaData = beta.content;
          this.initializeGraph(); // Initialize graph after fetching beta data
        },
        error: (error) => {
          this.isLoading = false;
          this.isError = true;
          this.snackbar.open(apiErrorStatusMessage[error.status]);
          this.lineLoadingService.hide();
        },
      });
  }

  fetchExams(): void {
    this.loadExamsSubscription = this.examsService
      .list({
        page: this.page,
        size: this.size,
        sort: this.sortExam,
        order: this.order,
        name: this.name!,
        patientId: this.authService.patientId!,
        examDate: this.examDate!,
        examType: this.examType!,
        fileId: this.fileId!,
        id: this.idExam!,
        doctorId: this.authService.doctorId!,
      })
      .subscribe({
        next: (exams) => {
          this.onSuccess(exams);
        },
        error: (error) => {
          this.isLoading = false;
          this.isError = true;
          this.snackbar.open(apiErrorStatusMessage[error.status]);
          this.lineLoadingService.hide();
        },
      });
  }

  onSuccess(exams: Page<Exams[]>): void {
    this.isLoading = false;
    this.isError = false;

    if (exams.content.length === 0) {
      this.examsData = [];
      return;
    }

    this.examsData = exams.content.map((exam) => ({
      patientId: exam.patientId,
      fileId: exam.fileId || 0,
      doctorId: exam.doctorId,
      name: exam.name || '',
      examDate: exam.examDate || '',
      examType: exam.examType || '',
      id: exam.id || 0,
    }));

    this.totalItems = exams.totalElements;
    this.isFirstPage = exams.first;
    this.isLastPage = exams.last;
    this.offSet = exams.pageable.offset + 1;

    if (!exams.last) {
      this.lastItem = this.size * (parseInt(String(this.page)) + 1);
    } else {
      this.lastItem = exams.totalElements;
    }

    this.lineLoadingService.hide();
  }

  // Método para carregar o doctorId a partir do patientId
loadDoctor(patientId: number): Observable<number> {
  return this.patient
    .getPatientDetails(patientId)
    .pipe(map((response) => response.data.doctorId || 0)); // Use 0 ou outro valor padrão se doctorId não estiver disponível imediatamente
}

// Método para carregar o nome do médico
private loadDoctorName() {
  // Obtém o patientId do authService
  const patientId = this.authService.patientId;

  if (!patientId) {
    console.error('Patient ID is not available');
    return;
  }

  this.loadDoctorNameSubscription = this.loadDoctor(patientId).subscribe({
    next: (doctorId) => {
      // Com doctorId obtido, chama getMedicDetails para carregar os detalhes do médico
      this.authService.getMedicDetails(doctorId).subscribe({
        next: (response) => {
          this.doctorName = response.data.doctor?.name || '';
          console.log("Entrou em next");
          console.log(this.doctorName);
        },
        error: (error) => {
          this.snackbar.open(apiErrorStatusMessage[error.status]);
          this.isLoading = false;
          this.lineLoadingService.hide();
        }
      });
    },
    error: (error) => {
      this.snackbar.open(apiErrorStatusMessage[error.status]);
      this.isLoading = false;
      this.lineLoadingService.hide();
    }
  });
}


  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  private loadNextAppointment() {
    this.loadAppointmentsSubscription = this.appointmentService
      .getNextAppointment(this.authService.patientId!)
      .subscribe({
        next: (appointment) => {
          if (appointment && appointment.appointmentDate) {
            this.nextAppointment = appointment.appointmentDate;
          } else {
            this.nextAppointment = '';
          }
          this.appointmentsLoaded = true;
        },
        error: (error) => {
          this.snackbar.open(apiErrorStatusMessage[error.status]);
          this.isLoading = false;
          this.lineLoadingService.hide();
        },
      });
  }

  loadPatientName(): void {
    const patientDetails$ = this.patient.getPatientDetails(this.authService.patientId!).pipe(
      catchError(() => of({data: {name: 'Desconhecido'}})),
      map((patientMap) => ({
        patientInfo: patientMap.data.name || 'Desconhecido',
      }))
    );

    
    patientDetails$.subscribe(({patientInfo}) => (this.patientName = patientInfo));
  }

  initializeGraph(): void {
    this.destroyChart();

    this.betaData.sort((a, b) => new Date(a.betaDate).getTime() - new Date(b.betaDate).getTime());

    Chart.register(
      LineController,
      LineElement,
      PointElement,
      LinearScale,
      Title,
      Tooltip,
      Filler,
      CategoryScale
    );

    const labels = this.betaData.map((beta) => this.formatDate(beta.betaDate));
    const data = this.betaData.map((beta) => beta.betaValue);

    this.chart = new Chart(this.chartRef.nativeElement, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Nível do Beta hCG',
            data: data,
            fill: true,
            backgroundColor: 'rgba(151, 92, 228, 0.13)',
            borderColor: 'rgba(151, 92, 228, 1)',
            borderWidth: 2,
            pointBackgroundColor: 'rgba(151, 92, 228, 1)',
            tension: 0.4,
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
          },
        },
        plugins: {
          tooltip: {
            callbacks: {
              label: (context) => `Nível do Beta: ${context.formattedValue}`,
            },
          },
        },
      },
    });
  }
}
