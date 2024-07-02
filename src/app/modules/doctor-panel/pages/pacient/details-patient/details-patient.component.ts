import {Component, OnInit} from '@angular/core';
import {MenuItem} from '../../../../../models/MenuItem';
import {AppointmentService} from '../../../../../services/appointment/appointment.service';
import {ActivatedRoute} from '@angular/router';
import {catchError, EMPTY, forkJoin, map, of, Subscription} from 'rxjs';
import {HttpErrorResponse} from '@angular/common/http';
import {apiErrorStatusMessage} from '../../../../../constants/messages';
import {Appointment, AppointmentList} from '../../../../../models/Appointment';
import {ApiResponse, Direction, Page} from '../../../../../models/ApiResponse';
import {SnackbarService} from '../../../../../services/snackbar/snackbar.service';
import {ItemSelect} from '../../../../../components/custom-select/custom-select.component';
import {PatientService as PatientServiceDetails} from '../../../../../services/patient/patient.service';
import {User} from '../../../../../models/User';
import {PatientService} from '../services/patient.service';
import {FileService} from '../../../../../services/file-service/file.service';
import { AuthService } from 'src/app/services/auth/auth.service';

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
    private patientService: PatientService,
    private authService: AuthService,
    private fileService: FileService
  ) {
    const {id} = this.activatedRoute.snapshot.params;
    this.userId = id;
  }

  ngOnInit() {
    this.fetchUser(this.userId);
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
    }
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

    const appointmentDetails$ = appointments.content.map((appointment) =>
      forkJoin({
        patient: this.patientServiceDetails.getPatientDetails(appointment.patientId).pipe(
          catchError(() => of({ data: { name: 'Desconhecido' } })),
          map(response => response.data.name || 'Desconhecido')
        ),
        doctor: this.authService.getMedicDetails(appointment.doctorId).pipe(
          catchError(() => of({ data: { doctor: { name: 'Desconhecido' } } } as ApiResponse<User>)),
          map(response => response.data.doctor?.name || 'Desconhecido')
        )
      }).pipe(
        map(details => ({
          ...appointment,
          patientInfo: details.patient,
          doctorInfo: details.doctor
        }))
      )
    );
  
    forkJoin(appointmentDetails$).subscribe((fullAppointments) => {
      this.appointmentData = fullAppointments.map(
        (appointment): AppointmentList => ({
          id: appointment.id,
          description: appointment.description || '',
          local: appointment.local || '',
          patientInfo: appointment.patientInfo,
          doctorInfo: appointment.doctorInfo,
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
