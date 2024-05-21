import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { PatientList } from 'src/app/models/User';

@Component({
  selector: 'app-beta-general',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule
  ],
  templateUrl: './beta-general.component.html',
  styleUrls: ['./beta-general.component.scss']
})
export class BetaGeneralComponent implements OnInit {
  @Input() dataSource: PatientList[] = [];
  sortOrder: 'asc' | 'desc' = 'desc'; // Estado da ordenação

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
        name: '500',
        birthDate: '2024-04-05',
        phoneNumber: '123-456-7890',
        email: 'john.doe@example.com'
      },
      {
        id: 2,
        createdAt: '2023-05-21T10:00:00Z',
        name: '1000',
        birthDate: '2024-03-05',
        phoneNumber: '987-654-3210',
        email: 'jane.smith@example.com'
      },
      {
        id: 3,
        createdAt: '2023-05-22T10:00:00Z',
        name: '1500',
        birthDate: '2024-05-05',
        phoneNumber: '555-555-5555',
        email: 'alice.johnson@example.com'
      }
    ];

    // Ordena por padrão de forma decrescente
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

  editUser(id: number) {
    this.router.navigate([`/doctor-panel/patients/edit/${id}`], {relativeTo: this.activatedRoute});
  }

  deleteUser(id: number) {
    console.log('delete ' + id);
  }
}
