import { Component, Input } from '@angular/core';
import { AppointmentList } from 'src/app/models/Appointment';

@Component({
  selector: 'app-appointments-table',
  templateUrl: './appointments-table.component.html',
  styleUrl: './appointments-table.component.scss'
})
export class AppointmentsTableComponent {

  @Input() dataSource: AppointmentList[] = [];

  printButton(action: string, event?: MouseEvent): void {
    if (event) {
      event.stopPropagation();
    }
    console.log(action);
  }

}
