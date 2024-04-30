import {Component} from '@angular/core';
import {RouterLink} from '@angular/router';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-login-page',
  standalone: true,
  templateUrl: './login-page.component.html',
  imports: [RouterLink, FormsModule],
  styleUrl: './login-page.component.scss',
})
export class LoginPageComponent {
  showPassword: boolean = false;
  password = '';

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

}
