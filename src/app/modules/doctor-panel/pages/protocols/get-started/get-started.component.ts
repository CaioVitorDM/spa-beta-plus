import { Component } from '@angular/core';
import {ItemSelect} from '../../../../../components/custom-select/custom-select.component';
import {HeaderService} from '../../../../../services/header/header-info.service';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-get-started',
  templateUrl: './get-started.component.html',
  styleUrl: './get-started.component.scss'
})
export class GetStartedComponent {

  constructor(
    private headerService: HeaderService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.headerService.setTitulo('Protocolos');
  }

  searchOptions: ItemSelect[] = [
    {value: 'name', label: 'Nome'},
    {value: 'createdAt', label: 'Data'}
  ];

  pageNumber: ItemSelect[] = [{value: 0, label: 'Página 1'}];
  selectedPage = this.pageNumber[0];

  handleSelectedPage(item: ItemSelect) {
    console.log('paginator works');
  }

  submitSearch(searchType: string | number, searchText: string | null): void {
    console.log(searchType);
    console.log(searchText);
  }

  cleanSearch() {
    console.log('cleaned');
  }

  navigateToCreatePage() {
    this.router.navigate(['/doctor-panel/protocols/create'], {relativeTo: this.activatedRoute});
  }


}
