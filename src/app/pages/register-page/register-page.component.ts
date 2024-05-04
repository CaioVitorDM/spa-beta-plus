import {Component} from '@angular/core';
import {NgxMaskDirective, provideNgxMask} from 'ngx-mask';
import {FormsModule} from '@angular/forms';
import {UploadComponentComponent} from '../../components/upload-component/upload-component.component';
import {RegisterFormComponent} from './register-form/register-form.component';
import {RegisterSubmit} from './service/register-submit';

@Component({
  selector: 'app-register-page',
  standalone: true,
  templateUrl: './register-page.component.html',
  imports: [NgxMaskDirective, FormsModule, UploadComponentComponent, RegisterFormComponent],
  providers: [provideNgxMask()],
  styleUrl: './register-page.component.scss',
})
export class RegisterPageComponent {
  submit: boolean = false;
  constructor(private registerSubmit: RegisterSubmit) {}

  submitForm() {
    this.registerSubmit.triggerSubmit();
  }
}
