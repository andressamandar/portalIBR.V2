import {
  Component,
  inject
} from '@angular/core';

import {
  Router
} from '@angular/router';

import {
  AuthService,
  AuthUsuario
} from '../../../../core/services/auth.service';

import {
  LogoComponent
} from '../../../../shared/components/ui/logo/logo.component';

import {
  SelectionCardComponent
} from '../../../../shared/components/ui/selection-card/selection-card.component';

import {
  PortalButtonComponent
} from '../../../../shared/components/ui/portal-button/portal-button.component';


@Component({
  selector: 'app-integrante-dashboard',
  standalone: true,
  imports: [
    LogoComponent,
    SelectionCardComponent,
    PortalButtonComponent
  ],
  templateUrl: './integrante-dashboard.component.html',
  styleUrl: './integrante-dashboard.component.scss'
})
export class IntegranteDashboardComponent {

  private readonly authService =
    inject(AuthService);

  private readonly router =
    inject(Router);


  readonly usuario: AuthUsuario | null =
    this.authService.obterUsuario();


  selecionarOpcao(
    opcao:
      | 'disponibilidade'
      | 'tarefas'
      | 'minha-escala'
      | 'escala-completa'
    ): void {

    switch (opcao) {

      case 'disponibilidade':

        void this.router.navigate([
          '/midia/integrante/disponibilidade'
        ]);

        break;


      case 'tarefas':
        void this.router.navigate([
          '/midia/integrante/tarefas'
        ]);

        break;


      case 'minha-escala':

        void this.router.navigate([
          '/midia/integrante/minha-escala'
        ]);

        break;


     case 'escala-completa':

      void this.router.navigate([
        '/midia/integrante/escala-completa'
      ]);

      break;

    }

  }

  sair(): void {

    this.authService.logout();

    void this.router.navigate([
      '/midia'
    ]);

  }

}