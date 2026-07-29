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
  selector: 'app-midia-access',
  standalone: true,
  imports: [
    LogoComponent,
    SelectionCardComponent
  ],
  templateUrl: './midia-access.component.html',
  styleUrl: './midia-access.component.scss'
})
export class MidiaAccessComponent {
  private readonly router = inject(Router);

  selecionarAcesso(
    perfil: 'lideranca' | 'integrante' | 'solicitacoes'
  ): void {
    if (perfil === 'solicitacoes') {
      void this.router.navigate([
        '/midia',
        'solicitacoes'
      ]);

      return;
    }

    void this.router.navigate([
      '/midia',
      perfil,
      'login'
    ]);
  }

  voltar(): void {
    void this.router.navigate(['/']);
  }
}