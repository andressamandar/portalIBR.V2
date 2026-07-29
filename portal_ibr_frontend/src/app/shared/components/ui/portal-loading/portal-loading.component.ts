import { Component, Input } from '@angular/core';

import {
  MatProgressSpinnerModule
} from '@angular/material/progress-spinner';

@Component({
  selector: 'app-portal-loading',
  standalone: true,
  imports: [
    MatProgressSpinnerModule
  ],
  templateUrl: './portal-loading.component.html',
  styleUrl: './portal-loading.component.scss'
})
export class PortalLoadingComponent {
  @Input() message = 'Carregando...';
}
