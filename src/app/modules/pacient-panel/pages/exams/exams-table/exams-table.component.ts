import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {CommonModule} from '@angular/common';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import {PatientList} from 'src/app/models/User';

@Component({
  selector: 'app-exams-table',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, MatMenuModule],
  templateUrl: './exams-table.component.html',
  styleUrl: './exams-table.component.scss',
})
export class ExamsTableComponent implements OnInit {
  @Input() dataSource: PatientList[] = [];
  sortOrder: 'asc' | 'desc' = 'desc';

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Mocking data
    this.dataSource = [
      {
        id: 1,
        createdAt: '2023-05-20T10:00:00Z',
        name: 'Exame #C3',
        birthDate: '2024-04-05',
        phoneNumber: 'Exame de Sangue',
        email: 'john.doe@example.com',
        patientId: 1,
      },
      {
        id: 2,
        createdAt: '2023-05-21T10:00:00Z',
        name: 'Exame #206',
        birthDate: '2024-03-05',
        phoneNumber: 'Exame de Imagem',
        email: 'jane.smith@example.com',
        patientId: 2,
      },
      {
        id: 3,
        createdAt: '2023-05-22T10:00:00Z',
        name: 'Exame #RS5',
        birthDate: '2024-05-05',
        phoneNumber: 'Exame de Sangue',
        email: 'alice.johnson@example.com',
        patientId: 3,
      },
    ];
    this.sortByBirthDate();
  }

  sortByBirthDate(): void {
    this.dataSource.sort((a, b) => {
      const dateA = new Date(a.birthDate).getTime();
      const dateB = new Date(b.birthDate).getTime();

      if (this.sortOrder === 'asc') {
        return dateA - dateB;
      } else {
        return dateB - dateA;
      }
    });
  }

  toggleSortOrder(): void {
    this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    this.sortByBirthDate();
  }

  printButton(action: string, event?: MouseEvent): void {
    if (event) {
      event.stopPropagation();
    }
    console.log(action);
  }

  navigateToCreatePage() {}

  //To-do
  editUser(id: number) {
    this.router.navigate([`/doctor-panel/patients/edit/${id}`], {relativeTo: this.activatedRoute});
  }

  deleteUser(id: number) {
    console.log('delete ' + id);
  }
}
