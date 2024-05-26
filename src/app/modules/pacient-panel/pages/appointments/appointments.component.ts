import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ItemSelect } from 'src/app/components/custom-select/custom-select.component';
import { Direction } from 'src/app/models/ApiResponse';
import { AppointmentList } from 'src/app/models/Appointment';
import { AppointmentService } from 'src/app/services/appointment/appointment.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { HeaderService } from 'src/app/services/header/header-info.service';
import { LineLoadingService } from 'src/app/services/line-loading/line-loading.service';
import { SnackbarService } from 'src/app/services/snackbar/snackbar.service';

@Component({
  selector: 'app-appointments',
  templateUrl: './appointments.component.html',
  styleUrl: './appointments.component.scss'
})
export class AppointmentsComponent {


  // appointmentData!: AppointmentList [];
  loadAppointmentSubscription = new Subscription();
  isLoading: boolean = false;
  isError: boolean = false;

  page = 0;
  pageBySize = 0;
  size = 10;
  sort: keyof AppointmentList = 'appointmentDate';
  order = Direction.DESC;
  title: string | null = '';
  doctorName: string | null = '';
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
    private lineLoadingService: LineLoadingService,
    private route: ActivatedRoute
  ) {
    this.headerService.setTitulo('Consultas');
  }

  appointmentData: AppointmentList[] = [
    {
      id: 1,
      doctorName: 'P1',
      title: 'P1',
      local: 'P1',
      appointmentDate: '1985-05-16',
    }
  ];

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.page = params['page'] || this.page;
      this.size = params['size'] || this.size;
      this.sort = params['sort'] || this.sort;
      this.title = params['title'] || this.title;
      this.doctorName = params['doctorName'] || this.doctorName;
      this.local = params['local'] || this.local;
      this.appointmentDate = params['appointmentDate'] || this.appointmentDate;

      if (parseInt(String(this.size)) !== this.selectedPaginator.value) {
        this.selectedPaginator = this.paginatorItems.find((item) => {
          return item.value === parseInt(String(this.size));
        })!;
      }

      // this.fetchData();
    });
  }

  searchOptions: ItemSelect[] = [
    {value: 'title', label: 'Titulo'},
    {value: 'doctorName', label: 'Médico'},
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
    // this.fetchData();
    this.isFirstRender = false;
  }

  handleSelectedItem(item: ItemSelect) {
    if (!this.isFirstRender) {
      this.size = item.value as number;
      this.page = 0;
      this.selectedPage = this.pageNumber[this.page];
      // this.fetchData();
    }

    this.isFirstRender = false;
  }

  submitSearch(searchType: string | number, searchText: string | null): void {
    if (searchType === 'title') {
      this.doctorName = '';
      this.local = '';
      this.appointmentDate = '';
    }
    
    if (searchType === 'doctorName') {
      this.title = '';
      this.local = '';
      this.appointmentDate = '';
    }

    if (searchType === 'local') {
      this.title = '';
      this.doctorName = '';
      this.appointmentDate = '';
    }

    if (searchType === 'appointmentDate') {
      this.title = '';
      this.doctorName = '';
      this.local = '';
    }
    this.page = 0;

    // this.fetchData();
  }

  cleanSearch() {
    this.title = '';
    this.doctorName = '';
    this.local = '';
    this.appointmentDate = '';

    // this.fetchData();
  }

  
 
  printButton(action: string, event?: MouseEvent): void {
    if (event) {
      event.stopPropagation();
    }
    console.log(action);
  }
}
