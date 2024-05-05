import {Injectable} from '@angular/core';
import {BehaviorSubject, catchError, EMPTY, Observable, throwError} from 'rxjs';
import {Router} from '@angular/router';
import {SnackbarService} from '../snackbar/snackbar.service';
import {RouterService} from '../router-service/router.service';
import {LocalStorageService} from '../local-storage/local-storage.service';
import {AuthRequest, IJWTUserDecoded, IToken} from '../../models/User';
import {ApiResponse} from '../../models/ApiResponse';
import {environment} from '../../enviroments/environment';
import {jwtDecode} from 'jwt-decode';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly apiUrlAuth = `${environment.apiPermissionUrl}/auth`;

  invalidUserOrPassword$ = new BehaviorSubject<boolean>(false);

  constructor(
    private httpClient: HttpClient,
    private router: Router,
    private snackbarService: SnackbarService,
    private routerService: RouterService,
    private localStorageService: LocalStorageService
  ) {
    this.handleError = this.handleError.bind(this);
    this.handleResponse = this.handleResponse.bind(this);
    this.invalidUserOrPassword$.next(false);
  }

  /**
   * Logs in the user by sending a POST request with login credentials.
   * @param authRequest - The login request containing user credentials.
   * @returns Observable of ApiResponse<IToken> after login attempt.
   */
  login(authRequest: AuthRequest) {
    this.httpClient
      .post<ApiResponse<IToken>>(`${this.apiUrlAuth}/authenticate`, authRequest)
      .pipe(catchError(this.handleError))
      .subscribe(this.handleResponse);
    this.invalidUserOrPassword$.next(false);
  }

  /**
   * Handles HTTP error during login.
   * @param error - The HTTP error.
   * @returns Observable of the error.
   */
  handleError(error: HttpErrorResponse): Observable<never> {
    if (error.status === 404) {
      this.invalidUserOrPassword$.next(true);
      this.router.navigate(['/login-page']);
      return EMPTY;
    }

    this.snackbarService.open(error.error.message);

    return throwError(() => error);
  }

  /**
   * Handles HTTP response after login. Setting the token and user to the local storage.
   * @param response - The HTTP response.
   */
  handleResponse(response: ApiResponse<IToken>): void {
    const user: IJWTUserDecoded = jwtDecode(response.data.token);

    this.localStorageService.setItem('token', response.data.token);
    this.localStorageService.setItem('user', JSON.stringify(user));

    this.router.navigate([this.routerService.getRouteBasedOnUserRole(user.role)]);
  }

  /**
   * Logs the user out, clears the user role, and removes the token from local storage.
   */
  logOut() {
    this.localStorageService.clear();
    this.router.navigate(['login-page']);
  }

  /**
   * Retrieves the decoded user information from the stored token.
   */
  get getUserLogged(): IJWTUserDecoded | null {
    const user = this.localStorageService.getItem<IJWTUserDecoded>('user');
    if (user !== null) {
      return user;
    }
    return null;
  }

  /**
   * Retrieves the user's token from local storage.
   */
  get getUserToken(): string | null {
    const token = this.localStorageService.getItem<string>('token');
    if (token !== null) {
      return token;
    }
    return null;
  }

  get username() {
    const user = this.getUserLogged;
    return user?.login;
  }

  /**
   * Retrieves the user's role.
   */
  get role() {
    const user = this.getUserLogged;
    return user?.role;
  }

  /**
   * Retrieves the user's Doctor ID or undefined if none.
   */
  get doctorId() {
    const user = this.getUserLogged;
    return user?.doctor;
  }

  /**
   * Retrieves the user's Patient ID or undefined if none.
   */
  get patientId() {
    const user = this.getUserLogged;
    return user?.patient;
  }

  /**
   * Checks if a user is logged in.
   * @returns {boolean} - True if the user is logged in, false otherwise.
   */
  get isLoggedIn(): boolean {
    return !!this.getUserToken && !!this.getUserLogged;
  }
}
