import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {NgIf} from '@angular/common';
import {SidebarToggleService} from '../../services/header/sidebar-toggle.service';
import {HeaderService} from '../../services/header/header-info.service';
import {RouterModule} from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [NgIf, RouterModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  @Input() titulo: string | null = null; // O título é opcional e pode variar
  @Input() numero: number | null = null; // O número é opcional
  @Input() nomeUsuario: string = '';
  @Input() fotoUsuario: string = '';
  @Input() rotaPerfil: string = '';

  constructor(
    private sidebarToggleService: SidebarToggleService,
    private headerService: HeaderService
  ) {}

  ngOnInit(): void {
    this.headerService.titulo$.subscribe((titulo) => (this.titulo = titulo));
    this.headerService.numero$.subscribe((numero) => (this.numero = numero));
    this.headerService.nomeUsuario$.subscribe((nome) => (this.nomeUsuario = nome));
    this.headerService.fotoUsuario$.subscribe((foto) => (this.fotoUsuario = foto));
  }

  aoClicarSidebar() {
    this.sidebarToggleService.triggerFunction();
  }

  ngOnDestroy(): void {
    this.titulo = '';
    this.numero = null;
    this.nomeUsuario = '';
    this.fotoUsuario = '';
  }
}
