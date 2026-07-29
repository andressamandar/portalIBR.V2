import {
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';

import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

export type PortalButtonVariant =
  | 'primary'
  | 'secondary'
  | 'outline'
  | 'danger'
  | 'text';

export type PortalButtonType =
  | 'button'
  | 'submit'
  | 'reset';

@Component({
  selector: 'app-portal-button',
  standalone: true,
  imports: [
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './portal-button.component.html',
  styleUrl: './portal-button.component.scss'
})
export class PortalButtonComponent {
  @Input() type: PortalButtonType = 'button';
  @Input() variant: PortalButtonVariant = 'primary';

  @Input() icon = '';
  @Input() loading = false;
  @Input() disabled = false;
  @Input() fullWidth = false;

  @Input() ariaLabel = '';
  @Input() loadingText = 'Carregando';

  @Output() buttonClick = new EventEmitter<void>();

  get isDisabled(): boolean {
    return this.disabled || this.loading;
  }

  handleClick(): void {
    if (this.isDisabled) {
      return;
    }

    this.buttonClick.emit();
  }
}