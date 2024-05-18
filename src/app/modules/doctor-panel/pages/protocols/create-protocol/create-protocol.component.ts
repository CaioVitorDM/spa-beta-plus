import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ItemSelect } from 'src/app/components/custom-select/custom-select.component';
import { HeaderService } from 'src/app/services/header/header-info.service';

@Component({
  selector: 'app-create-protocol',
  templateUrl: './create-protocol.component.html',
  styleUrl: './create-protocol.component.scss'
})
export class CreateProtocolComponent {

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private headerService: HeaderService
  ) {
    this.headerService.setTitulo('Cadastro de Protocolo');
  }

  showPatientsSelector = false;

  togglePatientsSelector(isSpecific: boolean) {
    this.showPatientsSelector = isSpecific;
  }

  onSubmit() {
    
  }


  navigateBack() {
    this.router.navigate(['/doctor-panel/protocols'], {relativeTo: this.activatedRoute});
  }

}
