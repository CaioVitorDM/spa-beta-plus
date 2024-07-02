import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EMPTY, Subscription, catchError, switchMap } from 'rxjs';
import { ItemSelect } from 'src/app/components/custom-select/custom-select.component';
import { Direction, Page } from 'src/app/models/ApiResponse';
import { Protocol, ProtocolList } from 'src/app/models/Protocol';
import { AuthService } from 'src/app/services/auth/auth.service';
import { HeaderService } from 'src/app/services/header/header-info.service';
import { LineLoadingService } from 'src/app/services/line-loading/line-loading.service';
import { PatientService } from 'src/app/services/patient/patient.service';
import { ProtocolService } from 'src/app/services/protocol/protocol.service';
import { SnackbarService } from 'src/app/services/snackbar/snackbar.service';

@Component({
  selector: 'app-get-started',
  templateUrl: './get-started.component.html',
  styleUrl: './get-started.component.scss'
})
export class GetStartedComponent implements OnInit {

  protocolData!: ProtocolList[];
  fileId!: number;
  loadProtocolsSubscription = new Subscription();
  isLoading: boolean = false;
  isError: boolean = false;

  page = 0;
  pageBySize = 0;
  size = 10;
  sort: keyof ProtocolList = 'createdAt';
  order = Direction.DESC;
  name: string | null = '';
 
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
    private protocolService: ProtocolService,
    private snackbar: SnackbarService,
    private authService: AuthService,
    private patientService: PatientService,
    private lineLoadingService: LineLoadingService,
    private route: ActivatedRoute
  ) {
    this.headerService.setTitulo('Protocolos');
  }

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.page = params['page'] || this.page;
      this.size = params['size'] || this.size;
      this.sort = params['sort'] || this.sort;
      this.name = params['name'] || this.name;

      if (parseInt(String(this.size)) !== this.selectedPaginator.value) {
        this.selectedPaginator = this.paginatorItems.find((item) => {
          return item.value === parseInt(String(this.size));
        })!;
      }

      this.fetchData();
    });
  }

  searchOptions: ItemSelect[] = [
    {value: 'name', label: 'Nome'},
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
    this.name = searchText;
    this.page = 0;

    this.fetchData();
  }

  cleanSearch() {
    this.name = '';

    this.fetchData();
  }

  fetchData() {
    this.loadProtocolsSubscription = this.patientService.getPatientDetails(this.authService.patientId!).
    pipe(
      switchMap(patientDetails => {
        return this.protocolService.list({
          page: this.page,
          size: this.size,
          sort: this.sort,
          order: this.order,
          name: this.name!,
          patientId: this.authService.patientId!,
          doctorId: patientDetails.data.doctorId 
        });
      })
    ).subscribe({
      next: (protocols) => {
        this.onSuccess(protocols);
      },
      error: (_error) => {
        this.lineLoadingService.hide();
      },
    });
  }

  onSuccess(protocols: Page<Protocol[]>) {
    
    this.isLoading = false;
    this.isError = false;
    this.protocolData = protocols.content.map((protocol): ProtocolList => {
      return {
        id: protocol.id,
        description: protocol.description || '',
        name: protocol.name || '',
        fileId: protocol.fileId 
      };
    });
    this.totalItems = protocols.totalElements;
    this.pageBySize = Math.ceil(this.totalItems / this.size);
    this.pageNumber = Array.from({length: this.pageBySize}, (_, i) => ({
      value: i,
      label: 'Página ' + (i + 1),
    }));
    this.isFirstPage = protocols.first;
    this.isLastPage = protocols.last;
    this.offSet = protocols.pageable.offset + 1;

    if (!protocols.last) {
      this.lastItem = this.size * (parseInt(String(this.page)) + 1);
    } else {
      this.lastItem = protocols.totalElements;
    }
    this.lineLoadingService.hide();
  }




}
