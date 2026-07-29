import {
  Component,
  inject
} from '@angular/core';

import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef
} from '@angular/material/dialog';

import { MatIconModule } from '@angular/material/icon';

import {
  PortalButtonComponent
} from '../portal-button/portal-button.component';

export type PortalDialogType =
  | 'confirm'
  | 'danger'
  | 'info';

export interface PortalDialogData {
  title: string;
  message: string;

  type?: PortalDialogType;
  icon?: string;

  confirmText?: string;
  cancelText?: string;

  showCancel?: boolean;
}

@Component({
  selector: 'app-portal-dialog',
  standalone: true,
  imports: [
    MatDialogModule,
    MatIconModule,
    PortalButtonComponent
  ],
  templateUrl: './portal-dialog.component.html',
  styleUrl: './portal-dialog.component.scss'
})
export class PortalDialogComponent {
  readonly data = inject<PortalDialogData>(
    MAT_DIALOG_DATA
  );

  private readonly dialogRef = inject(
    MatDialogRef<PortalDialogComponent, boolean>
  );

  get dialogType(): PortalDialogType {
    return this.data.type ?? 'confirm';
  }

  get confirmText(): string {
    return this.data.confirmText ?? 'Confirmar';
  }

  get cancelText(): string {
    return this.data.cancelText ?? 'Cancelar';
  }

  get showCancel(): boolean {
    return this.data.showCancel ?? true;
  }

  get icon(): string {
    if (this.data.icon) {
      return this.data.icon;
    }

    if (this.dialogType === 'danger') {
      return 'warning';
    }

    if (this.dialogType === 'info') {
      return 'info';
    }

    return 'help';
  }

  confirm(): void {
    this.dialogRef.close(true);
  }

  cancel(): void {
    this.dialogRef.close(false);
  }
}