import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProtocolList } from 'src/app/models/Protocol';

@Component({
  selector: 'app-protocols-table',
  templateUrl: './protocols-table.component.html',
  styleUrl: './protocols-table.component.scss'
})
export class ProtocolsTableComponent {

  @Input() dataSource: ProtocolList[] = [];
  @Output() deleteProtocolEvent = new EventEmitter <number>();

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

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
    this.deleteProtocolEvent.emit(id);
  }

}
