import {Component} from '@angular/core';
import {FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgxMaskDirective} from 'ngx-mask';

@Component({
  selector: 'app-register-form',
  standalone: true,
  imports: [FormsModule, NgxMaskDirective, ReactiveFormsModule],
  templateUrl: './register-form.component.html',
  styleUrl: './register-form.component.scss',
})
export class RegisterFormComponent {
  registerForm!: FormGroup;
  showPassword: boolean = false;
  password = '';

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
}
