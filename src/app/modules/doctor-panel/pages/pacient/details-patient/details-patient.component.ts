import {Component, OnInit, ViewChild} from '@angular/core';
import {MenuItem} from '../../../../../models/MenuItem';
import {AppointmentService} from '../../../../../services/appointment/appointment.service';
import {ActivatedRoute} from '@angular/router';
import {catchError, EMPTY, forkJoin, map, of, Subscription, switchMap} from 'rxjs';
import {HttpErrorResponse} from '@angular/common/http';
import {apiErrorStatusMessage} from '../../../../../constants/messages';
import {Appointment, AppointmentList} from '../../../../../models/Appointment';
import {ApiResponse, Direction, Page} from '../../../../../models/ApiResponse';
import {SnackbarService} from '../../../../../services/snackbar/snackbar.service';
import {ItemSelect} from '../../../../../components/custom-select/custom-select.component';
import {PatientService as PatientServiceDetails} from '../../../../../services/patient/patient.service';
import {User} from '../../../../../models/User';
import {PatientSpecificService} from '../services/patient.service';
import {FileService} from '../../../../../services/file-service/file.service';
import {AuthService} from 'src/app/services/auth/auth.service';
import {Exams, ExamsList, ExamsListOfPatients} from 'src/app/models/Exams';
import {ExamsService} from 'src/app/services/exams/exams.service';
import {LineLoadingService} from 'src/app/services/line-loading/line-loading.service';
import {ExamsTableComponent} from '../../exams/components/exams-table/exams-table.component';
// import {BetaDetailsComponent} from '../components/beta-details/beta-details.component';
import {PatientService} from '../../../../../services/patient/patient.service';

@Component({
  selector: 'app-details-patient',
  templateUrl: './details-patient.component.html',
  styleUrl: './details-patient.component.scss',
})
export class DetailsPatientComponent implements OnInit {
  selectedButton: string = MenuItem.EXAMS;
  patientId: number = 0;
  userId!: number;
  loadAppointmentsSubscription = new Subscription();
  loadExamsSubscription = new Subscription();

  appointmentData!: AppointmentList[];
  examData!: ExamsList[];

  patientUser!: User;
  imageSrc!: string;

  page = 0;
  pageBySize = 0;
  size = 10;
  sort: keyof AppointmentList = 'appointmentDate';
  sortExam: keyof ExamsList = 'examDate';

  order = Direction.DESC;
  description: string | null = '';
  local: string | null = '';
  appointmentDate: string | null = '';

  name: string | null = '';
  examDate: string | null = '';
  examType: string | null = '';
  fileId: number | null = 0;
  id: number | null = 0;

  isLoading: boolean = false;
  isError: boolean = false;

  offSet = 0;
  lastItem = 0;
  totalItems = 0;

  isFirstPage = true;
  isLastPage = false;
  isFirstRender = true;

  paginatorItems: ItemSelect[] = [
    {value: 10, label: '10 por página'},
    {value: 30, label: '30 por página'},
    {value: 50, label: '50 por página'},
  ];

  pageNumber: ItemSelect[] = [{value: 0, label: 'Página 1'}];
  selectedPaginator = this.paginatorItems[0];
  selectedPage = this.pageNumber[0];

  details!: {label: string; value: string}[];

  constructor(
    private appointmentService: AppointmentService,
    private activatedRoute: ActivatedRoute,
    private snackbar: SnackbarService,
    private patientServiceDetails: PatientServiceDetails,
    private patientService: PatientSpecificService,
    private patient: PatientService,
    private authService: AuthService,
    private fileService: FileService,
    private examsService: ExamsService,
    private lineLoadingService: LineLoadingService
  ) {
    const {id} = this.activatedRoute.snapshot.params;
    this.userId = id;
  }

  ngOnInit() {
    this.fetchUser(this.userId);
    this.patientId = this.userId;
    this.selectMenuItem(this.selectedButton);
  }

  selectMenuItem(item: string) {
    this.selectedButton = item;

    switch (this.selectedButton) {
      case MenuItem.APPOINTMENT:
        this.fetchAppointmentData();
        break;
      case MenuItem.PATIENT_INFO:
        this.fetchUser(this.userId);
        break;
      case MenuItem.EXAMS:
        this.fetchExams();
        break;
    }
  }

  fetchExams() {
    this.loadExamsSubscription = this.examsService
      .list({
        page: this.page,
          size: this.size,
          sort: this.sortExam,
          order: this.order,
          name: this.name!,
          patientId: this.patientId,
          examDate: this.examDate!,
          examType: this.examType!,
          fileId:this.fileId!,
          id:this.id!,
          doctorId:this.authService.doctorId!,
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
        next: (exams) => {
          this.onSuccessExams(exams);
        },
        error: (_error) => {
          this.lineLoadingService.hide();
        },
      });
  }

  onSuccessExams(exams: Page<Exams[]>) {
    this.isLoading = false;
    this.isError = false;

    if (exams.content.length === 0) {
      this.examData = [];  
      return;
    }

    this.examData = exams.content.map((user): ExamsList => {
      return {
        patientId: user.patientId,
        fileId: user.fileId || 0,
        doctorId: user.doctorId,
        name: user.name || '',
        examDate: user.examDate || '',
        examType: user.examType || '',
        id: user.id || 0,
      };
    });

    this.totalItems = exams.totalElements;
    this.pageBySize = Math.ceil(this.totalItems / this.size);
    this.pageNumber = Array.from({length: this.pageBySize}, (_, i) => ({
      value: i,
      label: 'Página ' + (i + 1),
    }));
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

  // fetchExams(patient: number) {
  //   this.isLoading = true;
  //   this.loadExamsSubscription = this.examsService
  //     .list({
  //       page: this.page,
  //       size: this.size,
  //       sort: this.sortExam,
  //       order: this.order,
  //       name: this.name!,
  //       patientId: patient,
  //       examDate: this.examDate!,
  //       examType: this.examType!,
  //       fileId: this.fileId!,
  //       id: this.id!,
  //       doctorId: this.authService.doctorId!,
  //     })
  //     .pipe(
  //       switchMap((exams: Page<Exams[]>) => {
  //         if (exams.content.length === 0) {
  //           return of([]);
  //         }

  //         const patientDetails$ = exams.content.map((exam) =>
  //           this.patient.getPatientDetails(exam.patientId).pipe(
  //             catchError(() => of({data: {name: 'Desconhecido'}})),
  //             map((response) => ({
  //               ...exam,
  //               patientInfo: response.data.name || 'Desconhecido',
  //             }))
  //           )
  //         );

  //         return forkJoin(patientDetails$);
  //       }),
  //       catchError((error: HttpErrorResponse) => {
  //         this.isLoading = false;
  //         this.isError = true;
  //         this.snackbar.open(apiErrorStatusMessage[error.status]);
  //         this.lineLoadingService.hide();
  //         return EMPTY;
  //       })
  //     )
  //     .subscribe({
  //       next: (fullexams) => {
  //         this.onSuccessExams(fullexams);
  //       },
  //       error: (_error) => {
  //         this.lineLoadingService.hide();
  //       },
  //     });
  // }

  // onSuccessExams(exams: any) {
  //   this.isLoading = false;
  //   this.isError = false;

  //   this.examData = exams.map(
  //     (exam: any): ExamsListOfPatients => ({
  //       id: exam.id,
  //       patientInfo: exam.patientInfo,
  //       examDate: exam.examDate || '',
  //       patientId: exam.patientId,
  //       doctorId: exam.doctorId,
  //       fileId: exam.fileId || 0,
  //       name: exam.name || '',
  //       examType: exam.examType || '',
  //     })
  //   );

  //   this.totalItems = exams.totalElements || 0;
  //   this.pageBySize = Math.ceil(this.totalItems / this.size);
  //   this.pageNumber = Array.from({length: this.pageBySize}, (_, i) => ({
  //     value: i,
  //     label: 'Página ' + (i + 1),
  //   }));
  //   this.isFirstPage = exams.first || false;
  //   this.isLastPage = exams.last || false;
  //   this.offSet = exams.pageable.offset + 1 || 0;

  //   if (!this.isLastPage) {
  //     this.lastItem = this.size * (parseInt(String(this.page)) + 1);
  //   } else {
  //     this.lastItem = this.totalItems;
  //   }
  //   this.lineLoadingService.hide();
  //   console.log(this.examData);
  // }

  loadName(patientId: number) {
    this.patient.getPatientDetails(patientId).pipe(
      catchError(() => of({data: {name: 'Desconhecido'}})),
      map((response) => ({
        patientInfo: response.data.name || 'Desconhecido',
      }))
    );
  }

  fetchAppointmentData() {
    console.log(this.patientId);
    this.loadAppointmentsSubscription = this.appointmentService
      .list({
        page: this.page,
        size: this.size,
        sort: this.sort,
        order: this.order,
        patientId: this.patientId,
      })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          this.snackbar.open(apiErrorStatusMessage[error.status]);
          return EMPTY;
        })
      )
      .subscribe({
        next: (appointments) => {
          this.onSuccess(appointments);
        },
        error: (_error) => {},
      });
  }

  onSuccess(appointments: Page<Appointment[]>) {
    if (appointments.content.length === 0) {
      this.appointmentData = [];
      return;
    }

    const patientDetails$ = appointments.content.map((appointment) =>
      this.patientServiceDetails.getPatientDetails(appointment.patientId).pipe(
        catchError(() => of({data: {name: 'Desconhecido'}})),
        map((response) => ({
          ...appointment,
          patientInfo: response.data.name || 'Desconhecido',
        }))
      )
    );

    forkJoin(patientDetails$).subscribe((fullAppointments) => {
      this.appointmentData = fullAppointments.map(
        (appointment): AppointmentList => ({
          id: appointment.id,
          description: appointment.description || '',
          local: appointment.local || '',
          patientInfo: appointment.patientInfo,
          appointmentDate: appointment.appointmentDate || '',
        })
      );
    });
    this.totalItems = appointments.totalElements;
    this.pageBySize = Math.ceil(this.totalItems / this.size);
    this.pageNumber = Array.from({length: this.pageBySize}, (_, i) => ({
      value: i,
      label: 'Página ' + (i + 1),
    }));
    this.isFirstPage = appointments.first;
    this.isLastPage = appointments.last;
    this.offSet = appointments.pageable.offset + 1;

    if (!appointments.last) {
      this.lastItem = this.size * (parseInt(String(this.page)) + 1);
    } else {
      this.lastItem = appointments.totalElements;
    }
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
}
