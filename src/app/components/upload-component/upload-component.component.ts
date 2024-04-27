import {Component} from '@angular/core';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-upload-component',
  standalone: true,
  imports: [NgIf],
  templateUrl: './upload-component.component.html',
  styleUrl: './upload-component.component.scss',
})
export class UploadComponentComponent {
  protected readonly innerWidth = innerWidth;
  protected readonly innerHeight = innerHeight;
}
