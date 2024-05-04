import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

interface ProfileField {
  name: string;
  label: string;
  type: string;
  value: any;
}

@Component({
  selector: 'app-profile-form',
  standalone: true,
  imports: [],
  templateUrl: './profile-form.component.html',
  styleUrl: './profile-form.component.scss'
})
export class ProfileFormComponent {
  @Input() name: string = '';
  @Input() phone: string = '';
  @Input() login: string = '';
  @Input() password: string = '';
  @Input() dynamicFields: ProfileField[] = [];

}
