import {Component, OnInit} from '@angular/core';
import {RouterLink} from '@angular/router';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {AuthService} from '../../services/auth/auth.service';
import {LocalStorageService} from '../../services/local-storage/local-storage.service';
import {HttpClientModule} from '@angular/common/http';
import {FormUtilsService} from '../../services/form-utils/form-utils.service';
import {AuthRequest} from '../../models/User';
@Component({
  selector: 'app-login-page',
  standalone: true,
  templateUrl: './login-page.component.html',
  imports: [RouterLink, FormsModule, HttpClientModule, ReactiveFormsModule],
  styleUrl: './login-page.component.scss',
  providers: [AuthService, FormUtilsService, LocalStorageService],
})
export class LoginPageComponent implements OnInit {
  showPassword: boolean = false;
  password = '';
  invalidUserOrPassword$ = this.authService.invalidUserOrPassword$;
  isLoading = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private formUtilsService: FormUtilsService,
    private localStorageService: LocalStorageService
  ) {}

  ngOnInit(): void {
    this.localStorageService.clear();
  }

  loginForm: FormGroup = this.formBuilder.group({
    login: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required, Validators.minLength(3)]),
  });

  validateAllFormFields(formGroup: FormGroup) {
    this.formUtilsService.validateAllFormFields(formGroup);
  }

  onLogin() {
    if (this.loginForm.invalid) {
      this.validateAllFormFields(this.loginForm);
      return;
    }

    this.isLoading = true;

    const request = this.loginForm.getRawValue() as AuthRequest;
    this.authService.login(request);

    this.isLoading = false;
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
}
