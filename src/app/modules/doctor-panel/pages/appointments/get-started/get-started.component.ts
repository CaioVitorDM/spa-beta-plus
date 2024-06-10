import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EMPTY, Subscription, catchError, forkJoin, map, of } from 'rxjs';
import { ItemSelect } from 'src/app/components/custom-select/custom-select.component';
import { apiErrorStatusMessage } from 'src/app/constants/messages';
import { Direction, Page } from 'src/app/models/ApiResponse';
import { Appointment, AppointmentList } from 'src/app/models/Appointment';
import { AppointmentService } from 'src/app/services/appointment/appointment.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { HeaderService } from 'src/app/services/header/header-info.service';
import { LineLoadingService } from 'src/app/services/line-loading/line-loading.service';
import { PatientService } from 'src/app/services/patient/patient.service';
import { SnackbarService } from 'src/app/services/snackbar/snackbar.service';
import swal from 'sweetalert2';

@Component({
  selector: 'app-get-started',
  templateUrl: './get-started.component.html',
  styleUrl: './get-started.component.scss'
})
export class GetStartedComponent implements OnInit {
  
  
  appointmentData!: AppointmentList[];
  loadAppointmentsSubscription = new Subscription();
  deleteAppointmentSubscription = new Subscription();

  isLoading: boolean = false;
  isError: boolean = false;

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
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private appointmentService: AppointmentService,
    private snackbar: SnackbarService,
    private authService: AuthService,
    private patientService: PatientService,
    private lineLoadingService: LineLoadingService,
    private route: ActivatedRoute
  ) {
    this.headerService.setTitulo('Consultas');
  }

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.page = params['page'] || this.page;
      this.size = params['size'] || this.size;
      this.sort = params['sort'] || this.sort;
      this.description = params['description'] || this.description;
      this.local = params['local'] || this.local;
      this.appointmentDate = params['appointmentDate'] || this.appointmentDate;

      if (parseInt(String(this.size)) !== this.selectedPaginator.value) {
        this.selectedPaginator = this.paginatorItems.find((item) => {
          return item.value === parseInt(String(this.size));
        })!;
      }

      this.fetchData();
    });
  }

  searchOptions: ItemSelect[] = [
    {value: 'description', label: 'Descrição'},
    {value: 'local', label: 'Local'},
    {value: 'appointmentDate', label: 'Data', isDate: true}
  ];

  paginatorItems: ItemSelect[] = [
    {value: 10, label: '10 por página'},
    {value: 30, label: '30 por página'},
    {value: 50, label: '50 por página'},
  ];

  pageNumber: ItemSelect[] = [{value: 0, label: 'Página 1'}];
  selectedPaginator = this.paginatorItems[0];
  selectedPage = this.pageNumber[0];

  handleSelectedPage(item: ItemSelect) {
    if (!this.isFirstRender) {
      this.page = item.value as number;
      this.selectedPage = this.pageNumber[this.page];
    }
    this.fetchData();
    this.isFirstRender = false;
  }

  handleSelectedItem(item: ItemSelect) {
    if (!this.isFirstRender) {
      this.size = item.value as number;
      this.page = 0;
      this.selectedPage = this.pageNumber[this.page];
      this.fetchData();
    }

    this.isFirstRender = false;
  }

  submitSearch(searchType: string | number, searchText: string | null): void {
    if (searchType === 'description') {
      this.description = searchText
      this.local = '';
      this.appointmentDate = '';
    }
    

    if (searchType === 'local') {
      this.local = searchText
      this.description = '';
      this.appointmentDate = '';
    }

    if (searchType === 'appointmentDate') {
      this.appointmentDate = searchText;
      this.description = '';
      this.local = '';
    }

    this.page = 0;

    this.fetchData();
  }

  cleanSearch() {
    this.description = '';
    this.local = '';
    this.appointmentDate = '';

    this.fetchData();
  }


  fetchData() {
    this.loadAppointmentsSubscription = this.appointmentService
      .list({
        page: this.page,
        size: this.size,
        sort: this.sort,
        order: this.order,
        description: this.description!,
        doctorId: this.authService.doctorId!,
        local: this.local!,
        appointmentDate: this.appointmentDate!,
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
        next: (appointments) => {
          this.onSuccess(appointments);
        },
        error: (_error) => {
          this.lineLoadingService.hide();
        },
      });
  }

  onSuccess(appointments: Page<Appointment[]>) {
    this.isLoading = false;
    this.isError = false;

    if (appointments.content.length === 0) {
      this.appointmentData = [];  
      this.lineLoadingService.hide();
      return;
    }
   
    const patientDetails$ = appointments.content.map(appointment =>
      this.patientService.getPatientDetails(appointment.patientId).pipe(
        catchError(() => of({ data: { name: 'Desconhecido' }})), 
        map(response => ({
          ...appointment,
          patientInfo: response.data.name || 'Desconhecido' 
        }))
      )
    );
  
    forkJoin(patientDetails$).subscribe(fullAppointments => {
      this.appointmentData = fullAppointments.map((appointment): AppointmentList => ({
        id: appointment.id,
        description: appointment.description || '',
        local: appointment.local || '',
        patientInfo: appointment.patientInfo,
        appointmentDate: appointment.appointmentDate || ''
      }));
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
    this.lineLoadingService.hide();
  }

  deleteAppointment(id: number) {

    this.lineLoadingService.show();
    this.deleteAppointmentSubscription = this.appointmentService
      .delete(id)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          this.snackbar.open(apiErrorStatusMessage[error.status]);
          this.lineLoadingService.hide();
          return EMPTY;
        })
      )
      .subscribe((response) => {
        if (response.success) {
          swal.fire({
            title: 'Sucesso!',
            text: 'A consulta foi deletada!',
            icon: 'success',
            showConfirmButton: false,
            timer: 3000,
          });
          this.fetchData();
        }
      });
  }

  navigateToCreatePage() {
    this.router.navigate(['/doctor-panel/appointments/create'], {relativeTo: this.activatedRoute});
  }


}
