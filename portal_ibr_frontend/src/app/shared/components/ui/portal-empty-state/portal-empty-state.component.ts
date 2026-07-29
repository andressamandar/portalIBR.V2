import {
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';

import { MatIconModule } from '@angular/material/icon';

import {
  PortalButtonComponent
} from '../portal-button/portal-button.component';

@Component({
  selector: 'app-portal-empty-state',
  standalone: true,
  imports: [
    MatIconModule,
    PortalButtonComponent
  ],
  templateUrl: './portal-empty-state.component.html',
  styleUrl: './portal-empty-state.component.scss'
})
export class PortalEmptyStateComponent {
  @Input() icon = 'inbox';
  @Input() title = 'Nenhum registro encontrado';
  @Input() message = '';

  @Input() actionText = '';
  @Input() actionIcon = '';

  @Output() actionClick = new EventEmitter<void>();

  handleAction(): void {
    this.actionClick.emit();
  }
}