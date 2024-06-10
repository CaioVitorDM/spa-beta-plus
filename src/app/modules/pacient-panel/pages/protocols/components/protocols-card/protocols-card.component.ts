import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProtocolList } from 'src/app/models/Protocol';

@Component({
  selector: 'app-protocols-card',
  templateUrl: './protocols-card.component.html',
  styleUrl: './protocols-card.component.scss'
})
export class ProtocolsCardComponent {

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  @Input() dataSource: ProtocolList[] = [];

  detailsProtocol(id: number) {
    this.router.navigate([`/patient-panel/protocols/details/${id}`], {relativeTo: this.activatedRoute});
  }


}
