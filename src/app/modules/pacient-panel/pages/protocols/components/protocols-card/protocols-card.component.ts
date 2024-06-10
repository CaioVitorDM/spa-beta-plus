import { Component, Input } from '@angular/core';
import { ProtocolList } from 'src/app/models/Protocol';

@Component({
  selector: 'app-protocols-card',
  templateUrl: './protocols-card.component.html',
  styleUrl: './protocols-card.component.scss'
})
export class ProtocolsCardComponent {

  @Input() dataSource: ProtocolList[] = [];

  


}
