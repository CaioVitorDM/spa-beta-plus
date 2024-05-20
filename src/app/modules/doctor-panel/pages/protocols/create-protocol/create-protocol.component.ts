import { Component } from '@angular/core';
import { ItemSelect } from 'src/app/components/custom-select/custom-select.component';
import { HeaderService } from 'src/app/services/header/header-info.service';

@Component({
  selector: 'app-create-protocol',
  templateUrl: './create-protocol.component.html',
  styleUrl: './create-protocol.component.scss'
})
export class CreateProtocolComponent {

  showPatientsSelector = false;

  togglePatientsSelector(isSpecific: boolean) {
    this.showPatientsSelector = isSpecific;
  }

  constructor(private headerService: HeaderService) {
    this.headerService.setTitulo('Cadastro de Protocolo');
  }

  onSubmit() {
    
  }


}
