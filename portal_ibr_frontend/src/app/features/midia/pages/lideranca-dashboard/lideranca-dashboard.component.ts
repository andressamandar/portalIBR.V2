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
  selector: 'app-lideranca-dashboard',
  standalone: true,
  imports: [
    LogoComponent,
    SelectionCardComponent,
    PortalButtonComponent
  ],
  templateUrl: './lideranca-dashboard.component.html',
  styleUrl: './lideranca-dashboard.component.scss'
})
export class LiderancaDashboardComponent {

  private readonly authService =
    inject(AuthService);

  private readonly router =
    inject(Router);


  readonly usuario: AuthUsuario | null =
    this.authService.obterUsuario();


  selecionarOpcao(
    opcao:
      | 'escala'
      | 'integrantes'
      | 'tarefas'
  ): void {

    switch (opcao) {

      case 'escala':

        void this.router.navigate([
          '/midia/lideranca/escala'
        ]);

        break;


      case 'integrantes':

        void this.router.navigate([
          '/midia/lideranca/integrantes'
        ]);

        break;


      case 'tarefas':

        console.log(
          'Tarefas'
        );

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