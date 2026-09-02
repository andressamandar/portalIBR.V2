import {Component,inject} from '@angular/core';
import {Router} from '@angular/router';
import {AuthService,AuthUsuario} from '../../../../core/services/auth.service';
import {LogoComponent} from '../../../../shared/components/ui/logo/logo.component';
import {SelectionCardComponent} from '../../../../shared/components/ui/selection-card/selection-card.component';
import {PortalButtonComponent} from '../../../../shared/components/ui/portal-button/portal-button.component';


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
      | 'louvores'
      | 'minha-escala'
      | 'escala-completa'
    ): void {

    if (
      opcao ===
      'disponibilidade'
    ) {

      void this.router.navigate([
        '/louvor/integrante/disponibilidade'
      ]);

      return;
    }


    if (
      opcao ===
      'louvores'
    ) {

      void this.router.navigate([
        '/louvor/integrante/louvores'
      ]);

      return;
    }


    if (
      opcao ===
      'minha-escala'
    ) {

      void this.router.navigate([
        '/louvor/integrante/minha-escala'
      ]);

      return;
    }


    if (
      opcao ===
      'escala-completa'
    ) {

      void this.router.navigate([
        '/louvor/integrante/escala-completa'
      ]);

      return;
    }

  }

  sair(): void {

    this.authService.logout();

    void this.router.navigate([
      '/louvor'
    ]);
  }

}