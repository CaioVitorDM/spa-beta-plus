import {Component, HostListener, OnInit} from '@angular/core';
import {HeaderService} from '../../services/header/header-info.service';
import {AuthService} from '../../services/auth/auth.service';
import {FileService} from '../../services/file-service/file.service';

@Component({
  selector: 'app-doctor-panel',
  templateUrl: './doctor-panel.component.html',
  styleUrl: './doctor-panel.component.scss',
})
export class DoctorPanelComponent implements OnInit {
  isSideBarOpen = false;
  isMobile: boolean = false;

  constructor(
    private headerService: HeaderService,
    private authService: AuthService,
    private fileService: FileService
  ) {}

  changeSideBarExpanded() {
    this.isSideBarOpen = !this.isSideBarOpen;
  }

  ngOnInit(): void {
    this.checkIfMobile(window.innerWidth); // Verifica no carregamento inicial
    if (this.authService.imgId) {
      this.fileService.getInlineImage(this.authService.imgId).subscribe({
        next: (blob) => {
          //Cria a URL a partir do arquivo de imagem recebido pelo back-end
          const objectURL = URL.createObjectURL(blob);

          this.headerService.setFotoUsuario(objectURL);
        },
        error: (error) => console.error('Ocorreu um erro ao carregar a imagem:', error),
      });
    } else {
      this.headerService.setFotoUsuario('assets/images/white-background.png');
    }
    this.headerService.setNomeUsuario(this.authService.username!);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.checkIfMobile(window.innerWidth);
  }

  private checkIfMobile(width: number) {
    this.isMobile = width <= 768; // Define como mobile se a largura for 768px ou menos
  }
}
