import {
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';

import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-selection-card',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './selection-card.component.html',
  styleUrl: './selection-card.component.scss'
})
export class SelectionCardComponent {
  @Input({ required: true }) icon = '';
  @Input({ required: true }) title = '';
  @Input() subtitle = '';
  @Input() disabled = false;
  @Input() badge = '';

  @Output() cardClick = new EventEmitter<void>();

  handleClick(): void {
    if (!this.disabled) {
      this.cardClick.emit();
    }
  }
}