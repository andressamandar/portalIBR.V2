
import { Injectable, inject } from '@angular/core';

import {
  MatSnackBar,
  MatSnackBarConfig
} from '@angular/material/snack-bar';

export type PortalSnackbarType =
  | 'success'
  | 'error'
  | 'warning'
  | 'info';

@Injectable({
  providedIn: 'root'
})
export class PortalSnackbarService {
  private readonly snackBar = inject(MatSnackBar);

  success(
    message: string,
    duration = 4000
  ): void {
    this.open(message, 'success', duration);
  }

  error(
    message: string,
    duration = 5000
  ): void {
    this.open(message, 'error', duration);
  }

  warning(
    message: string,
    duration = 4500
  ): void {
    this.open(message, 'warning', duration);
  }

  info(
    message: string,
    duration = 4000
  ): void {
    this.open(message, 'info', duration);
  }

  private open(
    message: string,
    type: PortalSnackbarType,
    duration: number
  ): void {
    const config: MatSnackBarConfig = {
      duration,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: [
        'portal-snackbar',
        `portal-snackbar--${type}`
      ]
    };

    this.snackBar.open(
      message,
      'Fechar',
      config
    );
  }
}