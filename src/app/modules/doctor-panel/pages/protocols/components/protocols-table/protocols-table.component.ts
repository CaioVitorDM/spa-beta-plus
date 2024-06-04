import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProtocolList } from 'src/app/models/Protocol';

@Component({
  selector: 'app-protocols-table',
  templateUrl: './protocols-table.component.html',
  styleUrl: './protocols-table.component.scss'
})
export class ProtocolsTableComponent {

  @Input() dataSource: ProtocolList[] = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  
  // dataSource: ProtocolList[] = [
  //   {
  //     id: 1,
  //     name: 'P1',
  //     createdAt: '1985-05-16',
  //   },
  //   {
  //     id: 2,
  //     name: 'P2',
  //     createdAt: '1990-07-23',
  //   },
  //   {
  //     id: 3,
  //     name: 'P3',
  //     createdAt: '1979-02-12',
  //   },
  //   {
  //     id: 4,
  //     name: 'P4',
  //     createdAt: '1964-10-01',
  //   },
  // ];

  printButton(action: string, event?: MouseEvent): void {
    if (event) {
      event.stopPropagation();
    }
    console.log(action);
  }

  navigateToCreatePage() {}

  editProtocol(id: number) {
    this.router.navigate([`/doctor-panel/protocols/edit/${id}`], {relativeTo: this.activatedRoute});
  }

  detailsProtocol(id: number) {
    this.router.navigate([`/doctor-panel/protocols/details/${id}`], {relativeTo: this.activatedRoute});
  }

  deleteProtocol(id: number) {
    console.log('delete ' + id);
  }

}
