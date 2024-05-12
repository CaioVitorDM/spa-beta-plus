import {Component, HostListener, OnInit} from '@angular/core';
import {HeaderService} from '../../services/header/header-info.service';
import {AuthService} from '../../services/auth/auth.service';
import {FileService} from '../../services/file-service/file.service';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';

@Component({
  selector: 'app-pacient-panel',
  templateUrl: './pacient-panel.component.html',
  styleUrl: './pacient-panel.component.scss',
})
export class PacientPanelComponent implements OnInit {
  isSideBarOpen: boolean = false;
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
    this.checkIfMobile(window.innerWidth); // Verifica no carregamento inicial
    this.headerService.setNomeUsuario(this.authService.username!);
  }

  handleToggle(status: boolean) {
    this.isSideBarOpen = status;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.checkIfMobile(window.innerWidth);
  }

  private checkIfMobile(width: number) {
    this.isMobile = width <= 768; // Define como mobile se a largura for 768px ou menos
  }
}
