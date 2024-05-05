import {Component, OnInit} from '@angular/core';
import {HeaderService} from '../../../../services/header/header-info.service';
import {AuthService} from '../../../../services/auth/auth.service';

@Component({
  selector: 'app-doctor-dashboard',
  templateUrl: './doctor-dashboard.component.html',
  styleUrl: './doctor-dashboard.component.scss',
})
export class DoctorDashboardComponent implements OnInit {
  constructor(
    private headerService: HeaderService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.headerService.setTitulo('Dashboard');
    this.headerService.setNomeUsuario(this.authService.username!);
  }
}
