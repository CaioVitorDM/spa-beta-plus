import {Component, Input} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {NgxMaskDirective} from 'ngx-mask';

@Component({
  selector: 'app-details-card',
  standalone: true,
  imports: [FormsModule, CommonModule, NgxMaskDirective],
  templateUrl: './details-card.component.html',
  styleUrl: './details-card.component.scss',
})
export class DetailsCardComponent {
  @Input() imageSrc: string = '';
  @Input() name: string = '';
  @Input() title: string = 'Detalhes';
  @Input() details: {label: string; value: string}[] = [];
}
