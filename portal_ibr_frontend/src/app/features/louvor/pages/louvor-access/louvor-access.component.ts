import {
  Component,
  inject
} from '@angular/core';

import { Router } from '@angular/router';

import {
  LogoComponent
} from '../../../../shared/components/ui/logo/logo.component';

import {
  SelectionCardComponent
} from '../../../../shared/components/ui/selection-card/selection-card.component';

@Component({
  selector: 'app-louvor-access',
  standalone: true,
  imports: [
    LogoComponent,
    SelectionCardComponent
  ],
  templateUrl: './louvor-access.component.html',
  styleUrl: './louvor-access.component.scss'
})
export class LouvorAccessComponent {
  private readonly router = inject(Router);

  selecionarAcesso(
    perfil: 'lideranca' | 'integrante'
  ): void {
    void this.router.navigate([
      '/louvor',
      perfil,
      'login'
    ]);
  }

  voltar(): void {
    void this.router.navigate(['/']);
  }
}