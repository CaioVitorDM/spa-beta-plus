import { Component, OnInit } from '@angular/core';
import {ItemSelect} from '../../../../../components/custom-select/custom-select.component';
import {HeaderService} from '../../../../../services/header/header-info.service';
import {ActivatedRoute, Router} from '@angular/router';
import { Protocol, ProtocolList } from 'src/app/models/Protocol';
import { EMPTY, Subscription, catchError } from 'rxjs';
import { Direction, Page } from 'src/app/models/ApiResponse';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ProtocolService } from '../services/protocol.service';
import { HttpErrorResponse } from '@angular/common/http';
import { SnackbarService } from 'src/app/services/snackbar/snackbar.service';
import { apiErrorStatusMessage } from 'src/app/constants/messages';
import { LineLoadingService } from 'src/app/services/line-loading/line-loading.service';

@Component({
  selector: 'app-get-started',
  templateUrl: './get-started.component.html',
  styleUrl: './get-started.component.scss'
})
export class GetStartedComponent implements OnInit{

  protocolData!: ProtocolList[];
  loadProtocolsSubscription = new Subscription();
  isLoading: boolean = false;
  isError: boolean = false;

  page = 0;
  pageBySize = 0;
  size = 10;
  sort: keyof ProtocolList = 'createdAt';
  order = Direction.DESC;
  name: string | null = '';
  createdAt: string | null = '';
 
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
      this.createdAt = params['createdAt'] || this.createdAt;

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
    {value: 'createdAt', label: 'Data'}
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
    if (searchType === 'name') {
      this.name = searchText;
      this.createdAt = '';
    }
    if (searchType === 'createdAt') {
      this.createdAt = searchText;
      this.name = '';
    }
    this.page = 0;

    this.fetchData();
  }

  cleanSearch() {
    this.name = '';
    this.createdAt = '';

    this.fetchData();
  }

  fetchData() {
    this.loadProtocolsSubscription = this.protocolService
      .list({
        page: this.page,
        size: this.size,
        sort: this.sort,
        order: this.order,
        name: this.name!,
        createdAt: this.createdAt!,
        doctorId: this.authService.doctorId!,
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
        createdAt: protocol.createdAt || '',
        name: protocol.name || ''
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

  navigateToCreatePage() {
    this.router.navigate(['/doctor-panel/protocols/create'], {relativeTo: this.activatedRoute});
  }


}
