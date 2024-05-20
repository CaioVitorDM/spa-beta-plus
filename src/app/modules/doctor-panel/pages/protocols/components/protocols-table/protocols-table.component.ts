import { Component } from '@angular/core';
import { ProtocolList } from 'src/app/models/Protocol';

@Component({
  selector: 'app-protocols-table',
  templateUrl: './protocols-table.component.html',
  styleUrl: './protocols-table.component.scss'
})
export class ProtocolsTableComponent {
  dataSource: ProtocolList[] = [
    {
      id: 1,
      name: 'P1',
      createdAt: '1985-05-16',
    },
    {
      id: 2,
      name: 'P2',
      createdAt: '1990-07-23',
    },
    {
      id: 3,
      name: 'P3',
      createdAt: '1979-02-12',
    },
    {
      id: 4,
      name: 'P4',
      createdAt: '1964-10-01',
    },
  ];

  printButton(action: string, event?: MouseEvent): void {
    if (event) {
      event.stopPropagation();
    }
    console.log(action);
  }

}
