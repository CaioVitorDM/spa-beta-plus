import {Component} from '@angular/core';
import {UserList} from '../../../../../../models/User';

@Component({
  selector: 'app-patients-table',
  templateUrl: './patients-table.component.html',
  styleUrl: './patients-table.component.scss',
})
export class PatientsTableComponent {
  dataSource: UserList[] = [
    {
      id: 1,
      name: 'Alice Jones',
      birthDate: '1985-05-16',
      phoneNumber: '555-1234',
      email: 'alice.jones@example.com',
    },
    {
      id: 2,
      name: 'Bob Smith',
      birthDate: '1990-07-23',
      phoneNumber: '555-5678',
      email: 'bob.smith@example.com',
    },
    {
      id: 3,
      name: 'Carol White',
      birthDate: '1979-02-12',
      phoneNumber: '555-9876',
      email: 'carol.white@example.com',
    },
    {
      id: 4,
      name: 'David Brown',
      birthDate: '1964-10-01',
      phoneNumber: '555-6543',
      email: 'david.brown@example.com',
    },
  ];

  printButton(action: string, event?: MouseEvent): void {
    if (event) {
      event.stopPropagation();
    }
    console.log(action);
  }
}
