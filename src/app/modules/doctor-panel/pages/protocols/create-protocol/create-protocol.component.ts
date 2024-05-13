import { Component } from '@angular/core';
import { HeaderService } from 'src/app/services/header/header-info.service';

@Component({
  selector: 'app-create-protocol',
  templateUrl: './create-protocol.component.html',
  styleUrl: './create-protocol.component.scss'
})
export class CreateProtocolComponent {


  constructor(private headerService: HeaderService) {
    this.headerService.setTitulo('Cadastro de Protocolo');
  }

  onSubmit() {
    
  }

}
