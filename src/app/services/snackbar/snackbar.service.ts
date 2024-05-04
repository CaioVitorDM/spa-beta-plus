import {Injectable} from '@angular/core';
import {MatSnackBar, MatSnackBarConfig} from '@angular/material/snack-bar';

/**
 * Service for displaying snackbar notifications in the application.
 */
@Injectable({
  providedIn: 'root',
})
export class SnackbarService {
  constructor(private snackBar: MatSnackBar) {}

  /**
   * Opens a snackbar notification with the specified message and options.
   * @param message - The message to display in the snackbar.
   * @param action - The label for the action button in the snackbar.
   * @param duration - The duration (in milliseconds) for which the snackbar is visible.
   * @param config - Additional configuration options for the snackbar.
   */
  open(message: string, action = 'Fechar', duration = 5000, config?: MatSnackBarConfig) {
    this.snackBar.open(message, action, {
      duration: duration,
      ...config,
    });
  }
}
